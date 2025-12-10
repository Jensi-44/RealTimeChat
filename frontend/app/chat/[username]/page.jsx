"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket";

export default function ChatPage() {
  const params = useParams();
  const receiver = params.username;

  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    setSender(stored);
  }, []);

  useEffect(() => {
    if (!sender || !receiver) return;

    const roomId = [sender, receiver].sort().join("_");
    console.log("JOIN ROOM:", roomId);
    socket.emit("joinRoom", roomId);

    const receiveHandler = (data) => {
      console.log("📥 UI RECEIVED:", data);
      setChat((prev) => [...prev, data]);
    };

    socket.on("privateMessage", receiveHandler);

    return () => {
      socket.off("privateMessage", receiveHandler);
    };
  }, [sender, receiver]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const roomId = [sender, receiver].sort().join("_");

    const msg = { roomId, sender, receiver, text: message };
    console.log("🚀 Sending:", msg);

    socket.emit("privateMessage", msg);
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="min-h-screen text-white p-5 bg-[#0b121b]">
      <h2 className="text-xl">
        Chat with <span className="text-green-400">{receiver}</span>
      </h2>

      <div className="mt-3 h-[60vh] bg-[#1c2835] p-3 rounded overflow-y-auto">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === sender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 mt-2 rounded-lg ${
                msg.sender === sender ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 p-2 bg-[#162029] rounded text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
        />
        <button onClick={sendMessage} className="bg-green-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
