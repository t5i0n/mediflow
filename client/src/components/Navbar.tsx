import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { useTheme } from "../contexts/useTheme";

function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <Link
        to="/"
        className="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        MediFlow
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Dashboard
        </Link>

        {user?.role === "PATIENT" && (
          <>
            <Link
              to="/doctors"
              className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Doctors
            </Link>
            <Link
              to="/my-appointments"
              className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              My Appointments
            </Link>
          </>
        )}

        {user?.role === "DOCTOR" && (
          <Link
            to="/doctor-dashboard"
            className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            My Schedule
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Admin
          </Link>
        )}

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Log Out
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
