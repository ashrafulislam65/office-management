"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function EditSalaryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const salaryId = pathname.split("/").pop();

  const [empFullName, setEmpFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bonus, setBonus] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/hr/salary/id/${salaryId}`,
          { withCredentials: true }
        );
        const salary = res.data;
        setEmpFullName(salary.empFullName);
        setAmount(salary.amount);
        setPayDate(salary.payDate.split("T")[0]); // format date
        setPaymentMethod(salary.paymentMethod);
        setBonus(salary.bonus || "");
      } catch (err) {
        console.error("Error fetching salary", err);
      }
    };
    fetchSalary();
  }, [salaryId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation ---
    if (!amount || Number(amount) <= 0) {
      showToast("Amount must be greater than 0.");
      return;
    }

    if (!payDate) {
      showToast("Payment date is required.");
      return;
    }

    if (bonus && isNaN(Number(bonus))) {
      showToast("Bonus must be a valid number.");
      return;
    }

    // --- Submit ---
    try {
      await axios.patch(
        `http://localhost:3001/hr/salary/update/${salaryId}`,
        {
          amount: Number(amount),
          payDate,
          paymentMethod,
          bonus: bonus ? Number(bonus) : null,
        },
        { withCredentials: true }
      );
      router.push("/salary_list");
    } catch (err: any) {
      console.error("Error updating salary", err);
      showToast(err.response?.data?.message || "Failed to update salary");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Salary</h1>

        {toast && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={empFullName}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Mobile Banking">Mobile Banking</option>
          </select>
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            placeholder="Bonus (optional)"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Salary
          </button>
        </form>
      </div>
    </div>
  );
}
