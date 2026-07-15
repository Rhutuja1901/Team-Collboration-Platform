import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function TaskChart({ analytics }) {

  const data = {
    labels: [
      "To Do",
      "In Progress",
      "Completed",
    ],
    datasets: [
      {
        data: [
          analytics.todoTasks,
          analytics.inProgressTasks,
          analytics.completedTasks,
        ],
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#22c55e",
        ],
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        Task Distribution
      </h2>

      <Doughnut data={data} />
    </div>
  );
}