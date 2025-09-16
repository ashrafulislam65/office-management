"use client";
import { useState, FormEvent } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [age, setAge] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const validateForm = () => {
    // Check required fields
    if (
      !username ||
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !designation ||
      !salary ||
      !age ||
      !gender
    ) {
      return "All fields are required";
    }

    // Username validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return "Username must be 3-20 characters and can only contain letters, numbers, and underscores";
    }

    // Full name validation
    if (!/^[a-zA-Z\s]{2,50}$/.test(fullName)) {
      return "Full name must be 2-50 characters and can only contain letters and spaces";
    }

    // Email validation
    if (!isValidEmail(email)) {
      return "Invalid email address";
    }

    // Password validation
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }

    // Phone validation
    if (!/^\d{11}$/.test(phone)) {
      return "Phone must be exactly 11 digits";
    }

    // Age validation
    const ageNum = Number(age);
    if (ageNum < 18 || !Number.isInteger(ageNum)) {
      return "Age must be a whole number and above 18";
    }

    // Salary validation
    const salaryNum = Number(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      return "Salary must be a positive number";
    }

    // Address validation
    if (address.length < 10) {
      return "Address must be at least 10 characters long";
    }

    return null; // No errors
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        `http://localhost:3001/hr`,
        {
          username,
          fullName,
          email,
          phone,
          password,
          address,
          designation,
          salary: Number(salary),
          isWorking: Boolean(isWorking),
          age: Number(age),
          gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Registration successful!");
        // Clear form
        setUsername("");
        setFullname("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAddress("");
        setDesignation("");
        setSalary("");
        setIsWorking(false);
        setAge("");
        setGender("");
        setError("");
        setMessage("");
      }
    } catch (err: any) {
      if (err.response?.data) {
        // Handle backend validation errors
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message.join(", "));
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed");
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">HR Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullname(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            placeholder="Phone (11 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="password"
            placeholder="Password (min 8 chars, 1 uppercase, 1 special)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isWorking}
              onChange={(e) => setIsWorking(e.target.checked)}
            />
            <label>Currently Working</label>
          </div>
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <div>
            <p className="font-medium mb-2">Gender:</p>
            <label className="mr-4">
              <input
                type="radio"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-1"
              />{" "}
              Male
            </label>
            <label className="mr-4">
              <input
                type="radio"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-1"
              />{" "}
              Female
            </label>
            <label>
              <input
                type="radio"
                value="Other"
                checked={gender === "Other"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-1"
              />{" "}
              Other
            </label>
          </div>

          {error && <p className="text-red-500 py-2">{error}</p>}
          {message && (
            <p className="py-2">
              {message.includes("successful") ? (
                <span className="text-green-600">{message}</span>
              ) : (
                <span className="text-red-500">{message}</span>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? "Processing..." : "Register"}
          </button>
        </form>
        <a
          href="/login"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
