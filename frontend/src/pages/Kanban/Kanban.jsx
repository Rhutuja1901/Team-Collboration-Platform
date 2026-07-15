import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function Kanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

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
            className="bg-white rounded-lg shadow p-4 mb-4"
          >
            <h3 className="font-bold text-lg">
              {task.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {task.description || "No Description"}
            </p>

            <p className="mt-2 text-sm">
              <strong>Priority:</strong>{" "}
              {task.priority}
            </p>

            <p className="text-sm">
              <strong>Team:</strong>{" "}
              {task.team?.name || "N/A"}
            </p>

            <p className="text-sm">
              <strong>Assigned To:</strong>{" "}
              {task.assignedTo?.name || "Unassigned"}
            </p>

            <p className="text-xs text-gray-500 mt-2">
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
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">
          Kanban Board
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* TODO COLUMN */}
            <Droppable droppableId="TODO">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded-lg p-4 min-h-[500px]"
                >
                  <h2 className="text-xl font-bold mb-4">
                    To Do ({todoTasks.length})
                  </h2>

                  {renderTasks(todoTasks)}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* IN PROGRESS COLUMN */}
            <Droppable droppableId="IN_PROGRESS">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-yellow-100 rounded-lg p-4 min-h-[500px]"
                >
                  <h2 className="text-xl font-bold mb-4">
                    In Progress ({progressTasks.length})
                  </h2>

                  {renderTasks(progressTasks)}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* DONE COLUMN */}
            <Droppable droppableId="DONE">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-green-100 rounded-lg p-4 min-h-[500px]"
                >
                  <h2 className="text-xl font-bold mb-4">
                    Done ({doneTasks.length})
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