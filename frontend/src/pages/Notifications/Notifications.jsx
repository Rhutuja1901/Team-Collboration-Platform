import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import { io } from "socket.io-client";

// Socket Connection
const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
  "https://team-collboration-platform.onrender.com"
);

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ===========================
  // Fetch Notifications
  // ===========================
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await api.get(`/notifications/${userId}`);

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // Initial Load
  // ===========================
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  // ===========================
  // Join User Room
  // ===========================
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinUser", userId);

    socket.on("newNotification", (notification) => {
      if (notification.userId === userId) {
        setNotifications((prev) => [
          notification,
          ...prev,
        ]);
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [userId]);

  // ===========================
  // Mark Notification Read
  // ===========================
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="bg-white rounded shadow p-6 text-center">
            <p>No notifications available.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`mb-4 p-4 rounded shadow ${
                notification.isRead
                  ? "bg-gray-100"
                  : "bg-yellow-100"
              }`}
            >
              <p className="font-semibold">
                {notification.message}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </p>

              {!notification.isRead && (
                <button
                  onClick={() =>
                    markAsRead(notification.id)
                  }
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}