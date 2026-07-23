import { type ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
