import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  DollarSign,
  MessageSquare,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const matchColors = [
  {
    min: 8,
    gradient: "from-emerald-500 to-teal-400",
    text: "text-emerald-400",
  },
  { min: 6, gradient: "from-violet-500 to-blue-400", text: "text-violet-400" },
  { min: 0, gradient: "from-amber-500 to-orange-400", text: "text-amber-400" },
];

function getMatchStyle(score: number) {
  const normalized = score > 10 ? score / 10 : score;
  return matchColors.find((c) => normalized >= c.min) ?? matchColors[2];
}

export default function CareerRecommendation() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/shell/career-guidance' } as any) as any;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (search.data) {
      try {
        setData(JSON.parse(search.data));
      } catch (e) {
        console.error("Failed to parse career data", e);
      }
    }
  }, [search.data]);

  const handlePrepareInterview = (careerName: string) => {
    navigate({ to: "/interview-preparation" as any, search: { role: careerName } as any });
  };

  const handleActivateRoadmap = async (career: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/career/activate', {
        careerName: career.careerName || career.name,
        description: career.description,
        learningRoadmap: career.learningRoadmap || [],
        difficulty: career.difficulty || 'beginner',
        estimatedTimeline: career.estimatedTimeline || 'Flexible',
        matchPercentage: career.matchPercentage || career.matchScore || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Roadmap for ${career.careerName || career.name} activated!`);
        navigate({ to: '/roadmap' as any });
      }
    } catch (error: any) {
      toast.error("Failed to activate roadmap: " + (error.response?.data?.message || error.message));
    }
  };

  const careers = data?.recommendedCareers || data?.recommendations || [];
  const roadmapSteps = data?.learningRoadmap || [];
  const suggestionType = search.type || 'discovery';

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm text-primary font-semibold uppercase tracking-widest">
            AI-Powered Career Hub
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 leading-tight">
          Your Career Strategy
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Personalized guidance for your {suggestionType === 'professional' ? 'career transition' : suggestionType === 'explorer' ? 'skill development' : 'career discovery'}.
        </p>
      </motion.div>

      {/* AI Insights / Transition Strategy */}
      {data?.aiAnalysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Insights
          </h2>
          <p className="text-muted-foreground italic text-lg leading-relaxed">"{data.aiAnalysis}"</p>
        </motion.div>
      )}

      {data?.transitionStrategy && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" /> Transition Strategy
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border">
              <span className="text-sm font-bold text-amber-500 uppercase flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" /> Strategic Approach
              </span>
              <p className="text-foreground leading-relaxed">{data.transitionStrategy}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <span className="text-sm font-bold text-emerald-500 uppercase flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" /> Transferable Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.transferableSkills?.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <span className="text-sm font-bold text-violet-500 uppercase flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" /> Estimated Timeline
                </span>
                <p className="text-xl font-bold text-foreground">{data.estimatedTimebox}</p>
              </div>
            </div>

            {data.motivationAdvice && data.motivationAdvice !== "N/A" && (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-sm font-bold block mb-1 text-orange-400">Mindset & Motivation:</span>
                <p className="text-sm text-foreground italic">"{data.motivationAdvice}"</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Suggested Paths */}
      {careers.length > 0 && (
        <section className="space-y-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {suggestionType === 'professional' ? 'Alternative Career Options' : 'Recommended Path Matches'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(suggestionType === 'professional' && data?.alternativeOptions ? data.alternativeOptions.map((opt: string) => ({ name: opt, matchPercentage: 100, description: 'Strategic alternative based on your core professional skills.' })) : careers).map((career: any, i: number) => {
              const score = career.matchPercentage || career.matchScore || (10 - i) * 10;
              const style = getMatchStyle(score);
              return (
                <motion.div
                  key={career.careerName || career.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="glass-card p-6 border border-border hover:border-primary/40 transition-all flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xl">{career.careerName || career.name}</h3>
                    <Badge className={`bg-gradient-to-r ${style.gradient} border-none text-white`}>
                      {score > 10 ? score : score * 10}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{career.description}</p>
                  
                  {(career.learningRoadmap || career.initialRoadmap) && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs font-bold text-primary">KEY STEPS:</p>
                      <div className="space-y-1">
                        {(career.learningRoadmap || []).slice(0, 3).map((step: any) => (
                          <div key={step.title || step} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="w-3 h-3 text-primary" /> {step.title || step}
                          </div>
                        ))}
                        {career.initialRoadmap && !career.learningRoadmap && career.initialRoadmap.map((step: string) => (
                           <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                             <ArrowRight className="w-3 h-3 text-primary" /> {step}
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex gap-3">
                    <Button
                      onClick={() => handlePrepareInterview(career.careerName || career.name)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" /> Interview
                    </Button>
                    <Button
                      onClick={() => handleActivateRoadmap(career)}
                      className="flex-1 gradient-btn"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Activate
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Roadmap Section */}
      {roadmapSteps.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-border">
          <h2 className="font-display font-bold text-2xl md:text-3xl">Detailed Learning Roadmap</h2>
          <div className="space-y-4">
            {roadmapSteps.map((step: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 border-l-4 border-l-primary"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <Badge variant="outline">{step.estimatedDuration || step.timeframe}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Analysis for Explorer */}
      {suggestionType === 'explorer' && (
        <section className="space-y-6 pt-8 border-t border-border">
          <h2 className="font-display font-bold text-2xl">Skill Gap Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 bg-emerald-500/5">
              <h3 className="font-bold mb-4 text-emerald-500">Skills to Leverage</h3>
              <div className="flex flex-wrap gap-2">
                {data?.currentSkills?.map((s: string) => <Badge key={s} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{s}</Badge>)}
              </div>
            </div>
            <div className="glass-card p-6 bg-amber-500/5">
              <h3 className="font-bold mb-4 text-amber-500">Priority Skill Gaps</h3>
              <div className="flex flex-wrap gap-2">
                {data?.missingSkills?.map((s: any) => (
                  <Badge key={typeof s === 'string' ? s : s.skill} className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {typeof s === 'string' ? s : s.skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
