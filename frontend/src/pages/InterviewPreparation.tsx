import type { PerQuestionFeedback } from "@/components/interview/FeedbackPanel";
import FeedbackPanel from "@/components/interview/FeedbackPanel";
import InterviewInterface from "@/components/interview/InterviewInterface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Code,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { interviewService } from "@/services/interviewService";
import { useQuery } from "@tanstack/react-query";

// Mock data removed in favor of real AI evaluation from backend.

// Final session and evaluation logic moved to local state and services.
const difficulties = [
  { id: "beginner", label: "Beginner", icon: MessageSquare, color: "text-green-400" },
  { id: "intermediate", label: "Intermediate", icon: Trophy, color: "text-blue-400" },
  { id: "advanced", label: "Advanced", icon: Trophy, color: "text-purple-400" },
];

export default function InterviewPreparation() {
  const [phase, setPhase] = useState<"select" | "difficulty" | "interview" | "feedback">("select");
  const [selectedDifficulty, setSelectedDifficulty] = useState<any>("beginner");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const { role } = useSearch({ from: "/shell/interview-preparation" });
  const navigate = useNavigate();

  const handleStartSelection = () => setPhase("difficulty");

  const handleStartInterview = async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    toast.loading("AI is preparing your interview questions...");
    try {
      const session = await interviewService.generateQuestions(role || "General Professional", difficulty as any);
      const mappedQuestions = session.questions.map((q: any, i: number) => ({
        id: i + 1,
        text: q.questionText,
        hint: q.expectedKeyPoints?.[0] || "Remember to use the STAR method.",
        timeLimit: 180,
        category: q.category
      }));
      setQuestions(mappedQuestions);
      setSessionId(session.id);
      setPhase("interview");
      toast.dismiss();
    } catch (error: any) {
      toast.error("Failed to start interview: " + error.message);
      toast.dismiss();
    }
  };

  const handleComplete = async (_answers: string[]) => {
    if (!sessionId) {
      toast.error("Invalid session. Please restart your interview.");
      return;
    }
    const loadingToast = toast.loading("Analyzing your performance and generating feedback...");
    try {
      // Evaluate each answer first
      for (let i = 0; i < questions.length; i++) {
        await interviewService.evaluateAnswer(sessionId, questions[i].text, _answers[i]);
      }
      
      const sessionResult = await interviewService.completeSession(sessionId);
      setResults(sessionResult.session);
      setPhase("feedback");
      toast.success(`Interview complete! You earned ${sessionResult.xpEarned} XP`, { id: loadingToast });
    } catch (error: any) {
      toast.error("Evaluation failed: " + error.message, { id: loadingToast });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
                AI Mock Interview
              </h1>
              <p className="text-muted-foreground text-lg">
                Practice realistic company-style interviews with our AI coach Aria.
              </p>
            </div>

            <div className="glass-card p-10 flex flex-col items-center text-center gap-6 border-primary/20 bg-primary/5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Ready to Shine?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {role ? `Aria will conduct a specialized interview for: ${role}` : "Aria will test your professional skills across various categories."}
                </p>
              </div>
              <Button onClick={handleStartSelection} className="gradient-btn px-10 py-6 text-lg">
                Start Mock Interview
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "difficulty" && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
              <Button variant="ghost" onClick={() => setPhase("select")} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <h2 className="text-3xl font-display font-bold">Select Difficulty</h2>
              <div className="grid grid-cols-1 gap-4">
                  {difficulties.map((d) => (
                      <Card 
                        key={d.id} 
                        className="p-6 cursor-pointer hover:border-primary/50 transition-all group"
                        onClick={() => handleStartInterview(d.id)}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl bg-white/5 ${d.color}`}>
                                  <d.icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 text-left">
                                  <h3 className="font-bold text-xl">{d.label}</h3>
                                  <p className="text-sm text-muted-foreground">Tailored questions for {d.id} levels</p>
                              </div>
                              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      </Card>
                  ))}
              </div>
          </motion.div>
        )}

        {phase === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhase("difficulty")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Exit
              </Button>
              <h2 className="font-display font-bold text-2xl text-foreground">
                In Session
              </h2>
            </div>
            <InterviewInterface
              interviewType={`AI ${selectedDifficulty}`}
              questions={questions}
              onComplete={handleComplete}
              role={role}
            />
          </motion.div>
        )}

        {phase === "feedback" && results && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-2xl text-foreground">
                Final Evaluation
              </h2>
              <Button
                variant="outline"
                onClick={() => setPhase("select")}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Dashboard
              </Button>
            </div>
            
            <FeedbackPanel
              score={Math.round(results.averageScore)}
              strengths={["Technical accuracy", "Confidence"]}
              improvements={["Be more specific with STAR"]}
              suggestedAnswer={`Overall Review: ${results.feedback}`}
              onNext={() => setPhase("select")}
              isLastQuestion={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
