import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Login from "./pages/Login/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import Teams from "./pages/Teams/Teams";
import Tasks from "./pages/Tasks/Tasks";
import Profile from "./pages/Profile/Profile";
import Notifications from "./pages/Notifications/Notifications";
import Users from "./pages/Users/Users";
import Activity from "./pages/Activity/Activity";
import Kanban from "./pages/Kanban/Kanban";
import TeamChat from "./pages/Chat/TeamChat";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Teams */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
              <Teams />
            </ProtectedRoute>
          }
        />

        {/* Tasks */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Activity Logs */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />

        {/* Kanban Board */}
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          }
        />

        <Route
  path="/chat"
  element={
    <ProtectedRoute>
      <TeamChat />
    </ProtectedRoute>
  }
/>

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;