import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import socket from "../../services/socket";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Handle Login
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warning("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN API RESPONSE:", res.data);

      // Save JWT Token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Save User
      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        // Notify Socket Server User is Online
        socket.emit("user-online", res.data.user.id);
      }

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Login Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}