import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

function TopBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <input
        type="text"
        placeholder="Search doctors, appointments..."
        className="w-80 max-w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled
      />

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
