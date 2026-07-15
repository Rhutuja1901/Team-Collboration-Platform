import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Replace with logged-in user's ID later
  const userId = "cmr20m4md0000x1h8p4fok3k3";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      fetchNotifications();
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
              <p className="font-medium">
                {notification.message}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>

              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
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