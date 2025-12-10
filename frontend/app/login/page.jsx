"use client";

import { useState } from "react";
import { backendUrl } from "../utils/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please fill all fields");
      return;
    }

    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      document.cookie = `token=${data.token}; path=/`;

      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] to-[#0f172a] text-white flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl">
        <div className="text-left max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome to <span className="text-blue-500">Realtime Chat</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            Fast, secure and realtime private messaging.
          </p>
        </div>

        <div className="bg-[#111827] border border-gray-700 shadow-xl shadow-blue-900/20 p-10 rounded-2xl w-[380px]">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="flex flex-col space-y-4">
            <input
              className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <p className="text-gray-400 text-center mt-4 text-sm">
            Don’t have an account?
            <a href="/signup" className="text-blue-400 hover:underline ml-1">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
