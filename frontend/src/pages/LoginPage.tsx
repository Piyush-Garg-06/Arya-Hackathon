import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Eye, EyeOff, Lock, Mail, Shield, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService } from "@/services/authService";

const API_BASE_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      
      // Verify token was stored
      const token = localStorage.getItem('token');
      console.log('Login successful, token stored:', !!token);
      
      toast.success("Login successful! Redirecting...");
      
      // Give time for localStorage to sync
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-500/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/8 blur-3xl"
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-primary to-blue-500" />

          <div className="p-8">
            {/* Logo + branding */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center shadow-lg mb-4">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                AI Career Coach
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your intelligent career companion
              </p>
            </motion.div>

            {/* Welcome headline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to continue your career journey
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Internet Identity button */}
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => toast.info("Internet Identity integration coming soon!", { duration: 3000 })}
                  className="w-full h-11 border border-border/60 bg-card/40 hover:bg-accent/50 text-sm font-medium gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Internet Identity
                </Button>
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary" />
                  Secured by Internet Computer Protocol
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs text-muted-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoFocus
                      className="pl-10 bg-card/40 border-border/60 h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs text-muted-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-card/40 border-border/60 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gradient-btn text-white font-semibold text-sm relative overflow-hidden"
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Signing in...
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider before ICP */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-muted-foreground text-xs">or</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Internet Identity button */}
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => toast.info("Internet Identity integration coming soon!", { duration: 3000 })}
                  className="w-full h-11 border border-border/60 bg-card/40 hover:bg-accent/50 text-sm font-medium gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Internet Identity
                </Button>
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary" />
                  Secured by Internet Computer Protocol
                </p>
              </div>



              {/* Sign up link */}
              <p className="text-center text-xs text-muted-foreground pt-4">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground/60 mt-6"
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
