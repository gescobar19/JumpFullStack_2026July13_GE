import { Link } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  username: string;
  role: "CUSTOMER" | "ADMIN";
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, username, role, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-[#0F172A] text-white px-8 py-5 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <div className="text-3xl">✧</div>
        <span className="font-semibold text-2xl tracking-tight">Celestial Bank</span>
      </Link>

      {isLoggedIn && (
        <div className="flex items-center gap-8 text-sm font-medium">
          {role === "ADMIN" ? (
            <Link to="/admin" className="hover:text-sky-300 transition-colors">Admin Dashboard</Link>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-sky-300 transition-colors">Dashboard</Link>
              <Link to="/create-account" className="hover:text-sky-300 transition-colors">Create Account</Link>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="text-right">
              <div className="font-medium text-sm">{username}</div>
              <div className="text-xs text-sky-300 tracking-widest">{role}</div>
            </div>
            <button onClick={onLogout} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition-all">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-[#0F172A] hover:bg-sky-50 px-5 py-2 rounded-xl text-sm font-medium transition-all">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;