import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border w-full p-2 mb-4 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border w-full p-2 mb-4 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}