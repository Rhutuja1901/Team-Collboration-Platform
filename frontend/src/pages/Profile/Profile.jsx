import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${currentUser.id}`);

      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/users/${currentUser.id}`, form);

      alert(res.data.message);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

    } catch (err) {
      console.log(err);
      alert("Profile update failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <form onSubmit={updateProfile}>

          <label className="block mb-2 font-semibold">
            Name
          </label>

          <input
            className="border rounded w-full p-2 mb-4"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <label className="block mb-2 font-semibold">
            Email
          </label>

          <input
            className="border rounded w-full p-2 mb-6"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Update Profile
          </button>

        </form>

      </div>
    </Layout>
  );
}