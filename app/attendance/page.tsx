"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Attendance = {
  id: number;
  empFullName: string;
  date: string;
  status: "present" | "absent" | "late";
  checkInTime: string | null;
  checkOutTime: string | null;
};

export default function AttendanceTable() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(""); // for creation
  const [filterDate, setFilterDate] = useState(""); // for filtering
  const [message, setMessage] = useState("");

  // Fetch all attendance
  const fetchAttendance = async (filter?: string) => {
    try {
      let url = "http://localhost:3001/hr/attendance";
      if (filter) {
        url += `?date=${filter}`;
      }
      const res = await axios.get(url, { withCredentials: true });
      setRecords(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtered records for display
  const displayedRecords = filterDate
    ? records
        .filter((rec) => rec.date === filterDate)
        .sort((a, b) => b.date.localeCompare(a.date)) // newest first
    : records.sort((a, b) => b.date.localeCompare(a.date));

  const groupedRecords = displayedRecords.reduce((acc: any, rec) => {
    if (!acc[rec.date]) acc[rec.date] = [];
    acc[rec.date].push(rec);
    return acc;
  }, {});

  // Update attendance
  const updateAttendance = async (
    id: number,
    field: string,
    value: string | null
  ) => {
    try {
      await axios.patch(
        `http://localhost:3001/hr/attendance/update/${id}`,
        { [field]: value },
        { withCredentials: true }
      );
      fetchAttendance(); // refresh after update
    } catch {
      alert("Failed to update attendance");
    }
  };

  // Delete attendance
  const deleteAttendance = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://localhost:3001/hr/attendance/delete/${id}`, {
        withCredentials: true,
      });
      fetchAttendance(); // refresh after delete
    } catch {
      alert("Failed to delete attendance");
    }
  };

  // Create attendance for all employees
  const createAttendance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/hr/attendance/create-for-all",
        { date },
        { withCredentials: true }
      );
      setMessage(`Attendance created for ${res.data.length} employees.`);
      setDate("");
      fetchAttendance(filterDate); // refresh after creation
    } catch (err: any) {
      console.error("Attendance creation error:", err); // safer logging
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Error creating attendance"
      );
    }
  };

  useEffect(() => {
    fetchAttendance(filterDate || undefined);
  }, [filterDate]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (records.length === 0)
    return <p className="text-center mt-4">No attendance records found.</p>;

  return (
    <div className="overflow-x-auto mt-6 mx-5 ml-63 mr-3">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          {/* Create Attendance - Left */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              onClick={createAttendance}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Create Attendance for All
            </button>
          </div>

          {/* Filter by Date - Right */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <button
              onClick={() => {
                setFilterDate("");
                fetchAttendance();
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Attendance tables - one for each date */}
      {Object.keys(groupedRecords).map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 ml-6">{date}</h2>
          <table className="min-w-full bg-white border rounded-lg shadow-md mb-4">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Employee</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Check In</th>
                <th className="py-2 px-4 border">Check Out</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedRecords[date].map((rec: Attendance) => (
                <tr key={rec.id} className="text-center hover:bg-gray-100">
                  <td className="py-2 px-4 border">{rec.id}</td>
                  <td className="py-2 px-4 border">{rec.empFullName}</td>
                  <td className="py-2 px-4 border">
                    <select
                      value={rec.status}
                      onChange={(e) =>
                        updateAttendance(rec.id, "status", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="time"
                      value={rec.checkInTime ?? ""}
                      onChange={(e) =>
                        updateAttendance(rec.id, "checkInTime", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="time"
                      value={rec.checkOutTime ?? ""}
                      onChange={(e) =>
                        updateAttendance(rec.id, "checkOutTime", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => deleteAttendance(rec.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
