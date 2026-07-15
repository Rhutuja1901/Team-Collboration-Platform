import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const res = await api.get("/dashboard");

    setAnalytics({
      totalUsers: res.data.stats.totalUsers || 0,
      totalTeams: res.data.stats.totalTeams || 0,
      totalTasks: res.data.stats.totalTasks || 0,
      completedTasks: res.data.stats.completedTasks || 0,
      inProgressTasks: res.data.stats.inProgressTasks || 0,
      todoTasks: res.data.stats.todoTasks || 0,
    });

  } catch (err) {
    console.log(err);
  }
};

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Tasks
            </h2>

            <p className="text-4xl font-bold mt-3 text-blue-600">
              {analytics.totalTasks}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Completed Tasks
            </h2>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {analytics.completedTasks}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              In Progress
            </h2>

            <p className="text-4xl font-bold mt-3 text-yellow-500">
              {analytics.inProgressTasks}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              To Do
            </h2>

            <p className="text-4xl font-bold mt-3 text-red-500">
              {analytics.todoTasks}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Teams
            </h2>

            <p className="text-4xl font-bold mt-3 text-purple-600">
              {analytics.totalTeams}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Users
            </h2>

            <p className="text-4xl font-bold mt-3 text-indigo-600">
              {analytics.totalUsers}
            </p>
          </div>

        </div>

        {/* Task Chart */}
        <div className="mt-10 bg-white shadow rounded-lg p-6">
          <TaskChart analytics={analytics} />
        </div>

      </div>
    </Layout>
  );
}