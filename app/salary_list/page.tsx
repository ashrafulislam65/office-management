"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<any[]>([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get("http://localhost:3001/hr/salary", {
          withCredentials: true,
        });
        setSalaries(res.data);
      } catch (err) {
        console.error("Error fetching salaries", err);
      }
    };
    fetchSalaries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-60">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Salaries</h1>
          <Link
            href="/create_salary"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Salary
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Pay Date</th>
                <th className="p-2 border">Payment Method</th>
                <th className="p-2 border">Bonus</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.id} className="text-center">
                  <td className="p-2 border">{salary.empFullName}</td>
                  <td className="p-2 border">{salary.amount}</td>
                  <td className="p-2 border">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{salary.paymentMethod}</td>
                  <td className="p-2 border">
                    {salary.bonus ? salary.bonus : "-"}
                  </td>
                  <td className="p-2 border">
                    <Link
                      href={`/salary_list/edit_salary/${salary.id}`}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {salaries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No salary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
