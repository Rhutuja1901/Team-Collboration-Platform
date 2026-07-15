import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [memberForm, setMemberForm] = useState({
    teamId: "",
    userId: "",
  });

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data.teams);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();

    try {
      await api.post("/teams", form);

      setForm({
        name: "",
        description: "",
      });

      fetchTeams();

      alert("Team Created Successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating team");
    }
  };

  const addMember = async (e) => {
    e.preventDefault();

    try {
      await api.post("/teams/member", memberForm);

      alert("Member Added Successfully");

      setMemberForm({
        teamId: "",
        userId: "",
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding member");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Teams
      </h1>

      {/* Create Team */}

      <form
        onSubmit={createTeam}
        className="bg-white p-5 rounded shadow mb-8"
      >
        <h2 className="text-xl font-bold mb-4">
          Create Team
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Team Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded">
          Create Team
        </button>
      </form>

      {/* Add Member */}

      <form
        onSubmit={addMember}
        className="bg-white p-5 rounded shadow mb-8"
      >
        <h2 className="text-xl font-bold mb-4">
          Add Member
        </h2>

        <select
          className="border p-2 w-full mb-3"
          value={memberForm.teamId}
          onChange={(e) =>
            setMemberForm({
              ...memberForm,
              teamId: e.target.value,
            })
          }
        >
          <option value="">Select Team</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full mb-3"
          value={memberForm.userId}
          onChange={(e) =>
            setMemberForm({
              ...memberForm,
              userId: e.target.value,
            })
          }
        >
          <option value="">Select User</option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-5 py-2 rounded">
          Add Member
        </button>
      </form>

      {/* Teams */}

      <div className="grid grid-cols-3 gap-5">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded shadow p-5"
          >
            <h2 className="text-xl font-bold">
              {team.name}
            </h2>

            <p className="mt-2">
              {team.description}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}