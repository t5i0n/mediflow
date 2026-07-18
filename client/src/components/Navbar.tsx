function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold text-blue-600">MediFlow</span>

      <div className="flex items-center gap-4">
        <span className="text-slate-600 font-medium">Dashboard</span>
        <span className="text-slate-600 font-medium">Appointments</span>
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          T
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
