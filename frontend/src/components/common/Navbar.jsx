import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions",  icon: ArrowLeftRight  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <span className="font-bold text-blue-600 text-lg tracking-tight">
          FinanceTracker
        </span>

        {/* Liens */}
        <ul className="flex gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Utilisateur + déconnexion */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>

      </div>
    </nav>
  );
}
