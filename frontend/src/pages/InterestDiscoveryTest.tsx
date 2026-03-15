import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

const questions = [
  {
    id: 1,
    question: "Which activity do you enjoy most?",
    options: [
      "Building websites",
      "Analyzing data",
      "Designing interfaces",
      "Solving complex problems",
    ],
  },
  {
    id: 2,
    question: "How do you prefer to spend your free time?",
    options: [
      "Writing code or scripts",
      "Creating art or designs",
      "Reading research papers",
      "Mentoring others",
    ],
  },
  {
    id: 3,
    question: "What kind of challenges excite you?",
    options: [
      "Engineering systems at scale",
      "Making things visually beautiful",
      "Finding patterns in data",
      "Organizing people and projects",
    ],
  },
  {
    id: 4,
    question: "Which tool would you most enjoy mastering?",
    options: [
      "VS Code / terminal",
      "Figma / Sketch",
      "Python / Jupyter",
      "Notion / spreadsheets",
    ],
  },
  {
    id: 5,
    question: "What type of work environment suits you?",
    options: [
      "Deep focus, minimal interruptions",
      "Creative studio with visual stimulation",
      "Research lab or data center",
      "Open office with lots of meetings",
    ],
  },
  {
    id: 6,
    question: "Which skill do you most want to develop?",
    options: [
      "Programming and system architecture",
      "Visual design and prototyping",
      "Machine learning and statistics",
      "Business strategy and leadership",
    ],
  },
  {
    id: 7,
    question: "What outcome makes you most proud?",
    options: [
      "Shipping a feature used by thousands",
      "Designing something people love",
      "Discovering a key business insight",
      "Growing a high-performing team",
    ],
  },
  {
    id: 8,
    question: "How do you approach a new project?",
    options: [
      "Plan the tech stack first",
      "Sketch wireframes and flows",
      "Define metrics and hypotheses",
      "Build a roadmap and delegate",
    ],
  },
  {
    id: 9,
    question: "What subject did you enjoy most in school?",
    options: [
      "Math or computer science",
      "Art or graphic design",
      "Statistics or economics",
      "Social studies or psychology",
    ],
  },
  {
    id: 10,
    question: "What drives you in your career?",
    options: [
      "Building things people use every day",
      "Creating beautiful, meaningful experiences",
      "Discovering insights from complex data",
      "Growing a team and driving impact",
    ],
  },
];

export default function InterestDiscoveryTest() {
  const navigate = useNavigate();
  const { setQuizAnswers } = useAppContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [selected, setSelected] = useState<string | null>(answers[0] || null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const progress = ((currentQ + 1) / questions.length) * 100;
  const q = questions[currentQ];

  const handleSelect = (option: string) => setSelected(option);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    setDirection(1);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(newAnswers[currentQ + 1] || null);
    } else {
      setQuizAnswers(newAnswers);
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (quizAnswers: string[]) => {
    try {
      const response = await authService.request("/career/discover", {
        method: "POST",
        body: JSON.stringify({ answers: quizAnswers }),
      });

      if (!response.ok) throw new Error("Failed to analyze interests");
      const result = await response.json();
      
      (navigate as any)({ 
        to: "/career-guidance", 
        search: { type: 'discovery', data: JSON.stringify(result.data) } 
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate recommendations");
      // Fallback or stay on page
    }
  };

  const handlePrev = () => {
    if (currentQ === 0) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected ?? "";
    setAnswers(newAnswers);
    setDirection(-1);
    setCurrentQ(currentQ - 1);
    setSelected(newAnswers[currentQ - 1] || null);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Discovery
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
          data-ocid="quiz.progress_bar"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">
              Question{" "}
              <span className="text-foreground font-bold">{currentQ + 1}</span>{" "}
              of {questions.length}
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            data-ocid="quiz.question_card"
            className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl p-6 md:p-8 mb-8"
          >
            {/* Question number accent */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary text-xs font-bold">
                  {currentQ + 1}
                </span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Choose one
              </span>
            </div>

            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-snug mb-7">
              {q.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, i) => {
                const isSelected = selected === option;
                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handleSelect(option)}
                    data-ocid={`quiz.option.${i + 1}`}
                    className={[
                      "w-full text-left rounded-xl border transition-all duration-200 group",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-primary/5 bg-background/40",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Radio circle */}
                      <div
                        className={[
                          "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40 group-hover:border-primary/60",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      {/* Option letter badge */}
                      <div
                        className={[
                          "w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span
                        className={[
                          "text-sm font-medium transition-colors",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        ].join(" ")}
                      >
                        {option}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQ === 0}
            data-ocid="quiz.prev_button"
            className="gap-2 rounded-xl px-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((q2, i) => (
              <div
                key={q2.id}
                className={[
                  "rounded-full transition-all duration-300",
                  i === currentQ
                    ? "w-6 h-2 bg-primary"
                    : answers[i]
                      ? "w-2 h-2 bg-primary/40"
                      : "w-2 h-2 bg-muted",
                ].join(" ")}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selected}
            data-ocid="quiz.next_button"
            className="gap-2 rounded-xl px-6 gradient-btn"
          >
            {currentQ < questions.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                See My Careers
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
