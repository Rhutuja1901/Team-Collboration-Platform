import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import socket from "../../services/socket";

export default function Tasks() {

  // ==========================
  // States
  // ==========================

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Comments
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  // Attachments
  const [attachments, setAttachments] = useState({});
  const [selectedFile, setSelectedFile] = useState({});

  // Logged-in User
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Task Form
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    deadline: "",
    teamId: "",
    assignedToId: "",
  });

  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {
    fetchTasks();
    fetchTeams();
    fetchUsers();

    socket.on("taskCreated", fetchTasks);
    socket.on("taskUpdated", fetchTasks);
    socket.on("commentCreated", fetchTasks);
    socket.on("attachmentUploaded", fetchTasks);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("commentCreated");
      socket.off("attachmentUploaded");
    };
  }, []);

  // ==========================
  // Fetch Tasks
  // ==========================

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      const allTasks = res.data.tasks || [];

      setTasks(allTasks);

      allTasks.forEach((task) => {
        fetchComments(task.id);
        fetchAttachments(task.id);
      });

    } catch (err) {
      console.log(err);
    }
  };

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
  // Fetch Users
  // ==========================

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      setUsers(res.data.users || []);

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Fetch Comments
  // ==========================

  const fetchComments = async (taskId) => {
    try {
      const res = await api.get(`/comments/${taskId}`);

      setComments((prev) => ({
        ...prev,
        [taskId]: res.data.comments,
      }));

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Fetch Attachments
  // ==========================

  const fetchAttachments = async (taskId) => {
    try {
      const res = await api.get(`/attachments/${taskId}`);

      setAttachments((prev) => ({
        ...prev,
        [taskId]: res.data.attachments,
      }));

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Upload Attachment
  // ==========================

    const uploadAttachment = async (taskId) => {
    try {
      if (!selectedFile[taskId]) {
        alert("Please select a file");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile[taskId]);
      formData.append("taskId", taskId);

      await api.post("/attachments", formData);

      setSelectedFile((prev) => ({
        ...prev,
        [taskId]: null,
      }));

      fetchAttachments(taskId);

      alert("File Uploaded Successfully");

    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }
  };

  // ==========================
  // Add Comment
  // ==========================

  const addComment = async (taskId) => {
    try {
      if (!commentText[taskId]) return;

      await api.post("/comments", {
        text: commentText[taskId],
        taskId,
        userId: currentUser.id,
      });

      setCommentText((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      fetchComments(taskId);

    } catch (err) {
      console.log(err);
      alert("Error adding comment");
    }
  };

  // ==========================
  // Create Task
  // ==========================

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", form);

      alert("Task Created Successfully");

      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        deadline: "",
        teamId: "",
        assignedToId: "",
      });

      fetchTasks();

    } catch (err) {
      console.log(err);
      alert("Error creating task");
    }
  };

  // ==========================
  // Update Task Status
  // ==========================

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  // ADD DELETE FUNCTION HERE
const deleteTask = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/tasks/${id}`);

    fetchTasks();

    alert("Task deleted successfully");

  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};

  // ==========================
  // Search & Filter
  // ==========================

  const filteredTasks = tasks.filter((task) => {
    const searchMatch =
      task.title.toLowerCase().includes(search.toLowerCase());

    const priorityMatch =
      priorityFilter === "ALL" ||
      task.priority === priorityFilter;

    const statusMatch =
      statusFilter === "ALL" ||
      task.status === statusFilter;

    return (
      searchMatch &&
      priorityMatch &&
      statusMatch
    );
  });

  const todo = filteredTasks.filter(
    (task) => task.status === "TODO"
  );

  const progress = filteredTasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const done = filteredTasks.filter(
    (task) => task.status === "DONE"
  );

  // ==========================
  // Task Card
  // ==========================

  const renderColumn = (title, data) => (

  <div className="bg-gray-100 rounded-lg p-4">

    <h2 className="text-xl font-bold mb-4">
      {title}
    </h2>

    {data.length === 0 ? (

      <p className="text-gray-500">
        No Tasks
      </p>

    ) : (

      data.map((task) => (

        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-4 mb-4"
        >

          <h3 className="text-lg font-bold">
            {task.title}
          </h3>

          <p className="text-gray-600 mt-2">
            {task.description || "No Description"}
          </p>

          <p className="mt-2">
            <strong>Priority:</strong> {task.priority}
          </p>

          <p>
            <strong>Deadline:</strong>{" "}
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString()
              : "No Deadline"}
          </p>

          <p>
            <strong>Team:</strong>{" "}
            {task.team?.name || "N/A"}
          </p>

          <p>
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo
              ? task.assignedTo.name
              : "Not Assigned"}
          </p>

          <select
            className="border rounded w-full mt-3 p-2"
            value={task.status}
            onChange={(e) =>
              updateStatus(task.id, e.target.value)
            }
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <button
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-3 w-full"
  onClick={() => deleteTask(task.id)}
>
  Delete Task
</button>

          {/* ================= COMMENTS ================= */}

          <div className="mt-4 border-t pt-4">

            <h4 className="font-semibold mb-2">
              Comments
            </h4>

            {comments[task.id]?.length > 0 ? (

              comments[task.id].map((comment) => (

                <div
                  key={comment.id}
                  className="bg-gray-100 rounded p-2 mb-2"
                >

                  <strong>
                    {comment.user?.name}
                  </strong>

                  <p>{comment.text}</p>

                </div>

              ))

            ) : (

              <p className="text-gray-500 text-sm">
                No comments yet
              </p>

            )}

            <textarea
              rows="2"
              className="border rounded w-full p-2 mt-3"
              placeholder="Write a comment..."
              value={commentText[task.id] || ""}
              onChange={(e) =>
                setCommentText({
                  ...commentText,
                  [task.id]: e.target.value,
                })
              }
            />

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2"
              onClick={() => addComment(task.id)}
            >
              Add Comment
            </button>

          </div>

          {/* ================= ATTACHMENTS ================= */}

          <div className="mt-4 border-t pt-4">

            <h4 className="font-semibold mb-2">
              Attachments
            </h4>

            <input
              type="file"
              className="mb-2"
              onChange={(e) =>
                setSelectedFile({
                  ...selectedFile,
                  [task.id]: e.target.files[0],
                })
              }
            />

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              onClick={() => uploadAttachment(task.id)}
            >
              Upload File
            </button>

            <div className="mt-3">

              {attachments[task.id]?.length > 0 ? (

                attachments[task.id].map((file) => (

                  <div
                    key={file.id}
                    className="border rounded p-2 mt-2"
                  >

                    <a
                      href={`http://localhost:5000${file.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {file.fileName}
                    </a>

                  </div>

                ))

              ) : (

                <p className="text-gray-500 text-sm">
                  No attachments
                </p>

              )}

            </div>

          </div>

        </div>

      ))

    )}

  </div>

);

  // ==============================
  // UI
  // ==============================

  return (

    <Layout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Task Management
        </h1>

        {/* ================= SEARCH ================= */}

        <div className="bg-white shadow rounded-lg p-4 mb-6">

          <input
            type="text"
            placeholder="Search Task..."
            className="border p-2 rounded w-full mb-3"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <select
              className="border p-2 rounded"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="ALL">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

          </div>

        </div>

        {/* ================= CREATE TASK ================= */}

        <form
          onSubmit={createTask}
          className="bg-white shadow rounded-lg p-6 mb-8"
        >

          <input
            type="text"
            placeholder="Task Title"
            className="border p-2 rounded w-full mb-3"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Description"
            className="border p-2 rounded w-full mb-3"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <select
            className="border p-2 rounded w-full mb-3"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value,
              })
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded w-full mb-3"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
          />

          <select
            className="border p-2 rounded w-full mb-3"
            value={form.teamId}
            onChange={(e) =>
              setForm({
                ...form,
                teamId: e.target.value,
              })
            }
            required
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
            className="border p-2 rounded w-full mb-4"
            value={form.assignedToId}
            onChange={(e) =>
              setForm({
                ...form,
                assignedToId: e.target.value,
              })
            }
          >
            <option value="">
              Assign To (Optional)
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Create Task
          </button>

        </form>

        {/* ================= TASK BOARD ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {renderColumn("To Do", todo)}

          {renderColumn("In Progress", progress)}

          {renderColumn("Done", done)}

        </div>

      </div>

    </Layout>

  );

}