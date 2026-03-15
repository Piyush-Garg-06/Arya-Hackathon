import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, ChevronRight, Lightbulb, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export default function CareerSetup() {
  const navigate = useNavigate();
  const { selectedSituation } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Guided Tier State
  const [desiredCareer, setDesiredCareer] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");

  // Professional Tier State
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [yearsOfExp, setYearsOfExp] = useState("");
  const [motivationIssue, setMotivationIssue] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedSituation === "guided") {
        const skillsArray = currentSkills.split(",").map(s => s.trim()).filter(Boolean);
        const response = await authService.request("/career/analyze", {
          method: "POST",
          body: JSON.stringify({ desiredCareer, currentSkills: skillsArray }),
        });

        if (!response.ok) throw new Error("Failed to analyze skills");
        const result = await response.json();
        (navigate as any)({ to: "/career-guidance", search: { type: 'explorer', data: JSON.stringify(result.data) } });
      } else {
        const response = await authService.request("/career/transition", {
          method: "POST",
          body: JSON.stringify({ 
            currentRole, 
            targetRole, 
            yearsOfExperience: parseInt(yearsOfExp), 
            motivationIssue 
          }),
        });

        if (!response.ok) throw new Error("Failed to analyze transition");
        const result = await response.json();
        toast.success("Transition strategy generated!");
        (navigate as any)({ to: "/career-guidance", search: { type: 'professional', data: JSON.stringify(result.data) } });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            selectedSituation === 'guided' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          } border text-sm font-semibold`}>
            {selectedSituation === 'guided' ? <Lightbulb className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            {selectedSituation === 'guided' ? 'Guided Growth' : 'Professional Transition'}
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">
            Tell us about your goals
          </h1>
          <p className="text-muted-foreground">
            Provide a few details so our AI can build your personalized strategy.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 border border-border/50 space-y-6"
        >
          {selectedSituation === "guided" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="career">What is your target career or role?</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="career"
                    placeholder="e.g. Frontend Developer, Data Scientist"
                    className="pl-10"
                    value={desiredCareer}
                    onChange={(e) => setDesiredCareer(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">What skills do you currently have?</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g. HTML, CSS, Basic Python (Comma separated)"
                  rows={4}
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currRole">Current Role</Label>
                  <Input
                    id="currRole"
                    placeholder="e.g. Marketing Manager"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g. Product Manager"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Total Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="e.g. 5"
                  value={yearsOfExp}
                  onChange={(e) => setYearsOfExp(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <input
                  id="motivation"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-border"
                  checked={motivationIssue}
                  onChange={(e) => setMotivationIssue(e.target.checked)}
                />
                <div>
                  <Label htmlFor="motivation" className="text-sm font-semibold cursor-pointer">
                    Experiencing burnout or low motivation?
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check this if you want AI to include supportive advice and mental strategies.
                  </p>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-6 text-lg font-bold gap-2"
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Strategy
                <ChevronRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
