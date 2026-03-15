import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { 
  Award, Brain, ChevronRight, Compass, Flame, Loader2, Medal, Mic, Moon, 
  Shield, Star, Target, Trophy, Zap, Sparkles, Briefcase, GraduationCap
} from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { gamificationService } from "@/services/gamificationService";

interface XPProgress {
  xpPoints: number;
  level: string;
  dailyStreak: number;
  interviewsCompleted: number;
  badges?: any[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [xpProgress, setXpProgress] = useState<XPProgress | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
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
      
      // Fetch active roadmap
      const token = localStorage.getItem('token');
      const roadmapResponse = await axios.get('/api/career/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveRoadmap(roadmapResponse.data.data);
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

  // Map backend badges to UI
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

  const stats = [
    {
      label: "XP Points",
      value: xpProgress?.xpPoints || 0,
      suffix: " XP",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Current Level",
      value: xpProgress?.level || "Beginner",
      suffix: "",
      icon: Shield,
      color: "text-blue-500",
    },
    {
      label: "Interviews Done",
      value: xpProgress?.interviewsCompleted || 0,
      suffix: "",
      icon: Trophy,
      color: "text-green-500",
    },
    {
      label: "Day Streak",
      value: xpProgress?.dailyStreak || 0,
      suffix: " days",
      icon: Flame,
      color: "text-orange-500",
    },
  ];

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "User"}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Level {xpProgress?.level} · {xpProgress?.xpPoints?.toLocaleString() || 0} XP total
            </p>
          </div>
          <Button asChild className="sm:w-auto gradient-btn text-white">
            <Link to="/interview-preparation" search={{ role: "" }}>
              Start Interview
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Active Roadmap Progress */}
        {activeRoadmap && (
          <Link to="/roadmap">
            <Card className="p-6 border-l-4 border-l-primary bg-primary/5 hover:shadow-md transition-all group">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Current Goal: {activeRoadmap.careerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Next Step: {activeRoadmap.learningRoadmap.find((s: any) => !s.completed)?.title || "All steps completed!"}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-[300px] space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-primary">Roadmap Progress</span>
                    <span>{Math.round((activeRoadmap.learningRoadmap.filter((s: any) => s.completed).length / activeRoadmap.learningRoadmap.length) * 100)}%</span>
                  </div>
                  <Progress value={(activeRoadmap.learningRoadmap.filter((s: any) => s.completed).length / activeRoadmap.learningRoadmap.length) * 100} className="h-2" />
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stat.value}
                      {stat.suffix && (
                        <span className={`text-sm font-semibold ${stat.color} ml-1`}>
                          {stat.suffix.replace(" ", "")}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color.replace("text-", "from-").replace("500", "500/10")} to-transparent`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Badges Section */}
        {mappedBadges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {mappedBadges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className={`relative p-4 rounded-xl bg-gradient-to-br ${badge.color} shadow-lg ${badge.glow} cursor-pointer hover:scale-105 transition-transform`}>
                      <div className="flex flex-col items-center gap-2">
                        <badge.icon className="w-8 h-8 text-white" />
                        <p className="text-xs font-semibold text-white text-center">{badge.label}</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{badge.desc}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Career Guidance Tiers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" /> Career Guidance Hub
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">AI-powered personalized roadmaps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/quiz">
              <Card className="p-7 h-full hover:shadow-xl transition-all border-violet-500/20 bg-violet-500/5 backdrop-blur-sm cursor-pointer group hover:border-violet-500/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-20 h-20" />
                </div>
                <Compass className="w-10 h-10 text-violet-500 mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl group-hover:text-violet-500 transition-colors">1. Path Discovery</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  "I don't know my interest" — Take our AI test to find the career that matching your personality.
                </p>
                <div className="mt-5 flex items-center text-sm font-semibold text-violet-400">
                  Find Interests <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link to="/situation">
              <Card className="p-7 h-full hover:shadow-xl transition-all border-blue-500/20 bg-blue-500/5 backdrop-blur-sm cursor-pointer group hover:border-blue-500/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Brain className="w-20 h-20" />
                </div>
                <Target className="w-10 h-10 text-blue-500 mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl group-hover:text-blue-500 transition-colors">2. Skill Bridge</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  "I know my interest" — Analyze your skill gap and get a custom roadmap for your target domain.
                </p>
                <div className="mt-5 flex items-center text-sm font-semibold text-blue-400">
                  Get Roadmap <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link to="/situation">
              <Card className="p-7 h-full hover:shadow-xl transition-all border-amber-500/20 bg-amber-500/5 backdrop-blur-sm cursor-pointer group hover:border-amber-500/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Briefcase className="w-20 h-20" />
                </div>
                <Medal className="w-10 h-10 text-amber-500 mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl group-hover:text-amber-500 transition-colors">3. Career Pivot</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  "Working professional" — Plan your field shift safely with AI-driven transition strategies.
                </p>
                <div className="mt-5 flex items-center text-sm font-semibold text-amber-400">
                  Plan Switch <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Other Tools */}
        <div className="space-y-6 pt-10 border-t border-border/50">
          <h2 className="text-xl font-bold flex items-center gap-2">Practice & Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/interview-preparation" search={{ role: "" }}>
              <Card className="p-6 h-full flex items-center gap-5 hover:bg-emerald-500/5 transition-all cursor-pointer group border-border/50">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Mock Interview Practice</h3>
                  <p className="text-sm text-muted-foreground">Train with Aria AI for your next big break</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-emerald-500" />
              </Card>
            </Link>

            <Link to="/leaderboard">
              <Card className="p-6 h-full flex items-center gap-5 hover:bg-purple-500/5 transition-all cursor-pointer group border-border/50">
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Global Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">See where you stand among fellow developers</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-purple-500" />
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
