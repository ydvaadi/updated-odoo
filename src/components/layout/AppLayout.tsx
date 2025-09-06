import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = window.location.pathname;

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && location !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && location === "/login") {
    return <Navigate to="/" replace />;
  }

  // If on login page, render without layout
  if (location === "/login") {
    return <Outlet />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="flex md:hidden items-center justify-between p-4 border-b border-border bg-card">
            <SidebarTrigger className="p-2">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">SynergySphere</h1>
            <div /> {/* Spacer */}
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}