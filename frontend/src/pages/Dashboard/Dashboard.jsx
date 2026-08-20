import { useEffect, useState } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaUsers,
  FaUserFriends,
} from "react-icons/fa";

import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import TaskChart from "../../components/dashboard/TaskChart";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalTeams: 0,
    totalUsers: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setAnalytics({
        totalUsers: res.data.stats?.totalUsers || 0,
        totalTeams: res.data.stats?.totalTeams || 0,
        totalTasks: res.data.stats?.totalTasks || 0,
        completedTasks: res.data.stats?.completedTasks || 0,
        inProgressTasks: res.data.stats?.inProgressTasks || 0,
        todoTasks: res.data.stats?.todoTasks || 0,
      });

      setRecentActivities(res.data.recentActivities || []);
      setUpcomingDeadlines(res.data.upcomingDeadlines || []);
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Total Tasks",
      value: analytics.totalTasks,
      color: "bg-blue-600",
      icon: <FaTasks size={28} />,
    },
    {
      title: "Completed",
      value: analytics.completedTasks,
      color: "bg-green-600",
      icon: <FaCheckCircle size={28} />,
    },
    {
      title: "In Progress",
      value: analytics.inProgressTasks,
      color: "bg-yellow-500",
      icon: <FaClock size={28} />,
    },
    {
      title: "To Do",
      value: analytics.todoTasks,
      color: "bg-red-500",
      icon: <FaClipboardList size={28} />,
    },
    {
      title: "Teams",
      value: analytics.totalTeams,
      color: "bg-purple-600",
      icon: <FaUsers size={28} />,
    },
    {
      title: "Users",
      value: analytics.totalUsers,
      color: "bg-indigo-600",
      icon: <FaUserFriends size={28} />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to your Team Collaboration Platform
          </p>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex justify-between items-center"
            >

              <div>

                <p className="text-gray-500 font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
              >
                {card.icon}
              </div>

            </div>

          ))}

        </div>

        {/* Chart */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Task Analytics
          </h2>

          <TaskChart analytics={analytics} />

        </div>

        {/* Bottom Section */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Activities */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Recent Activities
            </h2>

            {recentActivities.length === 0 ? (

              <p className="text-gray-500">
                No recent activity found.
              </p>

            ) : (

              recentActivities.map((activity) => (

                <div
                  key={activity.id}
                  className="border-b last:border-none py-4"
                >

                  <p className="font-semibold">
                    {activity.action}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {activity.userName}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>

                </div>

              ))

            )}

          </div>

          {/* Deadlines */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Upcoming Deadlines
            </h2>

            {upcomingDeadlines.length === 0 ? (

              <p className="text-gray-500">
                No upcoming deadlines.
              </p>

            ) : (

              upcomingDeadlines.map((task) => (

                <div
                  key={task.id}
                  className="border-b last:border-none py-4"
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <span className="text-red-500 text-sm">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>

                  </div>

                  <div className="flex justify-between mt-3">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {task.priority}
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {task.status}
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>
    </Layout>
  );
}