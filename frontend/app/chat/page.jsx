"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setChat((prev) => [...prev, { text: data, sender: "other" }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { text: message, sender: "me" }]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#111B21] text-white">
      <div className="w-full max-w-2xl h-[80vh] bg-[#1F2C33] rounded-lg shadow-xl flex flex-col">
        <div className="p-4 border-b border-[#2F3B43] flex justify-between items-center bg-[#202C33] rounded-t-lg">
          <h2 className="text-lg font-semibold">Chat Room 💬</h2>
          <div className="text-xs text-green-400">● Online</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "me"
                    ? "bg-[#005C4B] text-white"
                    : "bg-[#2A3942] text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-[#202C33] border-t border-[#2F3B43] flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-[#111B21] border border-[#2F3B43] focus:border-green-400 focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold"
          >
            Send
          </button>
        </div>
      </div>
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}
