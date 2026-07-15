import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/activities");

      setActivities(res.data.activities || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Activity Logs
        </h1>

        <div className="bg-white rounded-lg shadow p-5">
          {loading ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p>No Activity Found</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="border-b py-4"
              >
                <p className="font-semibold">
                  {activity.action}
                </p>

                <p className="text-gray-500 text-sm">
                  By: {activity.userName}
                </p>

                <p className="text-gray-400 text-xs">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}