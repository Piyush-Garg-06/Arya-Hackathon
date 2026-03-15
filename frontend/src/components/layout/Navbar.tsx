import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Brain, LogOut, Menu, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { authService } from "@/services/authService";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate({ to: "/login" });
  };
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          data-ocid="topbar.menu_toggle"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-foreground text-sm">
            AI Career Coach
          </span>
        </div>
      </div>

      {/* Right: notifications + theme toggle + avatar + logout */}
      <div className="flex items-center gap-2">
        {/* Bell with notification dot */}
        <button
          type="button"
          data-ocid="topbar.notifications_button"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border border-background" />
        </button>

        <ThemeToggle />

        {/* User info */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {user.name}
            </span>
          </div>
        )}

        {/* Avatar */}
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
            {user ? user.name.charAt(0).toUpperCase() : "G"}
          </AvatarFallback>
        </Avatar>

        {/* Logout button */}
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
