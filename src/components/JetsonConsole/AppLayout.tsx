import { SystemStatusBar } from "./SystemStatusBar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      <SystemStatusBar />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6 bg-[var(--bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  );
}
