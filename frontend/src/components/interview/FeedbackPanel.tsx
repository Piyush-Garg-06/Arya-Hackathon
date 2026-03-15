import { AlertCircle, CheckCircle, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export interface PerQuestionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

interface FeedbackPanelProps extends PerQuestionFeedback {
  onNext: () => void;
  isLastQuestion: boolean;
}

// Animated circular score ring
function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const pct = score / 10;
  const dash = animated ? circ * pct : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const ringColor =
    score >= 7
      ? ["oklch(0.62 0.255 295)", "oklch(0.55 0.2 260)"]
      : score >= 5
        ? ["oklch(0.78 0.18 65)", "oklch(0.72 0.16 50)"]
        : ["oklch(0.65 0.25 25)", "oklch(0.58 0.22 15)"];

  const scoreLabel =
    score >= 7 ? "Excellent" : score >= 5 ? "Good" : "Needs Work";
  const scoreLabelColor =
    score >= 7
      ? "text-violet-300"
      : score >= 5
        ? "text-amber-300"
        : "text-red-300";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg
          width="128"
          height="128"
          role="img"
          className="-rotate-90"
          aria-label={`Score ${score} out of 10`}
        >
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ringColor[0]} />
              <stop offset="100%" stopColor={ringColor[1]} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="oklch(0.28 0.05 260)"
            strokeWidth="10"
          />
          {/* Fill */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{
              transition:
                "stroke-dasharray 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="font-display font-black text-3xl text-foreground leading-none"
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium">/10</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${scoreLabelColor}`}>
        {scoreLabel}
      </span>
    </div>
  );
}

export default function FeedbackPanel({
  score,
  strengths,
  improvements,
  suggestedAnswer,
  onNext,
  isLastQuestion,
}: FeedbackPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        data-ocid="interview.feedback_panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        {/* Score card */}
        <motion.div
          data-ocid="interview.score_card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.2 0.06 280 / 0.92) 0%, oklch(0.16 0.04 255 / 0.95) 100%)",
          }}
        >
          <ScoreRing score={score} />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-xl text-foreground mb-1">
              Answer Scored
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your response has been evaluated by AI. Review the feedback below
              to understand your strengths and areas to improve.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                {strengths.length} strengths found
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/25">
                {improvements.length} improvements
              </span>
            </div>
          </div>
        </motion.div>

        {/* Strengths card */}
        <motion.div
          data-ocid="interview.strengths_card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border p-5"
          style={{
            background: "oklch(0.22 0.06 155 / 0.2)",
            borderColor: "oklch(0.55 0.18 155 / 0.3)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.55 0.18 155 / 0.2)" }}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-base text-emerald-300">
              Strengths
            </h4>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: "oklch(0.65 0.18 155)" }}
                />
                <span className="text-emerald-100/90 leading-relaxed">{s}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements card */}
        <motion.div
          data-ocid="interview.improvements_card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border p-5"
          style={{
            background: "oklch(0.22 0.06 55 / 0.2)",
            borderColor: "oklch(0.7 0.18 55 / 0.3)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.7 0.18 55 / 0.2)" }}
            >
              <AlertCircle className="w-4 h-4 text-orange-400" />
            </div>
            <h4 className="font-display font-bold text-base text-orange-300">
              Areas of Improvement
            </h4>
          </div>
          <ul className="space-y-2.5">
            {improvements.map((imp, i) => (
              <motion.li
                key={imp}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: "oklch(0.72 0.18 55)" }}
                />
                <span className="text-orange-100/90 leading-relaxed">
                  {imp}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Suggested better answer */}
        <motion.div
          data-ocid="interview.suggested_answer_card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: "oklch(0.2 0.05 280 / 0.5)",
            borderColor: "oklch(0.62 0.255 295 / 0.3)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.62 0.255 295), oklch(0.55 0.2 260))",
            }}
          />
          <div className="pl-3">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.22 295 / 0.25), oklch(0.5 0.2 260 / 0.25))",
                }}
              >
                <Sparkles className="w-4 h-4 text-violet-300" />
              </div>
              <h4 className="font-display font-bold text-base text-violet-300">
                Suggested Better Answer
              </h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {suggestedAnswer}
            </p>
          </div>
        </motion.div>

        {/* Next / Finish button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <button
            data-ocid="interview.feedback_next_button"
            type="button"
            onClick={onNext}
            className="w-full py-3.5 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.5 0.2 260), oklch(0.48 0.18 240))",
              boxShadow: "0 4px 32px oklch(0.55 0.22 295 / 0.3)",
            }}
          >
            {isLastQuestion ? "Finish Interview" : "Next Question"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
