import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Brain,
  ChevronRight,
  Flame,
  Medal,
  Mic,
  Moon,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { gamificationService } from "@/services/gamificationService";
import { authService } from "@/services/authService";

// ── Types ────────────────────────────────────────────────────────────────

interface XPProgress {
  xpPoints: number;
  level: string;
  dailyStreak: number;
  interviewsCompleted: number;
  badges?: any[];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [xpProgress, setXpProgress] = useState<XPProgress | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const progress = await gamificationService.getProgress();
      setXpProgress(progress);
      if (progress.badges) {
        setBadges(progress.badges);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Map badges from backend to UI format
  const badgeIcons: any = {
    'First Interview': Mic,
    '5 Day Streak': Flame,
    'Perfect Score': Star,
    'Career Explorer': Target,
    'Top 10%': Trophy,
    'Speed Demon': Zap,
    'Night Owl': Moon,
    '10 Interviews': Award,
    'Skill Master': Brain,
    'Leaderboard Star': Medal,
    'Quiz Champion': Shield,
    'AI Whisperer': Zap,
  };

  const mappedBadges = badges.map((badge, index) => ({
    id: badge.id || `badge-${index}`,
    label: badge.badgeName,
    icon: badgeIcons[badge.badgeName] || Award,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/40",
    unlocked: true,
    desc: badge.description,
  }));

const LEADERBOARD = [
  {
    rank: 1,
    name: "Priya Nair",
    initials: "PN",
    level: 18,
    xp: 9800,
    color: "bg-violet-500",
  },
  {
    rank: 2,
    name: "Jordan Lee",
    initials: "JL",
    level: 17,
    xp: 9100,
    color: "bg-blue-500",
  },
  {
    rank: 3,
    name: "Sofia Chen",
    initials: "SC",
    level: 16,
    xp: 8650,
    color: "bg-indigo-500",
  },
  {
    rank: 4,
    name: "Marcus Webb",
    initials: "MW",
    level: 15,
    xp: 7900,
    color: "bg-emerald-500",
  },
  {
    rank: 5,
    name: "Aisha Patel",
    initials: "AP",
    level: 14,
    xp: 7200,
    color: "bg-teal-500",
  },
];

const INTERVIEW_SCORES = [
  { label: "Apr 1", score: 6 },
  { label: "Apr 3", score: 7 },
  { label: "Apr 6", score: 8 },
  { label: "Apr 9", score: 7 },
  { label: "Apr 11", score: 9 },
  { label: "Apr 13", score: 8 },
  { label: "Apr 14", score: 10 },
];

const SKILLS = [
  { name: "Communication", pct: 78, color: "from-violet-500 to-purple-600" },
  {
    name: "Technical Knowledge",
    pct: 65,
    color: "from-blue-500 to-indigo-600",
  },
  { name: "Problem Solving", pct: 82, color: "from-emerald-500 to-teal-600" },
  { name: "Confidence", pct: 70, color: "from-orange-500 to-amber-600" },
  { name: "Industry Knowledge", pct: 55, color: "from-pink-500 to-rose-600" },
];

const WEEKLY = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 3 },
  { day: "Wed", count: 1 },
  { day: "Thu", count: 4 },
  { day: "Fri", count: 2 },
  { day: "Sat", count: 5 },
  { day: "Sun", count: 3 },
];

// ── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  duration = 1200,
}: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(eased * value));
      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

// ── Rank medal color ─────────────────────────────────────────────────────────

function rankStyle(rank: number) {
  if (rank === 1) return "text-yellow-400 font-black";
  if (rank === 2) return "text-slate-300 font-black";
  if (rank === 3) return "text-amber-600 font-black";
  return "text-muted-foreground font-semibold";
}

function rankBg(rank: number) {
  if (rank === 1) return "bg-yellow-400/10 border-yellow-400/30";
  if (rank === 2) return "bg-slate-400/10 border-slate-400/20";
  if (rank === 3) return "bg-amber-600/10 border-amber-600/20";
  return "bg-white/5 border-white/10";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [progressWidth, setProgressWidth] = useState(0);
  const [skillWidths, setSkillWidths] = useState<number[]>(SKILLS.map(() => 0));

  useEffect(() => {
    const t = setTimeout(() => {
      setProgressWidth(XP_PROGRESS);
      setSkillWidths(SKILLS.map((s) => s.pct));
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <TooltipProvider>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-1">
              Gamified Dashboard
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Welcome back,{" "}
              <span className="gradient-text">{USER.name.split(" ")[0]}</span>{" "}
              👋
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Level {USER.level} · {USER.xp.toLocaleString()} XP total
            </p>
          </div>
          <Link to="/interview" search={{ role: "" }}>
            <Button
              data-ocid="dashboard.primary_button"
              className="gradient-btn gap-2 hidden sm:flex"
            >
              <Mic className="w-4 h-4" /> Practice Now
            </Button>
          </Link>
        </motion.div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "XP Points",
              value: USER.xp,
              suffix: " XP",
              icon: Zap,
              bg: "from-violet-600/20 to-purple-700/10",
              accent: "text-violet-400",
              iconBg: "bg-violet-500/15",
              change: "+320 this week",
              ocid: "dashboard.xp_card",
            },
            {
              label: "Current Level",
              value: USER.level,
              suffix: "",
              icon: Shield,
              bg: "from-blue-600/20 to-indigo-700/10",
              accent: "text-blue-400",
              iconBg: "bg-blue-500/15",
              change: "Intermediate",
              ocid: "dashboard.level_card",
            },
            {
              label: "Interviews Done",
              value: USER.completedInterviews,
              suffix: "",
              icon: Trophy,
              bg: "from-emerald-600/20 to-teal-700/10",
              accent: "text-emerald-400",
              iconBg: "bg-emerald-500/15",
              change: "+4 this week",
              ocid: "dashboard.interviews_card",
            },
            {
              label: "Day Streak",
              value: USER.streak,
              suffix: " days",
              icon: Flame,
              bg: "from-orange-600/20 to-red-700/10",
              accent: "text-orange-400",
              iconBg: "bg-orange-500/15",
              change: "Keep it up! 🔥",
              ocid: "dashboard.streak_card",
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              data-ocid={card.ocid}
              className={`glass-card bg-gradient-to-br ${card.bg} p-5 card-hover`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <card.icon className={`w-5 h-5 ${card.accent}`} />
                </div>
                <span
                  className={`text-xs font-medium ${card.accent} opacity-80`}
                >
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-display font-black text-foreground">
                <AnimatedNumber value={card.value} />
                <span className="text-base font-semibold text-muted-foreground">
                  {card.suffix}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Level Progress ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          data-ocid="dashboard.level_card"
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                Level Progress
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Level {USER.level} →{" "}
                <span className="text-primary font-semibold">
                  Level {USER.level + 1}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-black text-2xl gradient-text">
                {Math.round(XP_PROGRESS)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {(USER.nextLevelXp - USER.xp).toLocaleString()} XP to go
              </p>
            </div>
          </div>
          <div className="relative h-4 rounded-full bg-white/5 border border-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{USER.prevLevelXp.toLocaleString()} XP</span>
            <span>{USER.nextLevelXp.toLocaleString()} XP</span>
          </div>
        </motion.div>

        {/* ── Achievement Badges ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          data-ocid="dashboard.badges_section"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">
                Achievement Badges
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {BADGES.filter((b) => b.unlocked).length} / {BADGES.length}{" "}
                unlocked
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary/80" />
              <span className="text-xs text-muted-foreground">Unlocked</span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 ml-3" />
              <span className="text-xs text-muted-foreground">Locked</span>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <AnimatePresence>
              {BADGES.map((badge, i) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      data-ocid={`dashboard.badge.item.${i + 1}`}
                      className={`glass-card p-3 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
                        badge.unlocked
                          ? `hover:-translate-y-1 hover:shadow-lg ${badge.glow}`
                          : "opacity-40 grayscale"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          badge.unlocked
                            ? `bg-gradient-to-br ${badge.color}`
                            : "bg-white/10"
                        }`}
                      >
                        <badge.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-center leading-tight text-foreground/80">
                        {badge.label}
                      </p>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[180px] text-center"
                  >
                    <p className="font-semibold mb-0.5">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.desc}
                    </p>
                    {!badge.unlocked && (
                      <p className="text-xs text-orange-400 mt-1">
                        🔒 Not yet unlocked
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ── Leaderboard Preview + Analytics grid ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            data-ocid="dashboard.leaderboard_section"
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-foreground">
                Top Performers
              </h2>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-2 flex-1">
              {LEADERBOARD.map((user, i) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.07 }}
                  data-ocid={`dashboard.leaderboard.item.${i + 1}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${rankBg(
                    user.rank,
                  )} transition-all hover:border-primary/30`}
                >
                  <span
                    className={`w-7 text-center text-sm ${rankStyle(user.rank)}`}
                  >
                    {user.rank === 1
                      ? "🥇"
                      : user.rank === 2
                        ? "🥈"
                        : user.rank === 3
                          ? "🥉"
                          : `#${user.rank}`}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                  >
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Level {user.level}
                    </p>
                  </div>
                  <span className="text-xs font-bold gradient-text shrink-0">
                    {user.xp.toLocaleString()} XP
                  </span>
                </motion.div>
              ))}

              {/* Current user separator */}
              <div className="pt-2 mt-1 border-t border-white/10">
                <p className="text-[11px] text-muted-foreground text-center mb-2">
                  Your position
                </p>
                <div
                  data-ocid="dashboard.leaderboard.row"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-primary/30 bg-primary/10"
                >
                  <span className="w-7 text-center text-sm font-bold text-primary">
                    #{USER.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    AR
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {USER.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Level {USER.level}
                    </p>
                  </div>
                  <span className="text-xs font-bold gradient-text">
                    {USER.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>

            <Link to="/leaderboard" className="mt-5">
              <Button
                data-ocid="dashboard.leaderboard.button"
                variant="ghost"
                className="w-full gap-2 border border-white/10 hover:border-primary/30 hover:bg-primary/5"
              >
                View Full Leaderboard <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.section>

          {/* Interview Scores Chart */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            data-ocid="dashboard.scores_section"
            className="glass-card p-6"
          >
            <h2 className="font-display font-bold text-xl text-foreground mb-1">
              Interview Scores
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Last 7 sessions
            </p>

            {/* Bar chart */}
            <div className="flex items-end gap-2.5 h-36">
              {INTERVIEW_SCORES.map((item, i) => {
                const heightPct = (item.score / 10) * 100;
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.08 }}
                        data-ocid={`dashboard.chart_point.${i + 1}`}
                      >
                        <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.score}
                        </span>
                        <div
                          className="w-full relative rounded-t-md overflow-hidden bg-white/5"
                          style={{ height: "120px" }}
                        >
                          <motion.div
                            className={`absolute bottom-0 w-full rounded-t-md ${
                              item.score >= 9
                                ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                                : item.score >= 7
                                  ? "bg-gradient-to-t from-blue-600 to-violet-500"
                                  : "bg-gradient-to-t from-slate-600 to-slate-500"
                            }`}
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                              delay: 0.8 + i * 0.08,
                            }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                          {item.label}
                        </span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{item.score}/10</p>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-end gap-4 mt-3">
              {[10, 7, 5, 0].map((v) => (
                <span key={v} className="text-[10px] text-muted-foreground">
                  {v}
                </span>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── Skills + Weekly Activity ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skills Progress */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            data-ocid="dashboard.skills_section"
            className="glass-card p-6"
          >
            <h2 className="font-display font-bold text-xl text-foreground mb-5">
              Skills Progress
            </h2>
            <div className="space-y-4">
              {SKILLS.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {skill.pct}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skillWidths[i]}%` }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: 0.7 + i * 0.1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Weekly Activity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            data-ocid="dashboard.weekly_section"
            className="glass-card p-6"
          >
            <h2 className="font-display font-bold text-xl text-foreground mb-1">
              Weekly Activity
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Sessions completed per day
            </p>
            <div className="flex items-end gap-3 h-32">
              {WEEKLY.map((day, i) => {
                const maxCount = Math.max(...WEEKLY.map((d) => d.count));
                const heightPct = (day.count / maxCount) * 100;
                const isToday = i === 6;
                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <motion.div
                      className="w-full relative rounded-t-md overflow-hidden bg-white/5"
                      style={{ height: "100px" }}
                    >
                      <motion.div
                        className={`absolute bottom-0 w-full rounded-t-md ${
                          isToday
                            ? "bg-gradient-to-t from-violet-600 to-primary"
                            : "bg-gradient-to-t from-blue-700/70 to-blue-500/70"
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: 0.8 + i * 0.07,
                        }}
                      />
                    </motion.div>
                    <span
                      className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {day.day}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {day.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
