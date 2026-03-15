import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown, Flame, Medal, Star, Trophy, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type FilterPeriod = "weekly" | "monthly" | "alltime";

interface LeaderboardUser {
  rank: number;
  username: string;
  xp: number;
  badges: string[];
  isCurrentUser?: boolean;
  streak?: number;
}

const avatarColors = [
  "bg-violet-500/30 text-violet-300",
  "bg-blue-500/30 text-blue-300",
  "bg-emerald-500/30 text-emerald-300",
  "bg-amber-500/30 text-amber-300",
  "bg-rose-500/30 text-rose-300",
  "bg-cyan-500/30 text-cyan-300",
  "bg-fuchsia-500/30 text-fuchsia-300",
  "bg-orange-500/30 text-orange-300",
];

const weeklyData: LeaderboardUser[] = [
  {
    rank: 1,
    username: "NovaSpark",
    xp: 4280,
    badges: ["🔥", "⚡", "🎯"],
    streak: 12,
  },
  { rank: 2, username: "ProxiCode", xp: 3950, badges: ["💎", "🚀"], streak: 8 },
  {
    rank: 3,
    username: "ZenithRise",
    xp: 3710,
    badges: ["🌟", "🎓"],
    streak: 7,
  },
  {
    rank: 4,
    username: "Alex Chen",
    xp: 3480,
    badges: ["🏆", "💡"],
    isCurrentUser: true,
    streak: 5,
  },
  { rank: 5, username: "VortexMind", xp: 3200, badges: ["🔮"], streak: 4 },
  { rank: 6, username: "PixelDrift", xp: 2990, badges: ["🎨"], streak: 3 },
  { rank: 7, username: "NeonPath", xp: 2750, badges: ["🌊"], streak: 3 },
  { rank: 8, username: "CipherFox", xp: 2500, badges: ["🦊"], streak: 2 },
  { rank: 9, username: "AuroraStep", xp: 2340, badges: [], streak: 2 },
  { rank: 10, username: "QubitX", xp: 2100, badges: [], streak: 1 },
  { rank: 11, username: "CosmicLeaf", xp: 1870, badges: [], streak: 1 },
  { rank: 12, username: "HexNova", xp: 1620, badges: [], streak: 1 },
  { rank: 13, username: "StellarByte", xp: 1450, badges: [], streak: 0 },
  { rank: 14, username: "PhaseWave", xp: 1200, badges: [], streak: 0 },
  { rank: 15, username: "OrbitalKey", xp: 980, badges: [], streak: 0 },
];

const monthlyData: LeaderboardUser[] = [
  {
    rank: 1,
    username: "ProxiCode",
    xp: 18500,
    badges: ["💎", "🚀", "🔥"],
    streak: 28,
  },
  {
    rank: 2,
    username: "ZenithRise",
    xp: 16800,
    badges: ["🌟", "🎓", "⚡"],
    streak: 22,
  },
  {
    rank: 3,
    username: "CipherFox",
    xp: 15200,
    badges: ["🦊", "🎯"],
    streak: 19,
  },
  {
    rank: 4,
    username: "NovaSpark",
    xp: 14600,
    badges: ["🔥", "⚡"],
    streak: 16,
  },
  {
    rank: 5,
    username: "Alex Chen",
    xp: 13900,
    badges: ["🏆", "💡"],
    isCurrentUser: true,
    streak: 14,
  },
  { rank: 6, username: "AuroraStep", xp: 12300, badges: ["🌊"], streak: 11 },
  { rank: 7, username: "VortexMind", xp: 11500, badges: ["🔮"], streak: 9 },
  { rank: 8, username: "PixelDrift", xp: 10200, badges: ["🎨"], streak: 8 },
  { rank: 9, username: "NeonPath", xp: 9800, badges: [], streak: 7 },
  { rank: 10, username: "StellarByte", xp: 8700, badges: [], streak: 5 },
  { rank: 11, username: "QubitX", xp: 7900, badges: [], streak: 4 },
  { rank: 12, username: "OrbitalKey", xp: 6800, badges: [], streak: 3 },
  { rank: 13, username: "PhaseWave", xp: 5600, badges: [], streak: 2 },
  { rank: 14, username: "CosmicLeaf", xp: 4500, badges: [], streak: 2 },
  { rank: 15, username: "HexNova", xp: 3200, badges: [], streak: 1 },
];

const allTimeData: LeaderboardUser[] = [
  {
    rank: 1,
    username: "ZenithRise",
    xp: 142500,
    badges: ["🌟", "🎓", "💎", "🔥"],
    streak: 180,
  },
  {
    rank: 2,
    username: "ProxiCode",
    xp: 138200,
    badges: ["🚀", "⚡", "🎯"],
    streak: 145,
  },
  {
    rank: 3,
    username: "AuroraStep",
    xp: 121000,
    badges: ["🌊", "🔮"],
    streak: 120,
  },
  {
    rank: 4,
    username: "CipherFox",
    xp: 108700,
    badges: ["🦊", "🎨"],
    streak: 98,
  },
  {
    rank: 5,
    username: "NovaSpark",
    xp: 95400,
    badges: ["🔥", "⚡"],
    streak: 88,
  },
  { rank: 6, username: "StellarByte", xp: 87200, badges: ["🌟"], streak: 72 },
  {
    rank: 7,
    username: "Alex Chen",
    xp: 79800,
    badges: ["🏆", "💡"],
    isCurrentUser: true,
    streak: 65,
  },
  { rank: 8, username: "VortexMind", xp: 68500, badges: ["🔮"], streak: 51 },
  { rank: 9, username: "QubitX", xp: 58100, badges: [], streak: 40 },
  { rank: 10, username: "NeonPath", xp: 49600, badges: [], streak: 32 },
  { rank: 11, username: "PixelDrift", xp: 42300, badges: [], streak: 25 },
  { rank: 12, username: "OrbitalKey", xp: 34900, badges: [], streak: 18 },
  { rank: 13, username: "HexNova", xp: 28700, badges: [], streak: 12 },
  { rank: 14, username: "CosmicLeaf", xp: 21500, badges: [], streak: 8 },
  { rank: 15, username: "PhaseWave", xp: 15200, badges: [], streak: 4 },
];

const dataMap: Record<FilterPeriod, LeaderboardUser[]> = {
  weekly: weeklyData,
  monthly: monthlyData,
  alltime: allTimeData,
};

const filters: { key: FilterPeriod; label: string; ocid: string }[] = [
  { key: "weekly", label: "Weekly", ocid: "leaderboard.weekly_tab" },
  { key: "monthly", label: "Monthly", ocid: "leaderboard.monthly_tab" },
  { key: "alltime", label: "All Time", ocid: "leaderboard.alltime_tab" },
];

function formatXP(xp: number): string {
  return `${xp.toLocaleString()} XP`;
}

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(username: string): string {
  const idx = username.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

const rankBadgeConfig = [
  {
    icon: "👑",
    gradient: "from-amber-300 via-yellow-400 to-amber-300",
    glow: "shadow-amber-400/40",
    border: "border-amber-400/50",
    bg: "bg-amber-400/10",
    rowBg: "bg-gradient-to-r from-amber-400/10 via-yellow-400/5 to-transparent",
    label: "Gold",
    textGradient: "from-amber-300 to-yellow-300",
  },
  {
    icon: "🥈",
    gradient: "from-slate-300 via-gray-200 to-slate-300",
    glow: "shadow-slate-300/30",
    border: "border-slate-400/40",
    bg: "bg-slate-400/10",
    rowBg: "bg-gradient-to-r from-slate-400/10 via-gray-400/5 to-transparent",
    label: "Silver",
    textGradient: "from-slate-300 to-gray-300",
  },
  {
    icon: "🥉",
    gradient: "from-amber-600 via-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    border: "border-amber-600/40",
    bg: "bg-amber-700/10",
    rowBg: "bg-gradient-to-r from-amber-700/10 via-orange-600/5 to-transparent",
    label: "Bronze",
    textGradient: "from-amber-500 to-orange-400",
  },
];

function PodiumCard({
  user,
  position,
}: { user: LeaderboardUser; position: number }) {
  const config = rankBadgeConfig[position];
  const isCenter = position === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: position * 0.1 + 0.15,
        duration: 0.5,
        ease: "easeOut",
      }}
      className={cn(
        "relative glass-card p-5 text-center flex flex-col items-center gap-3 border",
        config.border,
        config.bg,
        isCenter && "md:-mt-5 shadow-xl",
        isCenter && config.glow,
        "shadow-lg",
      )}
    >
      {isCenter && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div
            className={`px-3 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-xs font-bold text-black`}
          >
            #1 Champion
          </div>
        </div>
      )}

      <span className="text-3xl mt-1">{config.icon}</span>

      <Avatar
        className={cn(
          "border-2",
          config.border,
          isCenter ? "w-14 h-14" : "w-12 h-12",
        )}
      >
        <AvatarFallback
          className={cn(
            getAvatarColor(user.username),
            "font-bold",
            isCenter ? "text-base" : "text-sm",
          )}
        >
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>

      <div>
        <p className="font-bold text-foreground text-sm truncate max-w-[100px]">
          {user.username}
        </p>
        <p
          className={cn(
            "font-display font-black text-base bg-gradient-to-r bg-clip-text text-transparent",
            `from-${config.textGradient.split("-")[1]}-400 to-${config.textGradient.split("-")[3]}-300`,
          )}
        >
          <span
            className={`bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`}
          >
            {formatXP(user.xp)}
          </span>
        </p>
      </div>

      {user.badges.length > 0 && (
        <div className="flex gap-1">
          {user.badges.slice(0, 3).map((b) => (
            <span key={b} className="text-base">
              {b}
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r text-black",
          config.gradient,
        )}
      >
        Rank #{user.rank}
      </div>
    </motion.div>
  );
}

function LeaderboardRow({
  user,
  index,
}: { user: LeaderboardUser; index: number }) {
  const isTop3 = user.rank <= 3;
  const config = isTop3 ? rankBadgeConfig[user.rank - 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      data-ocid={`leaderboard.row.${index + 1}`}
      className={cn(
        "flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3.5 rounded-xl border transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 group cursor-default",
        isTop3 && config
          ? `${config.rowBg} ${config.border}`
          : "glass-card border-white/10",
        user.isCurrentUser && "border-violet-500/50 ring-1 ring-violet-500/20",
      )}
    >
      {/* Rank */}
      <div className="w-8 md:w-10 text-center shrink-0">
        {isTop3 && config ? (
          <span className="text-xl leading-none">{config.icon}</span>
        ) : (
          <span className="font-display font-bold text-sm text-muted-foreground">
            #{user.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <Avatar
        className={cn(
          "w-9 h-9 shrink-0 border",
          isTop3 && config ? config.border : "border-white/10",
          user.isCurrentUser && "border-violet-400/60",
        )}
      >
        <AvatarFallback
          className={cn(getAvatarColor(user.username), "text-xs font-bold")}
        >
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "font-semibold text-sm",
              user.isCurrentUser ? "text-violet-300" : "text-foreground",
            )}
          >
            {user.username}
          </span>
          {user.isCurrentUser && (
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 border-violet-500/40 text-violet-300 bg-violet-500/10"
            >
              You
            </Badge>
          )}
          {user.badges.length > 0 && (
            <div className="flex gap-0.5">
              {user.badges.slice(0, 3).map((b) => (
                <span key={b} className="text-sm leading-none">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
        {user.streak !== undefined && user.streak > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-muted-foreground">
              {user.streak} day streak
            </span>
          </div>
        )}
      </div>

      {/* XP Score */}
      <div className="text-right shrink-0">
        <div
          className={cn(
            "font-display font-bold text-sm md:text-base",
            isTop3 && config
              ? `bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`
              : "text-foreground",
            user.isCurrentUser && !isTop3 && "text-violet-300",
          )}
        >
          {formatXP(user.xp)}
        </div>
        <div className="flex items-center justify-end gap-1">
          <Zap className="w-3 h-3 text-primary/60" />
          <span className="text-xs text-muted-foreground">XP</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const [filter, setFilter] = useState<FilterPeriod>("weekly");
  const data = dataMap[filter];
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-600/10 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-400/10">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl gradient-text">
              Leaderboard
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Compete with learners worldwide 🌍
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex gap-2 mb-8 p-1 glass-card w-fit rounded-2xl"
      >
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            data-ocid={f.ocid}
            onClick={() => setFilter(f.key)}
            className={cn(
              "relative px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
              filter === f.key
                ? "text-white shadow-md shadow-violet-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {filter === f.key && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl gradient-btn"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Podium — Top 3 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`podium-${filter}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-3 gap-3 mb-8 items-end"
        >
          {/* Silver (#2) — left */}
          <PodiumCard user={top3[1]} position={1} />
          {/* Gold (#1) — center elevated */}
          <PodiumCard user={top3[0]} position={0} />
          {/* Bronze (#3) — right */}
          <PodiumCard user={top3[2]} position={2} />
        </motion.div>
      </AnimatePresence>

      {/* Full Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`table-${filter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
          data-ocid="leaderboard.table"
        >
          {/* Table header */}
          <div className="flex items-center gap-3 md:gap-4 px-3 md:px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-8 md:w-10 text-center">Rank</div>
            <div className="w-9 shrink-0" />
            <div className="flex-1">User</div>
            <div className="text-right">XP Score</div>
          </div>

          {/* Top 3 in table */}
          {data.slice(0, 3).map((user, i) => (
            <LeaderboardRow
              key={`top-${filter}-${user.username}`}
              user={user}
              index={i}
            />
          ))}

          <div className="border-t border-white/10 my-4" />

          {/* Ranks 4–15 */}
          {rest.map((user, i) => (
            <LeaderboardRow
              key={`rest-${filter}-${user.username}`}
              user={user}
              index={i + 3}
            />
          ))}

          {data.length === 0 && (
            <div
              data-ocid="leaderboard.empty_state"
              className="glass-card p-12 text-center text-muted-foreground flex flex-col items-center gap-3"
            >
              <Star className="w-8 h-8 opacity-40" />
              <p className="font-semibold">No entries yet</p>
              <p className="text-sm">Be the first to climb the board!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 glass-card p-4 flex items-center gap-3 border border-primary/15"
      >
        <Zap className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          Complete interviews and career assessments to earn XP and climb the
          leaderboard. Rankings reset each week and month.
        </p>
      </motion.div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-muted-foreground/50">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
