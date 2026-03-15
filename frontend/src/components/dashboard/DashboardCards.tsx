import { Flame, MessageSquare, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
  ocid: string;
}

interface DashboardCardsProps {
  sessionsCount?: number;
  avgScore?: number;
  rank?: number;
  streak?: number;
}

export default function DashboardCards({
  sessionsCount = 12,
  avgScore = 87,
  rank = 5,
  streak = 7,
}: DashboardCardsProps) {
  const stats: Stat[] = [
    {
      label: "Total Sessions",
      value: sessionsCount.toString(),
      change: "+3 this week",
      positive: true,
      icon: MessageSquare,
      color: "text-blue-400",
      ocid: "dashboard.sessions_card",
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      change: "+5% vs last week",
      positive: true,
      icon: Star,
      color: "text-violet-400",
      ocid: "dashboard.score_card",
    },
    {
      label: "Global Rank",
      value: `#${rank}`,
      change: "↑2 positions",
      positive: true,
      icon: TrendingUp,
      color: "text-emerald-400",
      ocid: "dashboard.rank_card",
    },
    {
      label: "Day Streak",
      value: `${streak}d`,
      change: "Keep it up!",
      positive: true,
      icon: Flame,
      color: "text-orange-400",
      ocid: "dashboard.streak_card",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          data-ocid={stat.ocid}
          className="glass-card p-5 card-hover"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
