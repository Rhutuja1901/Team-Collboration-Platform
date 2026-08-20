import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import api from "../../services/api";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingMember, setLoadingMember] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [memberForm, setMemberForm] = useState({
    teamId: "",
    userId: "",
  });

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  // ==========================
  // Fetch Teams
  // ==========================
  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load teams");
    }
  };

  // ==========================
  // Fetch Users
  // ==========================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load users");
    }
  };

  // ==========================
  // Create Team
  // ==========================
  const createTeam = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Team name is required");
      return;
    }

    setLoadingTeam(true);

    try {
      await api.post("/teams", form);

      toast.success("Team Created Successfully");

      setForm({
        name: "",
        description: "",
      });

      fetchTeams();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Error creating team"
      );
    } finally {
      setLoadingTeam(false);
    }
  };

  // ==========================
  // Add Member
  // ==========================
  const addMember = async (e) => {
    e.preventDefault();

    if (!memberForm.teamId || !memberForm.userId) {
      toast.warning("Please select both Team and User");
      return;
    }

    setLoadingMember(true);

    try {
      await api.post("/teams/member", memberForm);

      toast.success("Member Added Successfully");

      setMemberForm({
        teamId: "",
        userId: "",
      });

      fetchTeams();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Error adding member"
      );
    } finally {
      setLoadingMember(false);
    }
  };

  return (
    <Layout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-8">
          Teams
        </h1>

        {/* Create Team */}

        <form
          onSubmit={createTeam}
          className="bg-white p-6 rounded-lg shadow mb-8"
        >

          <h2 className="text-xl font-bold mb-5">
            Create Team
          </h2>

          <input
            type="text"
            placeholder="Team Name"
            value={form.name}
            className="border rounded p-3 w-full mb-4"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            className="border rounded p-3 w-full mb-4"
            rows={4}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button
            disabled={loadingTeam}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded disabled:bg-gray-400"
          >
            {loadingTeam
              ? "Creating..."
              : "Create Team"}
          </button>

        </form>

        {/* Add Member */}

        <form
          onSubmit={addMember}
          className="bg-white p-6 rounded-lg shadow mb-8"
        >

          <h2 className="text-xl font-bold mb-5">
            Add Member
          </h2>

          <select
            className="border rounded p-3 w-full mb-4"
            value={memberForm.teamId}
            onChange={(e) =>
              setMemberForm({
                ...memberForm,
                teamId: e.target.value,
              })
            }
          >
            <option value="">
              Select Team
            </option>

            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-3 w-full mb-4"
            value={memberForm.userId}
            onChange={(e) =>
              setMemberForm({
                ...memberForm,
                userId: e.target.value,
              })
            }
          >
            <option value="">
              Select User
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button
            disabled={loadingMember}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded disabled:bg-gray-400"
          >
            {loadingMember
              ? "Adding..."
              : "Add Member"}
          </button>

        </form>

        {/* Teams List */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {teams.length === 0 ? (

            <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
              No Teams Found
            </div>

          ) : (

            teams.map((team) => (

              <div
                key={team.id}
                className="bg-white rounded-lg shadow p-6"
              >

                <h2 className="text-xl font-bold">
                  {team.name}
                </h2>

                <p className="text-gray-600 mt-3">
                  {team.description || "No Description"}
                </p>

                <div className="mt-4">

                  <p className="font-semibold mb-2">
                    Members
                  </p>

                  {team.members?.length ? (

                    team.members.map((member) => (
                      <div
                        key={member.id}
                        className="text-sm text-gray-700"
                      >
                        • {member.user.name}
                      </div>
                    ))

                  ) : (

                    <p className="text-sm text-gray-400">
                      No Members
                    </p>

                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </Layout>
  );
}