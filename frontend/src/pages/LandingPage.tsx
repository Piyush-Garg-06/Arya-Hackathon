import ThemeToggle from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Compass,
  MessageSquare,
  Mic,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Brain,
    title: "AI Career Discovery",
    desc: "Explore career paths tailored to your personality, skills, and interests using advanced AI analysis.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "hover:border-violet-400/40",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    desc: "Practice with realistic AI-powered interviews and get instant, detailed feedback on every answer.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "hover:border-blue-400/40",
  },
  {
    icon: Zap,
    title: "Gamified Learning",
    desc: "Earn XP, unlock badges, and level up your skills through engaging, game-like learning challenges.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "hover:border-emerald-400/40",
  },
  {
    icon: Trophy,
    title: "Leaderboard & Progress Tracking",
    desc: "Track your growth with detailed analytics and compete with peers on the global leaderboard.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "hover:border-amber-400/40",
  },
];

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Discover Your Career",
    desc: "Take our AI-powered quiz to uncover your ideal career path based on your strengths.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    numColor: "text-violet-400/30",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Learn Required Skills",
    desc: "Follow personalized learning paths curated by AI for your chosen career.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    numColor: "text-blue-400/30",
  },
  {
    number: "03",
    icon: Mic,
    title: "Practice Interviews",
    desc: "Simulate real interviews with AI coaching and detailed performance feedback.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    numColor: "text-emerald-400/30",
  },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "1.2M", label: "Mock Interviews" },
  { value: "94%", label: "Placement Rate" },
  { value: "4.9★", label: "User Rating" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer @ Google",
    text: "AI Career Coach helped me land my dream job. The mock interviews felt incredibly realistic!",
    avatar: "PS",
  },
  {
    name: "James Wilson",
    role: "Product Manager @ Stripe",
    text: "The career recommendation was spot-on. I discovered PM as my path through the interest quiz.",
    avatar: "JW",
  },
  {
    name: "Ana Gonzalez",
    role: "UX Designer @ Airbnb",
    text: "Practiced 30+ interviews here. My confidence skyrocketed. The feedback is genuinely helpful.",
    avatar: "AG",
  },
];

// Abstract SVG illustration for hero
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 blur-2xl" />
      <div className="relative glass-card p-6 rounded-3xl border border-white/10">
        {/* Mock UI card */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="h-2.5 w-28 rounded-full bg-white/20 mb-1.5" />
              <div className="h-2 w-20 rounded-full bg-white/10" />
            </div>
          </div>
          {/* Career match bars */}
          {[
            {
              label: "Software Engineer",
              pct: "87%",
              w: "w-[87%]",
              color: "bg-violet-400",
            },
            {
              label: "Data Scientist",
              pct: "72%",
              w: "w-[72%]",
              color: "bg-blue-400",
            },
            {
              label: "Product Manager",
              pct: "65%",
              w: "w-[65%]",
              color: "bg-emerald-400",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{item.label}</span>
                <span className="font-semibold">{item.pct}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: item.pct }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                  className={`h-2 rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { v: "94%", l: "Match" },
              { v: "12", l: "Skills" },
              { v: "A+", l: "Grade" },
            ].map((s) => (
              <div key={s.l} className="text-center rounded-xl bg-white/5 py-2">
                <p className="font-display font-bold text-sm gradient-text">
                  {s.v}
                </p>
                <p className="text-[10px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Floating badge */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        >
          ✓ 94% Match Found!
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-4 -left-4 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        >
          🎯 Interview Ready!
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-foreground">
            AI Career Coach
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              data-ocid="nav.dashboard.link"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/situation">
            <Button
              size="sm"
              className="gradient-btn"
              data-ocid="nav.get_started.primary_button"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-24 px-6 gradient-mesh overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text side */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  AI-Powered Career Intelligence
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-extrabold text-5xl md:text-6xl xl:text-7xl leading-tight text-foreground mb-6"
              >
                Land Your
                <span className="block gradient-text">Dream Career</span>
                <span className="block text-4xl md:text-5xl xl:text-6xl">
                  with AI Coaching
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Discover your perfect career path, practice real interviews with
                AI feedback, and track your progress to job-ready confidence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
              >
                <Link to="/situation">
                  <Button
                    size="lg"
                    className="gradient-btn px-8 py-6 text-base gap-3 shadow-glow w-full sm:w-auto"
                    data-ocid="hero.career_guidance.primary_button"
                  >
                    <Compass className="w-5 h-5" />
                    Start Career Guidance
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/interview-preparation" search={{ role: "" }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-base gap-2 border-border hover:border-primary w-full sm:w-auto"
                    data-ocid="hero.interview_prep.secondary_button"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Start Interview Preparation
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground"
              >
                {[
                  "No credit card required",
                  "Free forever plan",
                  "5-min setup",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Illustration side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 w-full"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="font-display font-black text-3xl gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Platform Features
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Everything you need to
              <span className="gradient-text"> succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete platform built for serious career seekers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass-card p-6 border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-default ${f.border}`}
                data-ocid={`features.item.${i + 1}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                >
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Simple Process
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to transform your career trajectory.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] h-px bg-gradient-to-r from-violet-400/30 via-blue-400/30 to-emerald-400/30" />

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                  data-ocid={`how_it_works.item.${i + 1}`}
                >
                  {/* Number badge */}
                  <div className="relative inline-block mb-6">
                    <span
                      className={`absolute -top-3 -left-3 font-display font-black text-5xl leading-none select-none pointer-events-none ${step.numColor}`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`relative w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center border border-white/10 mx-auto`}
                    >
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                  </div>

                  {/* Connector arrow on mobile */}
                  {i < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-2 mb-2">
                      <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                    </div>
                  )}

                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl text-center text-foreground mb-12"
          >
            Real stories, real results
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 card-hover"
              >
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 gradient-mesh relative overflow-hidden"
          >
            {/* Background decorative orb */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600/10 to-blue-600/10 pointer-events-none" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
                Join 50,000+ career seekers
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start your free account today and get AI-powered career
                coaching.
              </p>
              <Link to="/situation">
                <Button
                  size="lg"
                  className="gradient-btn px-10 py-6 text-base gap-3 shadow-glow"
                  data-ocid="cta.career_journey.primary_button"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Your Career Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Free forever • No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-sm text-muted-foreground">
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
