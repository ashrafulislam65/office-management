"use client";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const currentPath = usePathname();

  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // clears cookie + updates state
    router.push("/login"); // redirect to login
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Employees", href: "/employees" },
    { label: "Tasks", href: "/tasks" },
    { label: "Attendance", href: "/attendance" },
    { label: "Payroll", href: "/salary_list" },
    { label: "Registration", href: "/registration" },
    { label: "Login", href: "/login" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-white shadow-md border-r border-gray-200 p-6">
      <h1 className="text-xl font-bold mb-6">Office Management</h1>

      <nav className="flex flex-col space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md 
              ${
                currentPath === item.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              }
            `}
          >
            {item.label}
          </Link>
        ))}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-red-600 hover:bg-red-100 text-left"
          >
            Logout
          </button>
        )}
      </nav>
    </aside>
  );
}
