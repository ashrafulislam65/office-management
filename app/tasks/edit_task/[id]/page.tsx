"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function EditTaskPage() {
  const router = useRouter();
  const pathname = usePathname();
  const taskId = pathname.split("/").pop(); // get id from URL

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/hr/tasks/${taskId}`,
          {
            withCredentials: true,
          }
        );
        const task = res.data;
        setTaskTitle(task.taskTitle);
        setDescription(task.description || "");
        setAssignedDate(task.assignedDate.split("T")[0]);
        setDueDate(task.dueDate.split("T")[0]);
        setStatus(task.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTask();
  }, [taskId]);

  const validateForm = () => {
    const errors: string[] = [];
    const today = new Date().toISOString().split("T")[0];

    if (!taskTitle.trim()) {
      errors.push("Task title is required.");
    } else if (taskTitle.trim().length < 3) {
      errors.push("Task title must be at least 3 characters long.");
    }

    if (description.length > 200) {
      errors.push("Description cannot be longer than 200 characters.");
    }

    if (assignedDate < today) {
      errors.push("Assigned date cannot be in the past.");
    }

    if (dueDate < assignedDate) {
      errors.push("Due date must be after or equal to the assigned date.");
    }



    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/hr/tasks/update/${taskId}`,
        { taskTitle, description, assignedDate, dueDate, status },
        { withCredentials: true }
      );
      router.push("/tasks");
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task. Check console for details.");
    }
  };

  return (
    <div className="p-6 ml-110 mt-5">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          className="border p-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={assignedDate}
          onChange={(e) => setAssignedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Update Task
        </button>
      </form>
    </div>
  );
}
