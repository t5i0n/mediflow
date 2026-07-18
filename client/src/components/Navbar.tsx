import { Link } from "react-router-dom";

function Navbar() {
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
        <Link
          to="/doctors"
          className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
        >
          Doctors
        </Link>
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          T
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
