import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { LeaderboardEntry } from "../../backend.d";

type SortKey = "score" | "sessions";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_COLORS = [
  "from-amber-400 to-yellow-300",
  "from-slate-300 to-slate-200",
  "from-amber-600 to-amber-500",
];

const RANK_BG = ["bg-amber-400/10", "bg-slate-400/10", "bg-amber-700/10"];

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const sorted = [...entries].sort((a, b) =>
    sortKey === "score"
      ? Number(b.totalScore - a.totalScore)
      : Number(b.sessionsCount - a.sessionsCount),
  );

  return (
    <div className="space-y-3">
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
        <Button
          variant={sortKey === "score" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortKey("score")}
          data-ocid="leaderboard.sort_score_button"
          className={cn("gap-2", sortKey === "score" && "gradient-btn")}
        >
          <Zap className="w-3.5 h-3.5" /> Score
        </Button>
        <Button
          variant={sortKey === "sessions" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortKey("sessions")}
          data-ocid="leaderboard.sort_sessions_button"
          className={cn("gap-2", sortKey === "sessions" && "gradient-btn")}
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> Sessions
        </Button>
      </div>

      {sorted.map((entry, i) => {
        const rank = i + 1;
        const isTop3 = rank <= 3;
        return (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            data-ocid={`leaderboard.row.${rank}`}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-primary/30",
              isTop3 ? `${RANK_BG[i]} border-white/10` : "glass-card",
            )}
          >
            {/* Rank */}
            <div className="w-8 text-center shrink-0">
              {isTop3 ? (
                <div
                  className={`text-lg font-display font-black bg-gradient-to-r ${RANK_COLORS[i]} bg-clip-text text-transparent`}
                >
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </div>
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  #{rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {entry.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {entry.username}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {entry.badges.slice(0, 3).map((b) => (
                  <span key={b} className="text-sm">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
              <p className="font-display font-bold text-foreground">
                {entry.totalScore.toString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.sessionsCount.toString()} sessions
              </p>
            </div>

            {isTop3 && (
              <Trophy
                className={`w-4 h-4 shrink-0 bg-gradient-to-r ${RANK_COLORS[i]} bg-clip-text`}
                style={{
                  color:
                    rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : "#b45309",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
