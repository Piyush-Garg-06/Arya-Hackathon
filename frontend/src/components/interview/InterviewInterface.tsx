import FeedbackPanel, {
  type PerQuestionFeedback,
} from "@/components/interview/FeedbackPanel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  SkipForward,
  Volume2,
} from "lucide-react";
import InterviewAvatar from "./InterviewAvatar";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Question {
  id: number;
  text: string;
  hint: string;
  timeLimit: number;
  category?: string;
}

interface InterviewInterfaceProps {
  interviewType: string;
  questions: Question[];
  onComplete: (answers: string[]) => void;
  role?: string;
  perQuestionFeedback?: PerQuestionFeedback[];
}

// SVG Avatar removed, using InterviewAvatar component instead.

// Countdown timer circle
function TimerCircle({
  timeLeft,
  totalTime,
}: { timeLeft: number; totalTime: number }) {
  const pct = totalTime > 0 ? timeLeft / totalTime : 0;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = circ * pct;
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 30;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      data-ocid="interview.timer_panel"
      className="relative flex items-center justify-center w-20 h-20"
    >
      <svg width="80" height="80" className="-rotate-90" aria-hidden="true">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="oklch(0.3 0.05 260)"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={
            isUrgent
              ? "oklch(0.65 0.25 25)"
              : isWarning
                ? "oklch(0.78 0.18 65)"
                : "oklch(0.62 0.255 295)"
          }
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
        />
      </svg>
      <div className="absolute text-center">
        <span
          className={`font-mono font-bold text-sm leading-none ${
            isUrgent
              ? "text-red-400"
              : isWarning
                ? "text-amber-400"
                : "text-foreground"
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

const WAVEFORM_HEIGHTS = [3, 5, 8, 6, 9, 7, 4, 6, 8, 5, 3, 7, 9, 6, 4];

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-10" aria-hidden="true">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative array
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: active
              ? "linear-gradient(to top, oklch(0.55 0.2 260), oklch(0.7 0.25 295))"
              : "oklch(0.4 0.05 260)",
          }}
          animate={
            active
              ? { height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] }
              : { height: `${h * 1.5}px` }
          }
          transition={
            active
              ? {
                  duration: 0.5 + (i % 4) * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Behavioral: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Technical: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Situational: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export default function InterviewInterface({
  interviewType,
  questions,
  onComplete,
  role = "Software Engineer",
  perQuestionFeedback = [],
}: InterviewInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit ?? 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"voice" | "text">("voice");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] =
    useState<PerQuestionFeedback | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalTime = currentQuestion?.timeLimit ?? 60;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentIndex intentionally resets the timer
  useEffect(() => {
    if (!isRunning) return;
    
    // Auto-read question on change
    speakText(currentQuestion?.text);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timerRef.current!);
      window.speechSynthesis?.cancel();
    };
  }, [isRunning, currentIndex]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsAvatarSpeaking(true);
    utterance.onend = () => setIsAvatarSpeaking(false);
    utterance.onerror = () => setIsAvatarSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isListeningForSpeech, setIsListeningForSpeech] = useState(false);

  const goToQuestion = (idx: number) => {
    clearInterval(timerRef.current!);
    setCurrentIndex(idx);
    setTimeLeft(questions[idx]?.timeLimit ?? 60);
    setIsRunning(true);
    setIsSpeaking(false);
    setShowFeedback(false);
    setCurrentFeedback(null);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current!);
    setIsRunning(false);
    setIsSpeaking(false);
    const fb = perQuestionFeedback[currentIndex] ?? null;
    if (fb) {
      setCurrentFeedback(fb);
      setShowFeedback(true);
    } else {
      handleNext();
    }
  };

  const handleFeedbackNext = () => {
    setShowFeedback(false);
    setCurrentFeedback(null);
    handleNext();
  };

  const toggleSpeaking = () => {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    if (isListeningForSpeech) {
      setIsListeningForSpeech(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListeningForSpeech(true);
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0].transcript)
        .join("");
      const newAnswers = [...answers];
      newAnswers[currentIndex] = transcript;
      setAnswers(newAnswers);
    };
    recognition.onend = () => setIsListeningForSpeech(false);
    recognition.start();
  };

  const statusLabel = isListeningForSpeech
    ? "Listening..."
    : isAvatarSpeaking
      ? "Speaking..."
      : timeLeft === 0
        ? "Time's Up"
        : "Ready";
  const statusColor = isListeningForSpeech
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    : isAvatarSpeaking
      ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
      : timeLeft === 0
        ? "bg-red-500/15 text-red-300 border-red-500/30"
        : "bg-slate-500/15 text-slate-300 border-slate-500/30";

  const categoryColor =
    CATEGORY_COLORS[interviewType] ??
    "bg-primary/10 text-primary border-primary/30";

  return (
    <div className="flex flex-col gap-4">
      {/* Two-column area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* ── LEFT: AI Interviewer ── */}
        <div className="lg:col-span-2">
          <div
            className="glass-card p-6 flex flex-col items-center gap-5 h-full min-h-[320px] relative overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.2 0.05 280 / 0.9) 0%, oklch(0.15 0.04 260 / 0.95) 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 30%, oklch(0.45 0.2 290 / 0.12), transparent)",
              }}
            />

            <InterviewAvatar state={isAvatarSpeaking ? "speaking" : isListeningForSpeech ? "listening" : "idle"} />

            <div className="text-center z-10">
              <p className="font-display font-bold text-lg text-foreground">
                AI Interviewer
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Interviewing for: {role}
              </p>
            </div>

            <span
              className={`z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
            >
              {(isListeningForSpeech || isAvatarSpeaking) && (
                <span className={`w-1.5 h-1.5 rounded-full ${isListeningForSpeech ? "bg-emerald-400" : "bg-blue-400"} animate-pulse`} />
              )}
              {showFeedback ? "Reviewing..." : statusLabel}
            </span>

            <div className="w-full z-10 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Question panel ── */}
        <div className="lg:col-span-3">
          <div
            className="glass-card p-6 h-full min-h-[320px] flex flex-col gap-4 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.18 0.04 250 / 0.9) 0%, oklch(0.14 0.03 240 / 0.95) 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-black text-sm text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.5 0.2 260))",
                  }}
                >
                  Q{currentIndex + 1}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColor}`}
                >
                  {interviewType}
                </span>
              </div>
              <TimerCircle timeLeft={timeLeft} totalTime={totalTime} />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-xs text-amber-300/80 font-medium">
                STAR Method:
              </span>
              {["Situation", "Task", "Action", "Result"].map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/70 text-xs border border-amber-500/20"
                >
                  {s}
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex-1 flex flex-col justify-center"
              >
                <p className="text-xl font-display font-semibold text-foreground leading-relaxed">
                  {currentQuestion?.text}
                </p>
                <p className="mt-3 text-sm text-muted-foreground italic">
                  💡 {currentQuestion?.hint}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Button
                data-ocid="interview.prev_button"
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0 || showFeedback}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} / {questions.length}
              </span>
              <Button
                data-ocid="interview.next_button"
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1 || showFeedback}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Answer area OR Feedback panel ── */}
      <AnimatePresence mode="wait">
        {showFeedback && currentFeedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeedbackPanel
              {...currentFeedback}
              onNext={handleFeedbackNext}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="glass-card p-6"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.16 0.04 255 / 0.92) 0%, oklch(0.12 0.03 240 / 0.96) 100%)",
              }}
            >
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "voice" | "text")}
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger
                      data-ocid="interview.voice_tab"
                      value="voice"
                      className="gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <Mic className="w-3.5 h-3.5" /> Voice
                    </TabsTrigger>
                    <TabsTrigger
                      data-ocid="interview.text_tab"
                      value="text"
                      className="gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M2 2h12v2H2zm0 4h12v2H2zm0 4h8v2H2z" />
                      </svg>
                      Text
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    data-ocid="interview.skip_button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearInterval(timerRef.current!);
                      handleNext();
                    }}
                    className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                  >
                    <SkipForward className="w-3.5 h-3.5" /> Skip Question
                  </Button>
                </div>

                <TabsContent value="voice">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div
                      className="flex-1 flex items-center justify-center gap-4 px-6 py-5 rounded-xl border w-full"
                      style={{
                        background: "oklch(0.15 0.04 255 / 0.6)",
                        borderColor: isSpeaking
                          ? "oklch(0.55 0.22 295 / 0.4)"
                          : "oklch(0.3 0.05 260 / 0.4)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: isSpeaking
                            ? "linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.5 0.2 260))"
                            : "oklch(0.25 0.05 260)",
                        }}
                      >
                        {isListeningForSpeech ? (
                          <Mic className="w-6 h-6 text-white" />
                        ) : (
                          <MicOff className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <Waveform active={isListeningForSpeech || isAvatarSpeaking} />
                    </div>

                    <Button
                      data-ocid="interview.start_speaking_button"
                      onClick={toggleSpeaking}
                      className="w-full sm:w-auto px-8 py-3 gap-2 font-semibold shrink-0"
                      style={{
                        background: isListeningForSpeech
                          ? "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.6 0.2 15))"
                          : "linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.5 0.2 260))",
                        boxShadow: isListeningForSpeech
                          ? "0 4px 24px oklch(0.65 0.22 25 / 0.3)"
                          : "0 4px 24px oklch(0.55 0.22 295 / 0.3)",
                      }}
                    >
                      {isListeningForSpeech ? (
                        <>
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 0.8,
                            }}
                          >
                            <MicOff className="w-4 h-4" />
                          </motion.span>
                          Stop Answering
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          Answer with Voice
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="text">
                  <div className="space-y-3">
                    <Textarea
                      data-ocid="interview.answer_textarea"
                      value={answers[currentIndex]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[currentIndex] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      placeholder="Type your answer here… Use the STAR method: Situation, Task, Action, Result"
                      className="min-h-[140px] resize-none bg-white/5 border-white/10 focus:border-primary/50 text-sm placeholder:text-muted-foreground/50"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {answers[currentIndex]?.length ?? 0} characters
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-5">
                <Button
                  data-ocid="interview.submit_button"
                  onClick={handleSubmit}
                  className="w-full py-3 gap-2 font-semibold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.5 0.2 260), oklch(0.48 0.18 240))",
                    boxShadow: "0 4px 32px oklch(0.55 0.22 295 / 0.25)",
                  }}
                >
                  <Send className="w-4 h-4" />
                  {currentIndex < questions.length - 1
                    ? "Submit & Get Feedback"
                    : "Submit Interview"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
