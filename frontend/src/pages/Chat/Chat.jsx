import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import socket from "../../services/socket";

export default function Chat() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;
console.log("Logged in user:", user);
  useEffect(() => {
    fetchTeams();

    socket.on("newMessage", () => {
      if (selectedTeam) {
        fetchMessages(selectedTeam);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async (teamId) => {
    try {
      const res = await api.get(`/messages/${teamId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!user) {
  alert("Please login again.");
  return;
}
    if (!text.trim() || !selectedTeam) return;

    try {
      await api.post("/messages", {
        text,
        teamId: selectedTeam,
        userId: user.id,
      });

      setText("");
      fetchMessages(selectedTeam);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Team Chat
        </h1>

        <select
          className="border p-2 rounded w-full mb-5"
          value={selectedTeam}
          onChange={(e) => {
            setSelectedTeam(e.target.value);
            fetchMessages(e.target.value);
          }}
        >
          <option value="">Select Team</option>

          {teams.map((team) => (
            <option
              key={team.id}
              value={team.id}
            >
              {team.name}
            </option>
          ))}
        </select>

        <div className="bg-white rounded shadow h-[450px] overflow-y-auto p-4">

          {messages.length === 0 ? (

            <p>No messages yet.</p>

          ) : (

            messages.map((msg) => (

              <div
                key={msg.id}
                className="mb-3 border-b pb-2"
              >
                <strong>
                  {msg.user?.name}
                </strong>

                <p>{msg.text}</p>

                <small className="text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>

              </div>

            ))

          )}

        </div>

        <div className="flex gap-3 mt-5">

          <input
            type="text"
            className="border rounded p-2 flex-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>
    </Layout>
  );
}