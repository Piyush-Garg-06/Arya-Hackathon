import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Bot,
  Trophy,
  User,
  GraduationCap,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  {
    path: "/situation",
    label: "Career Guidance",
    icon: Briefcase,
    ocid: "nav.careers_link",
  },
  {
    path: "/roadmap",
    label: "My Roadmap",
    icon: GraduationCap,
    ocid: "nav.roadmap_link",
  },
  {
    path: "/interview-preparation",
    label: "Interview Practice",
    icon: MessageSquare,
    ocid: "nav.interview_link",
  },
  {
    path: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    ocid: "nav.leaderboard_link",
  },
  {
    path: "/profile",
    label: "Profile",
    icon: User,
    ocid: "nav.profile_link",
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const NavContent = ({ isDrawer = false }: { isDrawer?: boolean }) => (
    <>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border overflow-hidden">
        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence initial={false}>
          {(isDrawer || !collapsed) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-sm text-foreground whitespace-nowrap overflow-hidden"
            >
              AI Career Coach
            </motion.span>
          )}
        </AnimatePresence>
        {isDrawer && (
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-sidebar-foreground" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={item.ocid}
              onClick={isDrawer ? onMobileClose : undefined}
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    active
                      ? "text-primary"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
                  )}
                />
                <AnimatePresence initial={false}>
                  {(isDrawer || !collapsed) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (isDrawer || !collapsed) && (
                  <motion.div
                    layoutId={
                      isDrawer
                        ? "sidebar-indicator-mobile"
                        : "sidebar-indicator"
                    }
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border shrink-0 relative h-screen sticky top-0"
      >
        <NavContent />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
          )}
        </button>
      </motion.aside>

      {/* Mobile overlay drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onMobileClose}
            />
            {/* Drawer */}
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 flex flex-col bg-sidebar border-r border-sidebar-border z-50 shadow-2xl"
            >
              <NavContent isDrawer />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
