import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

type AvatarState = "idle" | "speaking" | "listening";

// Mouth shapes for lip-sync animation
const MOUTH_FRAMES = [
  { topY: 76, botY: 78, w: 14 }, // nearly closed
  { topY: 74, botY: 80, w: 15 }, // slightly open
  { topY: 72, botY: 83, w: 16 }, // open — shows teeth
  { topY: 73, botY: 81, w: 15 }, // medium open
];

interface InterviewAvatarProps {
  state: AvatarState;
  size?: number;
}

export default function InterviewAvatar({ state, size = 120 }: InterviewAvatarProps) {
  const [mouthFrame, setMouthFrame] = useState(0);
  const mouthIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === "speaking") {
      mouthIntervalRef.current = setInterval(() => {
        setMouthFrame((f) => (f + 1) % MOUTH_FRAMES.length);
      }, 110);
    } else {
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      setMouthFrame(0);
    }
    return () => {
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
    };
  }, [state]);

  const frame = MOUTH_FRAMES[mouthFrame % MOUTH_FRAMES.length];
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  // Eye openness — wider when listening (attentive)
  const eyeRy = isListening ? 6.5 : 5.5;
  const pupilRy = isListening ? 4.5 : 3.8;

  // Blush intensity
  const blushOpacity = isSpeaking ? 0.55 : isListening ? 0.35 : 0.22;

  // Eyebrow positions — raised when listening
  const browLeftD = isListening
    ? "M28 47 Q37 42 46 45"
    : isSpeaking
      ? "M28 48 Q37 44 46 47"
      : "M28 49 Q37 46 46 48";
  const browRightD = isListening
    ? "M54 45 Q63 42 72 47"
    : isSpeaking
      ? "M54 47 Q63 44 72 48"
      : "M54 48 Q63 46 72 49";

  return (
    <div className="relative flex items-center justify-center">
      {/* Speaking/Listening Glow Effects */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inline-flex h-32 w-32 rounded-full bg-violet-500/20 blur-xl animate-pulse"
          />
        )}
        {isListening && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inline-flex h-28 w-28 rounded-full bg-emerald-500/20 blur-lg animate-pulse"
          />
        )}
      </AnimatePresence>

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ display: "block" }}
        role="img"
        aria-label="AI Career Coach Interviewer"
      >
        <defs>
          <radialGradient id="headGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fde8d8" />
            <stop offset="45%" stopColor="#f5c9a8" />
            <stop offset="100%" stopColor="#e8a07a" />
          </radialGradient>
          <radialGradient id="faceShade" cx="50%" cy="80%" r="55%">
            <stop offset="0%" stopColor="#c97a50" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c97a50" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f48ca0" stopOpacity={blushOpacity} />
            <stop offset="100%" stopColor="#f48ca0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="irisGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2e1065" />
          </radialGradient>
          <linearGradient id="hairGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f0a1e" />
          </linearGradient>
          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isSpeaking ? "#e05580" : "#d4667a"} />
            <stop offset="100%" stopColor={isSpeaking ? "#b03060" : "#a84060"} />
          </linearGradient>
          <filter id="faceGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Head and Hair Layers ported from AvatarAssistant */}
        <ellipse cx="50" cy="26" rx="33" ry="23" fill="url(#hairGrad)" />
        <path d="M17 28 Q12 50 18 72 Q20 78 24 80 Q20 60 22 40 Z" fill="url(#hairGrad)" />
        <path d="M83 28 Q88 50 82 72 Q80 78 76 80 Q80 60 78 40 Z" fill="url(#hairGrad)" />
        
        <ellipse
          cx="50"
          cy="57"
          rx="31"
          ry="35"
          fill="url(#headGrad)"
          filter={isSpeaking ? "url(#faceGlow)" : undefined}
        />
        <ellipse cx="50" cy="57" rx="31" ry="35" fill="url(#faceShade)" />

        {/* Eyes */}
        <ellipse cx="37" cy="55" rx="8.5" ry={eyeRy + 0.5} fill="#fef9f5" />
        <ellipse cx="37" cy="55" rx="5.5" ry={eyeRy} fill="url(#irisGrad)" />
        <ellipse cx="37.5" cy="55" rx="2.8" ry={pupilRy} fill="#0a0015" />
        <circle cx="39" cy="53" r="1.5" fill="#ffffff" opacity="0.9" />

        <ellipse cx="63" cy="55" rx="8.5" ry={eyeRy + 0.5} fill="#fef9f5" />
        <ellipse cx="63" cy="55" rx="5.5" ry={eyeRy} fill="url(#irisGrad)" />
        <ellipse cx="63.5" cy="55" rx="2.8" ry={pupilRy} fill="#0a0015" />
        <circle cx="65" cy="53" r="1.5" fill="#ffffff" opacity="0.9" />

        {/* Mouth with internal teeth/cavity logic */}
        {isSpeaking && frame.botY - frame.topY > 3 && (
          <ellipse cx="50" cy={(frame.topY + frame.botY) / 2} rx={frame.w - 1} ry={(frame.botY - frame.topY) / 2} fill="#1a0510" />
        )}
        <path
          d={`M${50 - frame.w} ${frame.topY} Q${50 - frame.w * 0.4} ${frame.topY - 2.5} 50 ${frame.topY - 1} Q${50 + frame.w * 0.4} ${frame.topY - 2.5} ${50 + frame.w} ${frame.topY}`}
          fill="url(#lipGrad)"
        />
        <path
          d={`M${50 - frame.w} ${frame.topY} Q${50 - frame.w * 0.6} ${frame.botY + 2} 50 ${frame.botY + 2.5} Q${50 + frame.w * 0.6} ${frame.botY + 2} ${50 + frame.w} ${frame.topY}`}
          fill={isSpeaking ? "#d05070" : "#c04868"}
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

import { AnimatePresence } from "motion/react";
