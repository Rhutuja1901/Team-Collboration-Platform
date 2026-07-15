import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Teams from "./pages/Teams/Teams";
import Tasks from "./pages/Tasks/Tasks";
import Profile from "./pages/Profile/Profile";
import Chat from "./pages/Chat/Chat";
import Notifications from "./pages/Notifications/Notifications";

import ProtectedRoute from "./routes/ProtectedRoute";
import Users from "./pages/Users/Users";
import Activity from "./pages/Activity/Activity";
import Kanban from "./pages/Kanban/Kanban";
import TeamChat from "./pages/chat/TeamChat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/teams"
  element={
    <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
      <Teams />
    </ProtectedRoute>
  }
/>

        <Route path="/chat" element={<TeamChat />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
  path="/activity"
  element={
    <ProtectedRoute>
      <Activity />
    </ProtectedRoute>
  }
/>

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
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
  path="/chat"
  element={<TeamChat />}
/>

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

      <Route
  path="/users"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <Users />
    </ProtectedRoute>
  }
/>

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