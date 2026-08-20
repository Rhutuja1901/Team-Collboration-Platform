import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaTasks,
  FaComments,
  FaClipboardList,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: <FaUsers />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      name: "Kanban",
      path: "/kanban",
      icon: <FaClipboardList />,
    },
    {
      name: "Team Chat",
      path: "/chat",
      icon: <FaComments />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-slate-900 text-white shadow-2xl flex flex-col z-50">

      {/* Logo */}

      <div className="px-8 py-7 border-b border-slate-700">

        <h1 className="text-3xl font-bold tracking-wide">
          TeamCollab
        </h1>

        <p className="text-slate-400 mt-2 text-sm">
          Project Management System
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 px-5 py-6 overflow-y-auto">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl mb-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 shadow-lg text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium text-base">
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* Logout */}

      <div className="p-5 border-t border-slate-700">

        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl transition duration-200"
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
}