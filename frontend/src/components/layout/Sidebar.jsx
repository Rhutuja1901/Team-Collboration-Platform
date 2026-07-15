import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">
        TeamCollab
      </h1>

      <nav className="flex flex-col gap-3">
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          📊 Dashboard
        </Link>

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <>
            <Link
              to="/teams"
              className="px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              👥 Teams
            </Link>

            <Link
  to="/kanban"
  className="px-4 py-2 rounded hover:bg-gray-700 transition"
>
  📌 Kanban Board
</Link>

            <Link
  to="/activity"
  className="px-4 py-2 rounded hover:bg-gray-700 transition"
>
  📜 Activity Logs
</Link>

            <Link
              to="/users"
              className="px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              👤 Users
            </Link>
          </>
        )}

        <Link
          to="/tasks"
          className="px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          ✅ Tasks
        </Link>

        <Link
          to="/chat"
          className="px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          💬 Team Chat
        </Link>

        <Link
          to="/notifications"
          className="px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          🔔 Notifications
        </Link>

        <Link to="/chat">
  Team Chat
</Link>

        <Link
          to="/profile"
          className="px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          👤 Profile
        </Link>

        <button
          onClick={logout}
          className="mt-6 px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-left"
        >
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}