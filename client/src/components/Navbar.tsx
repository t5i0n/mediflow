import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MediFlow
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
        >
          Dashboard
        </Link>

        {user?.role === "PATIENT" && (
          <>
            <Link
              to="/doctors"
              className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
            >
              Doctors
            </Link>
            <Link
              to="/my-appointments"
              className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
            >
              My Appointments
            </Link>
          </>
        )}

        {user?.role === "DOCTOR" && (
          <Link
            to="/doctor-dashboard"
            className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
          >
            My Schedule
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
          >
            Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Log Out
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
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
