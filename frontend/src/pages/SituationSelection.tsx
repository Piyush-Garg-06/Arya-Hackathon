import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Compass, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

const situations = [
  {
    id: "unknown",
    label: "I don't know my interests",
    desc: "Not sure what career path excites you? We'll help you discover your strengths and passions through a guided assessment.",
    icon: Compass,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    border: "hover:border-violet-500/50",
    ocid: "situation.unknown_card",
  },
  {
    id: "guided",
    label: "I know my interest but need guidance",
    desc: "You have a direction in mind but need a clear roadmap. We'll show you the skills, roles, and steps to get there.",
    icon: Lightbulb,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/50",
    ocid: "situation.guided_card",
  },
  {
    id: "professional",
    label: "I am a working professional wanting to switch or grow",
    desc: "Ready to level up or pivot? We'll map your experience to new opportunities and build a strategy for your next move.",
    icon: Briefcase,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/50",
    ocid: "situation.professional_card",
  },
];

export default function SituationSelection() {
  const navigate = useNavigate();
  const { setSelectedSituation } = useAppContext();

  const handleSelect = (id: string) => {
    setSelectedSituation(id);
    if (id === "unknown") {
      navigate({ to: "/quiz" });
    } else {
      navigate({ to: "/career-setup" as any });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
          Where are you in your career journey?
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the option that best describes your current situation. We'll
          personalize your experience from here.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {situations.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(s.id)}
            data-ocid={s.ocid}
            className={`glass-card p-7 text-left border border-border ${s.border} transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl`}
          >
            <div
              className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-5`}
            >
              <s.icon className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
              {s.label}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
            <div
              className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${s.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
