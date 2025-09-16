"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Employee = {
  id: number;
  fullName: string;
};

export default function CreateSalaryPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bonus, setBonus] = useState("");
  const [hrFullName, setHrFullName] = useState("");

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  // Show toast for 3 seconds
  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current HR info
        const meRes = await axios.get("http://localhost:3001/hr/me", {
          withCredentials: true,
        });
        const hrId = meRes.data.id;

        // Get HR full name
        const hrRes = await axios.get(`http://localhost:3001/hr/hr/${hrId}`, {
          withCredentials: true,
        });
        setHrFullName(hrRes.data.fullName);

        // Get employees
        const empRes = await axios.get("http://localhost:3001/hr/employees", {
          withCredentials: true,
        });
        setEmployees(empRes.data);
      } catch (err: any) {
        console.error(err);
        showToast(err.response?.data?.message || "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId) {
      showToast("Please select an employee.", "error");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showToast("Amount must be greater than 0.", "error");
      return;
    }

    try {
      // Get current HR info again to ensure we have the latest data
      const meRes = await axios.get("http://localhost:3001/hr/me", {
        withCredentials: true,
      });
      const hrId = meRes.data.id;

      const empFullName =
        employees.find((emp) => emp.id === Number(employeeId))?.fullName || "";

      await axios.post(
        "http://localhost:3001/hr/salary",
        {
          amount: Number(amount),
          payDate,
          paymentMethod,
          bonus: bonus ? Number(bonus) : null,
          employeeId: Number(employeeId),
          empFullName,
          paidById: hrId,
          paidByFullName: hrFullName,
        },
        { withCredentials: true }
      );

      showToast("Salary record created successfully!", "success");

      setTimeout(() => {
        router.push("/salary_list");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to create salary record", "error");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Salary Record</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Employee Dropdown */}
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName}
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded"
          />

          {/* Pay Date */}
          <input
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Payment Method */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Mobile Banking">Mobile Banking</option>
          </select>

          {/* Bonus */}
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            placeholder="Bonus (optional)"
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Pay Salary
          </button>
        </form>
      </div>
    </div>
  );
}
