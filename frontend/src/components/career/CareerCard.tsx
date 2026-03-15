import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface CareerCardProps {
  index: number;
  name: string;
  matchPercentage: number;
  description: string;
  skills: string[];
  salary: string;
  growth: string;
  onSelect?: () => void;
}

export default function CareerCard({
  index,
  name,
  matchPercentage,
  description,
  skills,
  salary,
  growth,
  onSelect,
}: CareerCardProps) {
  const matchColor =
    matchPercentage >= 90
      ? "from-emerald-500 to-teal-500"
      : matchPercentage >= 75
        ? "from-violet-500 to-blue-500"
        : "from-orange-500 to-amber-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      data-ocid={`career.card.${index + 1}`}
      className="glass-card p-6 card-hover group cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {salary} · {growth} growth
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-display font-black bg-gradient-to-r ${matchColor} bg-clip-text text-transparent`}
          >
            {matchPercentage}%
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Match
          </div>
        </div>
      </div>

      {/* Match bar */}
      <div className="h-1.5 rounded-full bg-muted mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${matchPercentage}%` }}
          transition={{
            delay: index * 0.1 + 0.3,
            duration: 0.8,
            ease: "easeOut",
          }}
          className={`h-full rounded-full bg-gradient-to-r ${matchColor}`}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-primary font-medium">
        <TrendingUp className="w-4 h-4" />
        <span>Explore path</span>
        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
