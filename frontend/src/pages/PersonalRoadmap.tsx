import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  Loader2, 
  Lock,
  Sparkles,
  Trophy
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface RoadmapStep {
  _id: string;
  stepNumber: number;
  title: string;
  description: string;
  resources: string[];
  estimatedDuration: string;
  completed: boolean;
}

interface ActiveRoadmap {
  _id: string;
  careerName: string;
  description: string;
  learningRoadmap: RoadmapStep[];
  estimatedTimeline: string;
  difficulty: string;
}

export default function PersonalRoadmap() {
  const [roadmap, setRoadmap] = useState<ActiveRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveRoadmap();
  }, []);

  const fetchActiveRoadmap = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/career/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(response.data.data);
    } catch (error: any) {
      toast.error("Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (stepId: string, currentStatus: boolean) => {
    if (!roadmap) return;
    try {
      setUpdatingId(stepId);
      const token = localStorage.getItem('token');
      await axios.put(`/api/career/paths/${roadmap._id}/steps/${stepId}`, 
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Local update
      setRoadmap({
        ...roadmap,
        learningRoadmap: roadmap.learningRoadmap.map(s => 
          s._id === stepId ? { ...s, completed: !currentStatus } : s
        )
      });
      
      if (!currentStatus) {
        toast.success("Step completed! +15 XP earned");
      }
    } catch (error: any) {
      toast.error("Failed to update step");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold">No Active Roadmap</h2>
        <p className="text-muted-foreground text-lg">
          You haven't activated a career roadmap yet. Head over to Career Guidance to find your path!
        </p>
        <Button asChild className="gradient-btn px-8 h-12">
          <a href="/situation">Find My Career</a>
        </Button>
      </div>
    );
  }

  const completedCount = roadmap.learningRoadmap.filter(s => s.completed).length;
  const progress = Math.round((completedCount / roadmap.learningRoadmap.length) * 100);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header & Progress */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge className="mb-3 bg-primary/20 text-primary border-none">Active Path</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold">{roadmap.careerName}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{roadmap.description}</p>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Total Progress</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-bold">
              {completedCount} of {roadmap.learningRoadmap.length} steps reached
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Your Learning Milestone
          </h3>
          
          <div className="relative space-y-0 pb-10">
            {/* Vertical Line */}
            <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-border" />
            
            {roadmap.learningRoadmap.map((step, idx) => {
              const isActive = !step.completed && (idx === 0 || roadmap.learningRoadmap[idx-1].completed);
              const isLocked = !step.completed && idx > 0 && !roadmap.learningRoadmap[idx-1].completed;

              return (
                <div key={step._id} className={`relative pl-16 pb-12 last:pb-0 group`}>
                  {/* Circle Indicator */}
                  <div className={`absolute left-[18px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                    step.completed ? "bg-primary border-primary" : 
                    isActive ? "bg-background border-primary scale-125 shadow-[0_0_15px_rgba(var(--primary),0.5)]" : 
                    "bg-background border-border"
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                     isLocked ? <Lock className="w-3 h-3 text-muted-foreground" /> :
                     <span className="text-[10px] font-bold">{step.stepNumber}</span>}
                  </div>

                  <Card className={`p-6 transition-all duration-300 border-l-4 ${
                    step.completed ? "border-l-primary bg-primary/5 opacity-80" : 
                    isActive ? "border-l-primary shadow-xl ring-1 ring-primary/10" : 
                    "border-l-transparent text-muted-foreground"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-lg ${isActive ? "text-foreground" : ""}`}>{step.title}</h4>
                          {isActive && <Badge variant="secondary" className="animate-pulse bg-primary/20 text-primary text-[10px]">CURRENT</Badge>}
                        </div>
                        <p className="text-sm leading-relaxed">{step.description}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="w-3.5 h-3.5" /> {step.estimatedDuration}
                          </div>
                          {step.resources.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                              <BookOpen className="w-3.5 h-3.5" /> {step.resources.length} Resources
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={step.completed ? "outline" : "default"}
                        disabled={isLocked || updatingId === step._id}
                        onClick={() => handleToggleStep(step._id, step.completed)}
                        className={`shrink-0 ${step.completed ? "border-primary/50 text-primary" : "gradient-btn"}`}
                      >
                        {updatingId === step._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                         step.completed ? "Undo Finish" : "Mark Complete"}
                      </Button>
                    </div>

                    {/* Resources expandable area would go here */}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Roadmap Details
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Timeline</span>
                <span className="font-semibold">{roadmap.estimatedTimeline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge variant="outline" className="capitalize">{roadmap.difficulty}</Badge>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "This roadmap is dynamically generated for you. Complete steps to level up your career profile."
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-dashed">
            <h4 className="font-bold mb-4">Next Achievement</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-sm">Path Starter</p>
                <p className="text-xs text-muted-foreground">Complete 3 steps to unlock</p>
              </div>
            </div>
          </Card>

          <Button variant="ghost" className="w-full justify-between group" asChild>
            <a href="/interview-preparation">
              <span>Ready for a mock interview?</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
