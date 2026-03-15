import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AuthGuard from "@/components/AuthGuard";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar onMenuToggle={() => setMobileOpen((v) => !v)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        {/* Enterprise-grade floating chat button */}
        <FloatingChatButton />
      </div>
    </AuthGuard>
  );
}
