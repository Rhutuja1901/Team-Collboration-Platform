import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import { io } from "socket.io-client";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
  "https://team-collboration-platform.onrender.com"
);

export default function Kanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==========================
  // Socket Events
  // ==========================
  useEffect(() => {
    socket.on("taskCreated", () => {
      fetchTasks();
    });

    socket.on("taskUpdated", () => {
      fetchTasks();
    });

    socket.on("taskDeleted", () => {
      fetchTasks();
    });

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
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Drag End
  // ==========================
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    if (
      result.destination.droppableId ===
      result.source.droppableId
    )
      return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  );

  const renderTasks = (taskList) =>
    taskList.map((task, index) => (
      <Draggable
        key={task.id}
        draggableId={task.id}
        index={index}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:shadow-xl transition"
          >
            <h3 className="font-bold text-lg">
              {task.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {task.description || "No Description"}
            </p>

            <div className="mt-3 space-y-1 text-sm">

              <p>
                <strong>Priority:</strong>{" "}
                {task.priority}
              </p>

              <p>
                <strong>Team:</strong>{" "}
                {task.team?.name || "N/A"}
              </p>

              <p>
                <strong>Assigned:</strong>{" "}
                {task.assignedTo?.name ||
                  "Unassigned"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {task.status}
              </p>

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Created:
              {" "}
              {new Date(
                task.createdAt
              ).toLocaleDateString()}
            </p>

          </div>
        )}
      </Draggable>
    ));

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">
          Real-Time Kanban Board
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* TODO */}

            <Droppable droppableId="TODO">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-blue-50 rounded-xl p-5 min-h-[600px]"
                >
                  <h2 className="text-2xl font-bold mb-5">
                    📋 TODO ({todoTasks.length})
                  </h2>

                  {renderTasks(todoTasks)}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* IN PROGRESS */}

            <Droppable droppableId="IN_PROGRESS">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-yellow-50 rounded-xl p-5 min-h-[600px]"
                >
                  <h2 className="text-2xl font-bold mb-5">
                    🚀 IN PROGRESS ({progressTasks.length})
                  </h2>

                  {renderTasks(progressTasks)}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* DONE */}

            <Droppable droppableId="DONE">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-green-50 rounded-xl p-5 min-h-[600px]"
                >
                  <h2 className="text-2xl font-bold mb-5">
                    ✅ DONE ({doneTasks.length})
                  </h2>

                  {renderTasks(doneTasks)}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </div>

        </DragDropContext>

      </div>
    </Layout>
  );
}