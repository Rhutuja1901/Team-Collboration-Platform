import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import socket from "../../services/socket";

export default function TeamChat() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ==========================
  // Load Teams
  // ==========================
  useEffect(() => {
    fetchTeams();
  }, []);

  // ==========================
  // Join Team & Listen Messages
  // ==========================
  useEffect(() => {
    if (!selectedTeam) return;

    fetchMessages(selectedTeam);

    socket.emit("joinTeam", selectedTeam);

    socket.on("receiveMessage", (message) => {
      if (message.teamId === selectedTeam) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.emit("leaveTeam", selectedTeam);
      socket.off("receiveMessage");
    };
  }, [selectedTeam]);

  // ==========================
  // Fetch Teams
  // ==========================
  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Fetch Messages
  // ==========================
  const fetchMessages = async (teamId) => {
    try {
      const res = await api.get(`/chat/${teamId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Send Message
  // ==========================
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (!selectedTeam) {
      alert("Please select a team");
      return;
    }

    try {
      await api.post("/chat", {
        message: text,
        teamId: selectedTeam,
      });

      setText("");

      fetchMessages(selectedTeam);

    } catch (err) {
      console.log(err.response?.data || err);
      alert("Failed to send message");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Team Chat
        </h1>

        {/* Select Team */}

        <select
          className="border rounded-lg p-3 w-full mb-6"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
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

        {/* Chat Box */}

        <div className="bg-white rounded-lg shadow h-[500px] overflow-y-auto p-5">

          {messages.length === 0 ? (

            <div className="text-center text-gray-500 mt-10">
              No messages yet
            </div>

          ) : (

            messages.map((msg) => (

              <div
                key={msg.id}
                className={`mb-4 ${
                  msg.senderId === user?.id
                    ? "text-right"
                    : "text-left"
                }`}
              >

                <div
                  className={`inline-block rounded-lg px-4 py-3 max-w-md ${
                    msg.senderId === user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >

                  <p className="font-bold">
                    {msg.sender?.name}
                  </p>

                  <p className="mt-1">
                    {msg.message}
                  </p>

                  <small className="block mt-2 text-xs">
                    {new Date(msg.createdAt).toLocaleString()}
                  </small>

                </div>

              </div>

            ))

          )}

        </div>

        {/* Input */}

        <div className="flex gap-3 mt-5">

          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-lg p-3"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
          >
            Send
          </button>

        </div>

      </div>
    </Layout>
  );
}