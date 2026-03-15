import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Minimize2,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  time: string;
}

type AvatarState = "idle" | "speaking" | "listening";

// Mouth shapes for lip-sync animation — more realistic open/close
const MOUTH_FRAMES = [
  { topY: 76, botY: 78, w: 14 }, // nearly closed
  { topY: 74, botY: 80, w: 15 }, // slightly open
  { topY: 72, botY: 83, w: 16 }, // open — shows teeth
  { topY: 73, botY: 81, w: 15 }, // medium open
];

interface AriaFaceProps {
  size: number;
  state: AvatarState;
  mouthFrame: number;
}

function AriaFace({ size, state, mouthFrame }: AriaFaceProps) {
  const frame = MOUTH_FRAMES[mouthFrame % MOUTH_FRAMES.length];
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  // Eye openness — wider when listening (attentive)
  const eyeRy = isListening ? 6.5 : 5.5;
  const pupilRy = isListening ? 4.5 : 3.8;

  // Blush intensity
  const blushOpacity = isSpeaking ? 0.55 : isListening ? 0.35 : 0.22;

  // Eyebrow positions — raised when listening, relaxed when idle/speaking
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
      role="img"
      aria-label="Aria AI Career Coach avatar"
    >
      <defs>
        {/* Natural skin-tone head gradient */}
        <radialGradient id="headGrad" cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#fde8d8" />
          <stop offset="45%" stopColor="#f5c9a8" />
          <stop offset="100%" stopColor="#e8a07a" />
        </radialGradient>

        {/* Slight shadow on lower face */}
        <radialGradient id="faceShade" cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#c97a50" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c97a50" stopOpacity="0" />
        </radialGradient>

        {/* Blush gradient */}
        <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f48ca0" stopOpacity={blushOpacity} />
          <stop offset="100%" stopColor="#f48ca0" stopOpacity="0" />
        </radialGradient>

        {/* Iris gradient — violet AI aesthetic */}
        <radialGradient id="irisGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>

        {/* Hair gradient — rich dark with violet sheen */}
        <linearGradient id="hairGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f0a1e" />
        </linearGradient>

        {/* Hair highlight streak */}
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>

        {/* Neck/shoulder gradient */}
        <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0b98c" />
          <stop offset="100%" stopColor="#e09870" />
        </linearGradient>

        {/* Lip gradient */}
        <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isSpeaking ? "#e05580" : "#d4667a"} />
          <stop offset="100%" stopColor={isSpeaking ? "#b03060" : "#a84060"} />
        </linearGradient>

        {/* Glow filter for speaking state */}
        <filter id="speakGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle skin glow when speaking */}
        <filter id="faceGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Eyelash filter */}
        <filter id="lashShadow">
          <feDropShadow
            dx="0"
            dy="0.5"
            stdDeviation="0.3"
            floodColor="#000"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      {/* ── NECK & SHOULDERS ── */}
      <ellipse cx="50" cy="97" rx="20" ry="8" fill="#c97a50" opacity="0.3" />
      <rect x="41" y="88" width="18" height="10" rx="4" fill="url(#neckGrad)" />
      {/* Collarbone hint */}
      <path
        d="M30 95 Q50 91 70 95"
        stroke="#d4956e"
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />

      {/* ── HAIR (back layer) ── */}
      <ellipse cx="50" cy="26" rx="33" ry="23" fill="url(#hairGrad)" />
      {/* Flowing hair sides */}
      <path
        d="M17 28 Q12 50 18 72 Q20 78 24 80 Q20 60 22 40 Z"
        fill="url(#hairGrad)"
      />
      <path
        d="M83 28 Q88 50 82 72 Q80 78 76 80 Q80 60 78 40 Z"
        fill="url(#hairGrad)"
      />
      {/* Hair highlight streak */}
      <ellipse cx="40" cy="20" rx="10" ry="6" fill="url(#hairHighlight)" />

      {/* ── HEAD ── */}
      <ellipse
        cx="50"
        cy="57"
        rx="31"
        ry="35"
        fill="url(#headGrad)"
        filter={isSpeaking ? "url(#faceGlow)" : undefined}
      />
      {/* Face shadow overlay */}
      <ellipse cx="50" cy="57" rx="31" ry="35" fill="url(#faceShade)" />

      {/* ── HAIR (front fringe) ── */}
      <path
        d="M19 35 Q22 22 35 18 Q50 14 65 18 Q78 22 81 35 Q72 26 50 25 Q28 26 19 35 Z"
        fill="url(#hairGrad)"
      />
      {/* Fringe wisps */}
      <path
        d="M28 28 Q32 20 38 24"
        stroke="#2e1065"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 22 Q40 16 46 21"
        stroke="#3b0764"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55 21 Q61 16 66 22"
        stroke="#3b0764"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── EARS ── */}
      <ellipse cx="19" cy="57" rx="3.5" ry="5.5" fill="#f0b98c" />
      <ellipse cx="19" cy="57" rx="2" ry="3.5" fill="#e09870" />
      <ellipse cx="81" cy="57" rx="3.5" ry="5.5" fill="#f0b98c" />
      <ellipse cx="81" cy="57" rx="2" ry="3.5" fill="#e09870" />

      {/* ── EYEBROWS ── */}
      <path
        d={browLeftD}
        stroke="#3b1a05"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d={browRightD}
        stroke="#3b1a05"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* ── EYES — Left ── */}
      {/* Eye socket shadow */}
      <ellipse
        cx="37"
        cy="55"
        rx="9.5"
        ry={eyeRy + 2}
        fill="#c97a50"
        opacity="0.12"
      />
      {/* Sclera (white) */}
      <ellipse cx="37" cy="55" rx="8.5" ry={eyeRy + 0.5} fill="#fef9f5" />
      {/* Iris */}
      <ellipse cx="37" cy="55" rx="5.5" ry={eyeRy} fill="url(#irisGrad)" />
      {/* Pupil */}
      <ellipse cx="37.5" cy="55" rx="2.8" ry={pupilRy} fill="#0a0015" />
      {/* Eye shine — main */}
      <circle cx="39" cy="53" r="1.5" fill="#ffffff" opacity="0.9" />
      {/* Eye shine — small secondary */}
      <circle cx="36" cy="57" r="0.7" fill="#ffffff" opacity="0.45" />
      {/* Upper eyelid / lash line */}
      <path
        d={`M28.5 ${55 - eyeRy + 0.5} Q37 ${55 - eyeRy - 1.5} 45.5 ${55 - eyeRy + 0.5}`}
        stroke="#1a0a00"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        filter="url(#lashShadow)"
      />
      {/* Lower lash line */}
      <path
        d={`M29 ${55 + eyeRy - 0.5} Q37 ${55 + eyeRy + 0.5} 45 ${55 + eyeRy - 0.5}`}
        stroke="#3b1a05"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ── EYES — Right ── */}
      <ellipse
        cx="63"
        cy="55"
        rx="9.5"
        ry={eyeRy + 2}
        fill="#c97a50"
        opacity="0.12"
      />
      <ellipse cx="63" cy="55" rx="8.5" ry={eyeRy + 0.5} fill="#fef9f5" />
      <ellipse cx="63" cy="55" rx="5.5" ry={eyeRy} fill="url(#irisGrad)" />
      <ellipse cx="63.5" cy="55" rx="2.8" ry={pupilRy} fill="#0a0015" />
      <circle cx="65" cy="53" r="1.5" fill="#ffffff" opacity="0.9" />
      <circle cx="62" cy="57" r="0.7" fill="#ffffff" opacity="0.45" />
      <path
        d={`M54.5 ${55 - eyeRy + 0.5} Q63 ${55 - eyeRy - 1.5} 71.5 ${55 - eyeRy + 0.5}`}
        stroke="#1a0a00"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        filter="url(#lashShadow)"
      />
      <path
        d={`M55 ${55 + eyeRy - 0.5} Q63 ${55 + eyeRy + 0.5} 71 ${55 + eyeRy - 0.5}`}
        stroke="#3b1a05"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ── BLUSH ── */}
      <ellipse cx="27" cy="65" rx="10" ry="6" fill="url(#cheekGrad)" />
      <ellipse cx="73" cy="65" rx="10" ry="6" fill="url(#cheekGrad)" />

      {/* ── NOSE ── */}
      <path
        d="M50 63 Q47.5 69 48.5 71 Q50 72.5 51.5 71 Q52.5 69 50 63"
        stroke="#c07050"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      {/* Nostril hints */}
      <ellipse
        cx="48"
        cy="71"
        rx="1.5"
        ry="0.8"
        fill="#b06040"
        opacity="0.35"
      />
      <ellipse
        cx="52"
        cy="71"
        rx="1.5"
        ry="0.8"
        fill="#b06040"
        opacity="0.35"
      />

      {/* ── MOUTH ── */}
      {/* Lip area background */}
      <ellipse
        cx="50"
        cy="78"
        rx={frame.w + 1}
        ry={(frame.botY - frame.topY) / 2 + 3}
        fill="#d4736a"
        opacity="0.15"
      />

      {/* Mouth opening when speaking — dark interior */}
      {isSpeaking && frame.botY - frame.topY > 3 && (
        <>
          {/* Mouth cavity */}
          <ellipse
            cx="50"
            cy={(frame.topY + frame.botY) / 2}
            rx={frame.w - 1}
            ry={(frame.botY - frame.topY) / 2}
            fill="#1a0510"
          />
          {/* Upper teeth row */}
          <rect
            x={50 - (frame.w - 2)}
            y={frame.topY + 0.5}
            width={(frame.w - 2) * 2}
            height={Math.min(3, (frame.botY - frame.topY) * 0.35)}
            rx="1"
            fill="#f8f4f0"
            opacity="0.9"
          />
          {/* Individual tooth dividers */}
          {[-4, 0, 4].map((offset) => (
            <line
              key={offset}
              x1={50 + offset}
              y1={frame.topY + 0.5}
              x2={50 + offset}
              y2={frame.topY + Math.min(3, (frame.botY - frame.topY) * 0.35)}
              stroke="#e0d8d0"
              strokeWidth="0.4"
              opacity="0.6"
            />
          ))}
          {/* Lower teeth hint */}
          {frame.botY - frame.topY > 6 && (
            <rect
              x={50 - (frame.w - 4)}
              y={frame.botY - Math.min(2.5, (frame.botY - frame.topY) * 0.3)}
              width={(frame.w - 4) * 2}
              height={Math.min(2.5, (frame.botY - frame.topY) * 0.3)}
              rx="1"
              fill="#f0ece8"
              opacity="0.7"
            />
          )}
          {/* Tongue hint when wide open */}
          {frame.botY - frame.topY > 8 && (
            <ellipse
              cx="50"
              cy={frame.botY - 2}
              rx="5"
              ry="2"
              fill="#e07080"
              opacity="0.6"
            />
          )}
        </>
      )}

      {/* Upper lip */}
      <path
        d={`M${50 - frame.w} ${frame.topY} Q${50 - frame.w * 0.4} ${frame.topY - 2.5} 50 ${frame.topY - 1} Q${50 + frame.w * 0.4} ${frame.topY - 2.5} ${50 + frame.w} ${frame.topY}`}
        fill="url(#lipGrad)"
        stroke="none"
      />
      {/* Cupid's bow detail */}
      <path
        d={`M${50 - frame.w * 0.35} ${frame.topY - 1.5} Q50 ${frame.topY - 3.5} ${50 + frame.w * 0.35} ${frame.topY - 1.5}`}
        stroke={isSpeaking ? "#c03060" : "#b84060"}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      {/* Lower lip */}
      <path
        d={`M${50 - frame.w} ${frame.topY} Q${50 - frame.w * 0.6} ${frame.botY + 2} 50 ${frame.botY + 2.5} Q${50 + frame.w * 0.6} ${frame.botY + 2} ${50 + frame.w} ${frame.topY}`}
        fill={isSpeaking ? "#d05070" : "#c04868"}
        opacity="0.95"
      />
      {/* Lower lip highlight */}
      <ellipse
        cx="50"
        cy={frame.botY + 1.5}
        rx={frame.w * 0.5}
        ry="1.2"
        fill="#ffffff"
        opacity="0.18"
      />
      {/* Mouth corner shadows */}
      <circle
        cx={50 - frame.w}
        cy={frame.topY}
        r="1.2"
        fill="#a03050"
        opacity="0.4"
      />
      <circle
        cx={50 + frame.w}
        cy={frame.topY}
        r="1.2"
        fill="#a03050"
        opacity="0.4"
      />

      {/* ── AI CIRCUIT ACCENT (forehead gem) ── */}
      <circle
        cx="50"
        cy="37"
        r="2"
        fill="#c084fc"
        opacity={isSpeaking ? 1 : 0.8}
        filter={isSpeaking ? "url(#speakGlow)" : undefined}
      />
      <circle cx="44" cy="39.5" r="1" fill="#818cf8" opacity="0.65" />
      <circle cx="56" cy="39.5" r="1" fill="#818cf8" opacity="0.65" />
      <line
        x1="44"
        y1="39.5"
        x2="50"
        y2="37"
        stroke="#818cf8"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <line
        x1="56"
        y1="39.5"
        x2="50"
        y2="37"
        stroke="#818cf8"
        strokeWidth="0.6"
        opacity="0.5"
      />
    </svg>
  );
}

const AVATAR_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm Aria, your AI Career Coach. How can I help you today?",
    "Hi there! Ready to level up your career? Ask me anything!",
    "Hey! I'm Aria. Whether it's interview prep, career advice, or skill gaps — I've got you covered!",
  ],
  interview: [
    "Great question! For interviews, focus on the STAR method: Situation, Task, Action, Result. Want me to walk you through a practice question?",
    "Before your interview, research the company thoroughly and prepare 2-3 questions to ask them. It shows genuine interest!",
    "The most common interview mistake is not being specific. Always back up your answers with concrete examples and numbers.",
  ],
  career: [
    "Choosing a career path is a big decision! Let's start with your strengths. What subjects or tasks energize you most?",
    "For career growth, focus on building both hard skills (technical) and soft skills (communication, leadership). Which area do you want to develop?",
    "Have you tried our Career Recommendation feature? It analyzes your interests and suggests the best-fit career paths for you!",
  ],
  skills: [
    "Skill gaps are opportunities in disguise! The most in-demand skills right now are AI/ML, cloud computing, and data analysis.",
    "I'd recommend starting with our Skill Gap Analysis on the Career page. It gives you a personalized learning roadmap!",
    "Consistency beats intensity. Even 30 minutes of learning per day adds up to 180 hours per year. What skill do you want to build?",
  ],
  resume: [
    "A strong resume has: clear formatting, quantified achievements, relevant keywords, and no typos. Want specific tips for your field?",
    "Tailor your resume for each job application! Use keywords from the job description to pass ATS screening.",
    "Your resume should tell a story of growth. Lead with impact statements like 'Increased sales by 30%' instead of just listing duties.",
  ],
  motivation: [
    "Remember: every expert was once a beginner. Your consistency today is building tomorrow's success! Keep going!",
    "You've already taken the first step by being here. That puts you ahead of most people. What's your next goal?",
    "Setbacks are setups for comebacks! Every rejection is redirecting you to something better. Stay consistent!",
  ],
  default: [
    "That's a great question! I'm here to help with career guidance, interview prep, and skill development. Can you tell me more?",
    "I'd love to help with that! Could you share a bit more context so I can give you the best advice?",
    "Interesting! Let's explore that together. Head to the Career Guidance section for personalized recommendations, or keep chatting with me!",
    "I'm still learning, but here's what I know: consistent effort and the right guidance can transform your career trajectory!",
  ],
};

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your career background.",
  "What is your greatest professional strength and how have you used it?",
  "Describe a challenging situation at work and how you handled it.",
  "Where do you see yourself in the next 5 years?",
  "Why do you want to work for our company?",
  "Tell me about a time you showed leadership or took initiative.",
  "How do you handle tight deadlines and pressure at work?",
  "What motivates you and keeps you engaged in your work?",
];

const INTERVIEW_FEEDBACK = [
  "Great answer! You demonstrated clear communication. Try adding specific metrics or numbers next time to make it even stronger.",
  "Solid response! Using the STAR method more explicitly — Situation, Task, Action, Result — will make your answer even more impactful.",
  "Good job! Your answer showed self-awareness. Consider adding a brief example from past experience to support your point.",
  "Well articulated! Employers love confidence. Make sure to also connect your answer to what the company specifically values.",
  "Nice response! Try to be more specific about outcomes. Quantify your achievements whenever possible — numbers stand out!",
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  let category = "default";
  if (lower.match(/hi|hello|hey|good morning|good evening|namaste/))
    category = "greeting";
  else if (lower.match(/interview|question|answer|prepare|practice/))
    category = "interview";
  else if (lower.match(/career|job|profession|work|switch|grow|path/))
    category = "career";
  else if (lower.match(/skill|learn|course|technology|stack|programming/))
    category = "skills";
  else if (lower.match(/resume|cv|portfolio|application/)) category = "resume";
  else if (lower.match(/motivat|inspire|stuck|help|fear|nervous|anxious/))
    category = "motivation";
  const pool = AVATAR_RESPONSES[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AvatarAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I'm Aria, your AI Career Coach. Ask me anything about careers, interviews, or skills! You can also start a mock interview session.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewIndex, setInterviewIndex] = useState(0);
  const [awaitingInterviewAnswer, setAwaitingInterviewAnswer] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(isMuted);
  const interviewModeRef = useRef(interviewMode);
  const interviewIndexRef = useRef(interviewIndex);
  const awaitingAnswerRef = useRef(awaitingInterviewAnswer);
  const mouthIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lip-sync interval
  useEffect(() => {
    if (avatarState === "speaking") {
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
  }, [avatarState]);

  // Keep refs in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  useEffect(() => {
    interviewModeRef.current = interviewMode;
  }, [interviewMode]);
  useEffect(() => {
    interviewIndexRef.current = interviewIndex;
  }, [interviewIndex]);
  useEffect(() => {
    awaitingAnswerRef.current = awaitingInterviewAnswer;
  }, [awaitingInterviewAnswer]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    recognitionRef.current?.stop();
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setAvatarState("listening");
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript as string;
      if (awaitingAnswerRef.current) {
        handleInterviewAnswer(transcript);
      } else {
        setInput(transcript);
        sendMessage(transcript);
      }
    };
    recognition.onend = () => {
      setAvatarState("idle");
    };
    recognition.onerror = () => {
      setAvatarState("idle");
    };
    recognition.start();
  }, []);

  const speakText = useCallback((text: string, onDone?: () => void) => {
    if (!window.speechSynthesis) {
      onDone?.();
      return;
    }
    window.speechSynthesis.cancel();
    if (isMutedRef.current) {
      onDone?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    setAvatarState("speaking");
    utterance.onend = () => {
      setAvatarState("idle");
      onDone?.();
    };
    utterance.onerror = () => {
      setAvatarState("idle");
      onDone?.();
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  function addAssistantMessage(text: string, afterSpeak?: () => void) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "assistant", text, time: formatTime() },
    ]);
    speakText(text, afterSpeak);
  }

  function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    if (interviewModeRef.current && awaitingAnswerRef.current) {
      handleInterviewAnswer(msg);
      return;
    }
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: msg,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = getResponse(msg);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: reply,
          time: formatTime(),
        },
      ]);
      speakText(reply, () => {
        if (!interviewModeRef.current) startListening();
      });
    }, delay);
  }

  function handleInterviewAnswer(answer: string) {
    setAwaitingInterviewAnswer(false);
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: answer,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const feedback =
        INTERVIEW_FEEDBACK[
          Math.floor(Math.random() * INTERVIEW_FEEDBACK.length)
        ];
      const nextIndex = interviewIndexRef.current + 1;
      if (nextIndex < INTERVIEW_QUESTIONS.length) {
        const nextQ = INTERVIEW_QUESTIONS[nextIndex];
        const feedbackWithNext = `${feedback} Now, question ${nextIndex + 1}: ${nextQ}`;
        setInterviewIndex(nextIndex);
        setAwaitingInterviewAnswer(true);
        addAssistantMessage(feedbackWithNext, () => startListening());
      } else {
        const doneMsg = `${feedback} That concludes our mock interview! You did great — review your answers and keep practicing. Type or click 'Start Interview' to go again!`;
        setInterviewMode(false);
        setAwaitingInterviewAnswer(false);
        addAssistantMessage(doneMsg);
      }
    }, 1000);
  }

  function startInterview() {
    setInterviewMode(true);
    setInterviewIndex(0);
    setAwaitingInterviewAnswer(true);
    const intro = `Great! Let's begin your mock interview. I'll ask you ${INTERVIEW_QUESTIONS.length} questions. Answer each one clearly and I'll give you feedback. Question 1: ${INTERVIEW_QUESTIONS[0]}`;
    addAssistantMessage(intro, () => startListening());
  }

  function stopInterview() {
    setInterviewMode(false);
    setAwaitingInterviewAnswer(false);
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setAvatarState("idle");
    addAssistantMessage(
      "Interview session ended. Great effort! Keep practicing to build your confidence.",
    );
  }

  function toggleVoice() {
    if (avatarState === "listening") {
      recognitionRef.current?.stop();
      setAvatarState("idle");
      return;
    }
    startListening();
  }

  const suggestions = [
    "Interview tips",
    "Career paths",
    "Top skills 2024",
    "Resume advice",
  ];

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="avatar.panel"
    >
      {/* Chat Window */}
      {open && !minimized && (
        <div
          className="w-80 sm:w-96 rounded-2xl shadow-2xl border border-violet-500/30 bg-gray-950/95 backdrop-blur-xl flex flex-col overflow-hidden"
          style={{ height: "540px", animation: "slideUp 0.25s ease" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-700 to-blue-700">
            <div className="relative">
              <div
                className={`rounded-full overflow-hidden border-2 transition-all ${
                  avatarState === "speaking"
                    ? "border-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.8)]"
                    : avatarState === "listening"
                      ? "border-green-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]"
                      : "border-white/50"
                }`}
                style={{ width: 52, height: 52, background: "#2d1b4e" }}
              >
                <AriaFace
                  size={52}
                  state={avatarState}
                  mouthFrame={mouthFrame}
                />
              </div>
              {avatarState === "speaking" && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-yellow-300/60 animate-ping" />
                  <span
                    className="absolute -inset-1 rounded-full border border-yellow-300/30 animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  />
                </>
              )}
              {avatarState === "listening" && (
                <span className="absolute -inset-1 rounded-full border-2 border-green-400/70 animate-pulse" />
              )}
              {avatarState === "idle" && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-violet-700" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                Aria — AI Career Coach
              </p>
              <p className="text-white/70 text-xs">
                {avatarState === "speaking"
                  ? "🔊 Speaking..."
                  : avatarState === "listening"
                    ? "🎤 Listening..."
                    : interviewMode
                      ? "🎯 Interview Mode"
                      : "Online · Always ready to help"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMuted((m) => !m);
                if (!isMuted) window.speechSynthesis?.cancel();
              }}
              className="text-white/70 hover:text-white p-1 rounded transition-colors"
              title={isMuted ? "Unmute Aria" : "Mute Aria"}
              data-ocid="avatar.mute_toggle"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="text-white/70 hover:text-white p-1 rounded"
              data-ocid="avatar.toggle"
            >
              <Minimize2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.speechSynthesis?.cancel();
                recognitionRef.current?.stop();
                setAvatarState("idle");
                setInterviewMode(false);
                setAwaitingInterviewAnswer(false);
              }}
              className="text-white/70 hover:text-white p-1 rounded"
              data-ocid="avatar.close_button"
            >
              <X size={15} />
            </button>
          </div>

          {/* Speaking wave bars */}
          {avatarState === "speaking" && (
            <div className="flex items-center justify-center gap-0.5 py-1 bg-yellow-500/10 border-b border-yellow-500/20">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <span
                  key={i}
                  className="w-0.5 bg-yellow-400 rounded-full"
                  style={{
                    height: `${8 + Math.sin(i) * 6}px`,
                    animation: "waveBounce 0.6s ease-in-out infinite",
                    animationDelay: `${i * 0.07}s`,
                  }}
                />
              ))}
              <span className="ml-2 text-yellow-300 text-xs">Speaking...</span>
            </div>
          )}

          {/* Listening indicator */}
          {avatarState === "listening" && (
            <div className="flex items-center justify-center gap-2 py-1.5 bg-green-500/10 border-b border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
              <span className="text-green-300 text-xs ml-1">
                Listening for your response...
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}
              >
                {m.role === "assistant" && (
                  <div
                    className="rounded-full overflow-hidden shrink-0 border border-violet-600/50"
                    style={{ width: 28, height: 28, background: "#2d1b4e" }}
                  >
                    <AriaFace size={28} state="idle" mouthFrame={0} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/60 text-right" : "text-gray-500"}`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-end">
                <div
                  className="rounded-full overflow-hidden shrink-0 border border-violet-600/50"
                  style={{ width: 28, height: 28, background: "#2d1b4e" }}
                >
                  <AriaFace size={28} state="idle" mouthFrame={0} />
                </div>
                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && !interviewMode && (
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1 rounded-full bg-violet-900/50 text-violet-300 border border-violet-700/50 hover:bg-violet-700/50 transition-colors"
                  data-ocid="avatar.button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Interview Controls */}
          <div className="px-3 pb-2 flex gap-2">
            {!interviewMode ? (
              <button
                type="button"
                onClick={startInterview}
                className="flex-1 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                data-ocid="avatar.start_interview_button"
              >
                🎯 Start Mock Interview
              </button>
            ) : (
              <button
                type="button"
                onClick={stopInterview}
                className="flex-1 py-1.5 text-xs font-semibold rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                data-ocid="avatar.stop_interview_button"
              >
                ⏹ Stop Interview
              </button>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-800 flex gap-2 items-center">
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-all ${
                avatarState === "listening"
                  ? "bg-green-500 text-white shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse"
                  : "bg-gray-800 text-gray-400 hover:text-violet-400"
              }`}
              title={avatarState === "listening" ? "Stop listening" : "Speak"}
              data-ocid="avatar.toggle"
            >
              {avatarState === "listening" ? (
                <MicOff size={16} />
              ) : (
                <Mic size={16} />
              )}
            </button>
            <input
              ref={inputRef}
              className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-2 outline-none border border-gray-700 focus:border-violet-500 placeholder:text-gray-500"
              placeholder={
                awaitingInterviewAnswer
                  ? "Type your answer or use mic..."
                  : "Ask Aria anything..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              data-ocid="avatar.input"
            />
            <Button
              size="icon"
              className="rounded-full bg-violet-600 hover:bg-violet-700 shrink-0 w-9 h-9"
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              data-ocid="avatar.submit_button"
            >
              <Send size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-700 to-blue-700 text-white text-sm font-medium shadow-lg hover:opacity-90 transition-opacity"
          data-ocid="avatar.toggle"
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 24, height: 24, background: "#2d1b4e" }}
          >
            <AriaFace size={24} state="idle" mouthFrame={0} />
          </div>
          Aria — AI Coach
          <span className="w-2 h-2 bg-green-400 rounded-full" />
        </button>
      )}

      {/* Floating Avatar Button — larger 144px */}
      {!open && (
        <div className="relative">
          {pulse && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full z-10 animate-ping" />
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setMinimized(false);
            }}
            className="relative w-36 h-36 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform"
            style={{
              background: "#2d1b4e",
              animation:
                avatarState === "speaking"
                  ? "float 3s ease-in-out infinite, speakPulse 0.5s ease-in-out infinite alternate"
                  : "float 3s ease-in-out infinite",
              border:
                avatarState === "speaking"
                  ? "3px solid #facc15"
                  : avatarState === "listening"
                    ? "3px solid #4ade80"
                    : "3px solid rgba(167,139,250,0.75)",
              boxShadow:
                avatarState === "speaking"
                  ? "0 0 32px rgba(250,204,21,0.65), 0 8px 32px rgba(0,0,0,0.4)"
                  : avatarState === "listening"
                    ? "0 0 32px rgba(74,222,128,0.55), 0 8px 32px rgba(0,0,0,0.4)"
                    : "0 0 24px rgba(124,58,237,0.45), 0 8px 32px rgba(0,0,0,0.4)",
            }}
            title="Chat with Aria — AI Career Coach"
            data-ocid="avatar.open_modal_button"
          >
            <AriaFace size={144} state={avatarState} mouthFrame={mouthFrame} />
            {/* Speaking rings */}
            {avatarState === "speaking" && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-yellow-300/50 animate-ping" />
                <span
                  className="absolute -inset-1 rounded-full border border-yellow-300/25 animate-ping"
                  style={{ animationDelay: "0.15s" }}
                />
              </>
            )}
            {avatarState === "listening" && (
              <span className="absolute -inset-0.5 rounded-full border-2 border-green-400/60 animate-pulse" />
            )}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-950 z-10" />
          </button>
          <div className="absolute -top-9 right-0 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-full border border-violet-500/40 whitespace-nowrap shadow-md">
            <Sparkles size={10} className="inline mr-1 text-violet-400" />
            Chat with Aria
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes speakPulse {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-3px) scale(1.06); }
        }
        @keyframes waveBounce {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
