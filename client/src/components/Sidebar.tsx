import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarClock,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/useAuth";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const linkActive =
    "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400";
  const linkInactive =
    "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 py-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          M
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          MediFlow
        </span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 mb-4">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          {user?.role === "PATIENT"
            ? "Patient ID"
            : user?.role === "DOCTOR"
              ? "Doctor ID"
              : "Admin ID"}
        </p>
        <p className="text-sm font-mono text-slate-700 dark:text-slate-200">
          {user?.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <Link
          to="/"
          className={`${linkBase} ${isActive("/") ? linkActive : linkInactive}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {user?.role === "PATIENT" && (
          <>
            <Link
              to="/doctors"
              className={`${linkBase} ${isActive("/doctors") ? linkActive : linkInactive}`}
            >
              <Stethoscope size={18} />
              Doctors
            </Link>
            <Link
              to="/my-appointments"
              className={`${linkBase} ${isActive("/my-appointments") ? linkActive : linkInactive}`}
            >
              <CalendarClock size={18} />
              My Appointments
            </Link>
          </>
        )}

        {user?.role === "DOCTOR" && (
          <Link
            to="/doctor-dashboard"
            className={`${linkBase} ${isActive("/doctor-dashboard") ? linkActive : linkInactive}`}
          >
            <CalendarClock size={18} />
            My Schedule
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className={`${linkBase} ${isActive("/admin") ? linkActive : linkInactive}`}
          >
            <ShieldCheck size={18} />
            Admin
          </Link>
        )}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
            {user?.email[0].toUpperCase()}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
            {user?.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={`${linkBase} ${linkInactive} w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950`}
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
