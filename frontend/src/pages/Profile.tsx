import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useCareerSessions,
  useInterviewSessions,
  useUpdateProfile,
  useUserProfile,
} from "@/hooks/useQueries";
import {
  Flame,
  Loader2,
  MessageSquare,
  Star,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const achievements = [
  { icon: "🏆", label: "Interview Champion", desc: "Completed 10+ interviews" },
  { icon: "🔥", label: "7-Day Streak", desc: "Practiced 7 days in a row" },
  { icon: "⭐", label: "High Scorer", desc: "Achieved 90+ in an interview" },
  { icon: "💡", label: "Career Explorer", desc: "Explored 5+ career paths" },
];

export default function Profile() {
  const { data: profile } = useUserProfile();
  const { data: careerSessions = [] } = useCareerSessions();
  const { data: interviewSessions = [] } = useInterviewSessions();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [situation, setSituation] = useState(profile?.currentSituation ?? "");

  const avgScore = interviewSessions.length
    ? Math.round(
        interviewSessions.reduce((a, s) => a + Number(s.score), 0) /
          interviewSessions.length,
      )
    : 87;

  const handleSave = async () => {
    try {
      await updateProfile({
        username,
        bio,
        avatarUrl: profile?.avatarUrl ?? "",
        currentSituation: situation,
        quizAnswers: profile?.quizAnswers ?? [],
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account, track achievements, and update your preferences.
        </p>
      </motion.div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 flex items-center gap-6"
      >
        <Avatar className="w-20 h-20">
          <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
            {(username || profile?.username || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-display font-bold text-2xl text-foreground">
            {username || profile?.username}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {bio || profile?.bio}
          </p>
          <div className="flex gap-3 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />{" "}
              {interviewSessions.length} interviews
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Target className="w-3.5 h-3.5" /> {careerSessions.length} career
              paths
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5" /> Avg {avgScore}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Interviews",
            value: interviewSessions.length,
            icon: MessageSquare,
            color: "text-blue-400",
          },
          {
            label: "Career Paths",
            value: careerSessions.length,
            icon: Target,
            color: "text-violet-400",
          },
          {
            label: "Avg Score",
            value: `${avgScore}%`,
            icon: Trophy,
            color: "text-amber-400",
          },
          {
            label: "Day Streak",
            value: "7d",
            icon: Flame,
            color: "text-orange-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="font-display font-bold text-xl text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Achievements
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {achievements.map((a, i) => (
            <div
              key={a.label}
              data-ocid={`profile.achievement.item.${i + 1}`}
              className="glass-card p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {a.label}
                </p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
              <Badge className="ml-auto bg-primary/15 text-primary border-primary/20 text-xs">
                Earned
              </Badge>
            </div>
          ))}
        </div>
      </motion.section>

      <Separator />

      {/* Edit form */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Edit Profile
        </h2>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Username
            </Label>
            <Input
              id="username"
              data-ocid="profile.username_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              className="bg-muted/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">
              Bio
            </Label>
            <Textarea
              id="bio"
              data-ocid="profile.bio_input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself and your career goals..."
              className="bg-muted/50 border-border focus:border-primary resize-none min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Current Situation</Label>
            <Select value={situation} onValueChange={setSituation}>
              <SelectTrigger
                data-ocid="profile.select"
                className="bg-muted/50 border-border"
              >
                <SelectValue placeholder="Select your situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="job_seeker">Job Seeker</SelectItem>
                <SelectItem value="career_changer">Career Changer</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isPending}
              data-ocid="profile.save_button"
              className="gradient-btn px-8 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
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
  );
}
