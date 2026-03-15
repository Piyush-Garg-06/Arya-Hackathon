import { authService } from "@/services/authService";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouterState();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    console.log('[AuthGuard] Checking auth, token exists:', !!token);
    
    // Small delay to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();
  console.log('[AuthGuard] isAuthenticated:', isAuthenticated);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        search={{ redirect: encodeURIComponent(router.location.href) }}
      />
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
