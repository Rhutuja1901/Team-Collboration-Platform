import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import socket from "../../services/socket";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
export default function Tasks() {
  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search") || "";

  // ==========================
  // States
  // ==========================

  const [tasks, setTasks] = useState([]);
const [teams, setTeams] = useState([]);
const [users, setUsers] = useState([]);

const [loading, setLoading] = useState(false);

const [editingTask, setEditingTask] = useState(null);

const [form, setForm] = useState({
  title: "",
  description: "",
  priority: "MEDIUM",
  deadline: "",
  teamId: "",
  assignedToId: "",
});

const deleteAttachment = async (attachmentId, taskId) => {
  try {
    await api.delete(`/attachments/${attachmentId}`);

    fetchAttachments(taskId);

  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};

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

 
  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {
  fetchTasks();
  fetchTeams();
  fetchUsers();

  socket.on("taskCreated", fetchTasks);
  socket.on("taskUpdated", fetchTasks);
  socket.on("taskDeleted", fetchTasks);

  return () => {
    socket.off("taskCreated");
    socket.off("taskUpdated");
    socket.off("taskDeleted");
  };
}, []);

  // ==========================
  // Fetch Tasks
  // ==========================

  const fetchTasks = async () => {
  try {
    const res = await api.get("/tasks");

    const fetchedTasks = res.data.tasks;

    setTasks(fetchedTasks);

    // Load attachments for every task
    fetchedTasks.forEach((task) => {
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
    console.log("Fetching attachments for task:", taskId);

    const res = await api.get(`/attachments/${taskId}`);

    console.log(
      "Attachment response for",
      taskId,
      ":",
      res.data
    );

    setAttachments((prev) => ({
      ...prev,
      [taskId]: res.data.attachments,
    }));

  } catch (err) {
    console.error(
      "Failed to fetch attachments for task:",
      taskId,
      err
    );
  }
};

  // ==========================
  // Upload Attachment
  // ==========================

   const uploadAttachment = async (taskId) => {
  const file = selectedFile[taskId];

  if (!file) {
    toast.warning("Please select a file first.");
    return;
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("taskId", taskId);

  try {
    await api.post("/attachments", formData);

    toast.success("File uploaded successfully");

    // Clear selected file
    setSelectedFile({
      ...selectedFile,
      [taskId]: null,
    });

    // Refresh attachments
    fetchAttachments(taskId);

  } catch (error) {
    console.error(
      "Upload error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
      "File upload failed"
    );
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

  if (!form.title || !form.teamId) {
    toast.warning("Title and Team are required.");
    return;
  }

  setLoading(true);

  try {
    await api.post("/tasks", form);

    toast.success("Task Created Successfully");

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
    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Unable to create task."
    );
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // Update Task Status
  // ==========================

  const updateTask = async (e) => {
  e.preventDefault();

  if (!editingTask) return;

  try {

    await api.put(
      `/tasks/edit/${editingTask}`,
      form
    );

    toast.success("Task Updated Successfully");

    setEditingTask(null);

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

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Unable to update task."
    );

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

    toast.success("Task Deleted Successfully");

    fetchTasks();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Unable to delete task."
    );

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



  const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};



    const editTask = (task) => {

  setEditingTask(task.id);

  setForm({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    deadline: task.deadline
      ? task.deadline.substring(0, 10)
      : "",
    teamId: task.teamId,
    assignedToId: task.assignedToId || "",
  });

};
// ==========================
// Task Column
// ==========================

const renderColumn = (title, data) => (

  <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">

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
          className="bg-white rounded-lg shadow p-4 mb-5"
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
            <strong>Status:</strong> {task.status}
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
            {task.assignedTo?.name || "Unassigned"}
          </p>

          {/* Status */}

          <select
            className="border rounded w-full mt-3 p-2"
            value={task.status}
            onChange={(e) =>
              updateStatus(task.id, e.target.value)
            }
          >
            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="DONE">
              Done
            </option>

          </select>

          {/* Buttons */}

          <div className="flex gap-2 mt-3">

            <button
              onClick={() => editTask(task)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
            >
              Delete
            </button>

          </div>

          {/* Comments */}

          <div className="mt-5 border-t pt-4">

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

          {/* Attachments */}

          <div className="mt-5 border-t pt-4">

            <h4 className="font-semibold mb-3">
              Attachments
            </h4>

            <input
              type="file"
              className="mb-3"
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
  className="flex justify-between items-center border rounded-lg p-3 mt-2"
>
  <a
    href={`http://localhost:5001${file.fileUrl}`}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline"
  >
    📄 {file.fileName}
  </a>

  <button
    onClick={() =>
      deleteAttachment(file.id, task.id)
    }
    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
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

    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Task Management
          </h1>

          <p className="text-gray-500 mt-2">
            Create, assign, update and manage project tasks.
          </p>

        </div>

      </div>

        {/* ================= SEARCH & FILTER ================= */}

<div className="bg-white shadow-lg rounded-xl p-6 mb-8">

  <h2 className="text-xl font-bold mb-5">
    Search & Filter Tasks
  </h2>

  <input
    type="text"
    placeholder="🔍 Search task by title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border rounded-lg p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <select
      value={priorityFilter}
      onChange={(e) =>
        setPriorityFilter(e.target.value)
      }
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="ALL">
        All Priorities
      </option>

      <option value="LOW">
        🟢 Low
      </option>

      <option value="MEDIUM">
        🟡 Medium
      </option>

      <option value="HIGH">
        🔴 High
      </option>

    </select>

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="ALL">
        All Status
      </option>

      <option value="TODO">
        📋 To Do
      </option>

      <option value="IN_PROGRESS">
        🚀 In Progress
      </option>

      <option value="DONE">
        ✅ Done
      </option>

    </select>

  </div>

</div>

        {/* ================= CREATE / EDIT TASK ================= */}

<form
  onSubmit={createTask}
  className="bg-white shadow-lg rounded-xl p-6 mb-8"
>

  <h2 className="text-2xl font-bold mb-6">
    {editingTask ? "Edit Task" : "Create New Task"}
  </h2>

  <input
    type="text"
    name="title"
    placeholder="Task Title"
    value={form.title}
    onChange={handleChange}
    className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />

  <textarea
    name="description"
    placeholder="Task Description"
    value={form.description}
    onChange={handleChange}
    rows="4"
    className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

    <select
      name="priority"
      value={form.priority}
      onChange={handleChange}
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="LOW">🟢 Low</option>
      <option value="MEDIUM">🟡 Medium</option>
      <option value="HIGH">🔴 High</option>
    </select>

    <input
      type="date"
      name="deadline"
      value={form.deadline}
      onChange={handleChange}
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <select
      name="teamId"
      value={form.teamId}
      onChange={handleChange}
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  </div>

  <select
    name="assignedToId"
    value={form.assignedToId}
    onChange={handleChange}
    className="w-full border rounded-lg p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">
      Assign User (Optional)
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

  <div className="flex gap-3">

    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
    >
      {editingTask ? "Update Task" : "Create Task"}
    </button>

    {editingTask && (

      <button
        type="button"
        onClick={() => {
          setEditingTask(null);

          setForm({
            title: "",
            description: "",
            priority: "MEDIUM",
            deadline: "",
            teamId: "",
            assignedToId: "",
          });
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
      >
        Cancel
      </button>

    )}

  </div>

</form>

{/* ================= TASK BOARD ================= */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {renderColumn("📋 To Do", todo)}

  {renderColumn("🚀 In Progress", progress)}

  {renderColumn("✅ Done", done)}

</div>

</div>

</Layout>

);
}