import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <nav className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">⚡</span>
            <h1 className="font-bold text-lg sm:text-xl text-slate-800">PowerBack</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const dashboardPath =
    user.role === "admin"
      ? "/admin-dashboard"
      : user.role === "staff"
      ? "/staff-dashboard"
      : "/user-dashboard";

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">⚡</span>
          <h1 className="font-bold text-lg sm:text-xl text-slate-800">PowerBack</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to={dashboardPath} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Dashboard
          </Link>
          <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {user.role}
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
