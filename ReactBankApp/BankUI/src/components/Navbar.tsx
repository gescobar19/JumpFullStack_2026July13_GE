import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/accounts', label: 'Accounts' },
    { path: '/transactions', label: 'Transactions' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">🏦 ABC Digital Bank</div>

      <div className="nav-tabs">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-tab ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-user">
        <span>Welcome, {user?.name || user?.username || 'User'}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;