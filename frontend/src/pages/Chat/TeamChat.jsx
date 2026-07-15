import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

export default function TeamChat() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchMessages(selectedTeam);

      socket.emit("joinTeam", selectedTeam);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.emit("leaveTeam", selectedTeam);
        socket.off("receiveMessage");
      };
    }
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
      const res = await api.get(`/chat/${teamId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedTeam) return;

    try {
      await api.post("/chat", {
        message,
        teamId: selectedTeam,
      });

      setMessage("");
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
          className="border p-2 rounded mb-4 w-full"
          value={selectedTeam}
          onChange={(e) =>
            setSelectedTeam(e.target.value)
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

        <div className="bg-white rounded shadow p-4 h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="mb-4"
            >
              <p className="font-semibold">
                {msg.sender?.name}
              </p>

              <p>{msg.message}</p>

              <p className="text-xs text-gray-400">
                {new Date(
                  msg.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex mt-4 gap-2">
          <input
            type="text"
            className="border flex-1 p-2 rounded"
            placeholder="Type message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}