import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { AccessGate } from "./AccessGate";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full gap-3 bg-background p-2.5 md:gap-4 md:p-4">
        <AppSidebar />
        <div className="app-surface flex min-h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />
          <SubscriptionBanner />
          <main className="flex min-w-0 flex-1 flex-col overflow-auto p-3 md:p-5">
            <AccessGate>{children}</AccessGate>
          </main>
          <footer className="mx-5 flex min-h-10 flex-wrap items-center justify-between gap-2 border-t border-border/60 px-1 py-2 text-[10px] text-muted-foreground">
            <span className="font-display font-bold text-primary">DODRI CORE / 1.0.0</span>
            <span className="hidden md:inline">The intelligence layer for your business</span>
            <span className="flex items-center gap-1.5 text-success"><span className="status-dot bg-success" /> Systems operational</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
