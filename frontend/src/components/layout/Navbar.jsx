import { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";

import api from "../../services/api";
import socket from "../../services/socket";

export default function Navbar() {
  // ======================================
  // User
  // ======================================

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const userId = user.id || user._id;

  // ======================================
  // States
  // ======================================

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [searchText, setSearchText] = useState("");
  const [tasks, setTasks] = useState([]);

  // ======================================
  // Today's Date
  // ======================================

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // ======================================
  // Fetch Tasks For Search
  // ======================================

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");

        console.log(
          "Tasks loaded for search:",
          res.data.tasks
        );

        setTasks(res.data.tasks || []);
      } catch (error) {
        console.error(
          "Failed to fetch tasks for search:",
          error
        );
      }
    };

    fetchTasks();
  }, []);

  // ======================================
  // Filter Tasks
  // ======================================

  const filteredTasks = tasks.filter((task) => {
    const search = searchText
      .toLowerCase()
      .trim();

    if (!search) {
      return false;
    }

    return (
      task.title
        ?.toLowerCase()
        .includes(search) ||

      task.description
        ?.toLowerCase()
        .includes(search) ||

      task.status
        ?.toLowerCase()
        .includes(search) ||

      task.priority
        ?.toLowerCase()
        .includes(search)
    );
  });

  // ======================================
  // Load Existing Notifications
  // ======================================

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get(
          `/notifications/${userId}`
        );

        setNotifications(
          res.data.notifications || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      }
    };

    fetchNotifications();
  }, [userId]);

  // ======================================
  // Socket.IO Notifications
  // ======================================

  useEffect(() => {
    if (!userId) return;

    console.log(
      "Joining notification room:",
      userId
    );

    // Join personal notification room
    socket.emit("joinUser", userId);

    // Receive new notification
    const handleNewNotification = (
      notification
    ) => {
      console.log(
        "New notification received:",
        notification
      );

      setNotifications((prev) => [
        notification,
        ...prev,
      ]);
    };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    // Cleanup
    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, [userId]);

  // ======================================
  // Mark Notification As Read
  // ======================================

  const markAsRead = async (notification) => {
    try {
      if (!notification.isRead) {
        const res = await api.put(
          `/notifications/${notification.id}`
        );

        const updatedNotification =
          res.data.notification;

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === updatedNotification.id
              ? updatedNotification
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // ======================================
  // Unread Notification Count
  // ======================================

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.isRead
  ).length;

  // ======================================
  // Handle Search Result Click
  // ======================================

  const handleTaskClick = (task) => {
    console.log("Selected task:", task);

    setSearchText("");

    /*
      We are not redirecting here because
      your Tasks.jsx does not necessarily
      use /tasks?taskId=...
    */

    alert(
      `Task: ${task.title}\nStatus: ${task.status}\nPriority: ${task.priority}`
    );
  };

  // ======================================
  // JSX
  // ======================================

  return (
    <header className="bg-white shadow-md border-b border-gray-200 h-20 flex items-center justify-between px-8">

      {/* ======================================
          LEFT SECTION
      ====================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Team Collaboration Platform
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          {today}
        </p>
      </div>

      {/* ======================================
          RIGHT SECTION
      ====================================== */}

      <div className="flex items-center gap-6">

        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="relative hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80">

          <FaSearch className="text-gray-400 mr-3" />

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            className="bg-transparent outline-none w-full text-gray-700"
          />

          {/* ======================================
              SEARCH RESULTS
          ====================================== */}

          {searchText.trim() !== "" && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">

              {/* No Results */}

              {filteredTasks.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No tasks found
                </div>
              ) : (

                /* Results */

                filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() =>
                      handleTaskClick(task)
                    }
                    className="w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition"
                  >

                    <p className="font-semibold text-gray-800">
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {task.description}
                      </p>
                    )}

                    <div className="flex gap-3 mt-2">

                      <span className="text-xs text-gray-500">
                        Status:{" "}
                        {task.status}
                      </span>

                      <span className="text-xs text-gray-500">
                        Priority:{" "}
                        {task.priority}
                      </span>

                    </div>

                  </button>
                ))
              )}

            </div>
          )}

        </div>

        {/* ======================================
            NOTIFICATION
        ====================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
            className="relative bg-gray-100 hover:bg-gray-200 transition p-3 rounded-full"
          >

            <FaBell className="text-xl text-gray-700" />

            {/* Unread Count */}

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

          </button>

          {/* ======================================
              NOTIFICATION DROPDOWN
          ====================================== */}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

              {/* Header */}

              <div className="flex items-center justify-between px-5 py-4 border-b">

                <h3 className="font-bold text-gray-800">
                  Notifications
                </h3>

                <span className="text-sm text-gray-500">
                  {unreadCount} unread
                </span>

              </div>

              {/* Notification List */}

              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="py-10 text-center text-gray-500">

                    <FaBell className="mx-auto text-3xl text-gray-300 mb-3" />

                    <p>
                      No notifications
                    </p>

                  </div>

                ) : (

                  notifications.map(
                    (notification) => (

                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          markAsRead(
                            notification
                          )
                        }
                        className={`w-full text-left px-5 py-4 border-b hover:bg-gray-50 transition ${
                          !notification.isRead
                            ? "bg-blue-50"
                            : "bg-white"
                        }`}
                      >

                        <div className="flex gap-3">

                          {/* Unread Indicator */}

                          <div className="pt-1">

                            {!notification.isRead && (
                              <span className="block w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                            )}

                          </div>

                          {/* Notification Content */}

                          <div className="flex-1">

                            <p
                              className={`text-sm ${
                                !notification.isRead
                                  ? "font-semibold text-gray-800"
                                  : "text-gray-600"
                              }`}
                            >
                              {
                                notification.message
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {notification.createdAt
                                ? new Date(
                                    notification.createdAt
                                  ).toLocaleString(
                                    "en-IN"
                                  )
                                : ""}
                            </p>

                          </div>

                        </div>

                      </button>

                    )
                  )

                )}

              </div>

            </div>
          )}

        </div>

        {/* ======================================
            USER
        ====================================== */}

        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl shadow-sm">

          <FaUserCircle className="text-4xl text-blue-600" />

          <div>

            <p className="font-semibold text-gray-800">
              {user.name || "User"}
            </p>

            <p className="text-sm text-gray-500">
              {user.role || "Member"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}