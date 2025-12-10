"use client";

import { useEffect, useState } from "react";
import { backendUrl } from "../utils/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setCurrentUser(u);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${backendUrl}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const openChat = (username) => {
    router.push(`/chat/${username}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-slate-800 bg-[#020617] flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold">Realtime Chat</h1>
          {currentUser && (
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <span className="text-blue-400">{currentUser}</span>
            </p>
          )}
        </div>

        <div className="p-3 text-xs text-slate-400 uppercase tracking-wide">
          Users
        </div>

        <div className="flex-1 overflow-y-auto">
          {users
            .filter((u) => u.username !== currentUser) // hide self
            .map((u) => (
              <button
                key={u.username}
                onClick={() => openChat(u.username)}
                className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-semibold">
                  {u.username[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">{u.username}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </div>
              </button>
            ))}

          {users.length === 0 && (
            <p className="text-xs text-slate-500 px-4">
              No users yet… create another account.
            </p>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome to your dashboard
          </h2>
          <p className="text-slate-400 mb-4">
            Select a user from the left sidebar to start a private chat.
          </p>
          <p className="text-xs text-slate-500">
            Messages are saved in the database and delivered in real-time
            through Socket.IO.
          </p>
        </div>
      </main>
    </div>
  );
}
