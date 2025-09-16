"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Employee = {
  id: number;
  fullName: string;
};

export default function CreateTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [hrId, setHrId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

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

    if (!employeeId) {
      errors.push("Please select an employee.");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Fetch HR ID and employees list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await axios.get("http://localhost:3001/hr/me", {
          withCredentials: true,
        });
        setHrId(meRes.data.id);

        const empRes = await axios.get("http://localhost:3001/hr/employees", {
          withCredentials: true,
        });
        setEmployees(empRes.data);
      } catch (err) {
        setError("Failed to load HR or employees. Please login again.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hrId) return setError("HR ID not found. Please login again.");
    if (!employeeId) return setError("Please select an employee.");

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3001/hr/assign-task",
        {
          taskTitle,
          description,
          assignedDate,
          dueDate,
          employeeId,
          hrId,
          status: "pending", // default
        },
        { withCredentials: true }
      );

      router.push("/tasks");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Task</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <label className="block">
            Assigned Date
            <input
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </label>

          <label className="block">
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </label>

          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(Number(e.target.value))}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
