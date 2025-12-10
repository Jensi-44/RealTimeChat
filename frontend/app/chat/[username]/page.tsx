"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket"; 

interface Message {
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

export default function ChatPage() {
  const params = useParams();
  const receiver = params.username as string;

  const [sender, setSender] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setSender(stored);
  }, []);

  useEffect(() => {
    if (!sender || !receiver) return;

    socket.emit("joinRoom", { sender, receiver });

    const handleHistory = (data: { messages: Message[] }) => {
      setChat(Array.isArray(data.messages) ? data.messages : []);
    };

    const handleMessage = (msg: Message) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("chatHistory", handleHistory);
    socket.on("privateMessage", handleMessage);

    return () => {
      socket.off("chatHistory", handleHistory);
      socket.off("privateMessage", handleMessage);
    };
  }, [sender, receiver]);

  const sendMessage = () => {
    if (!message.trim() || !sender || !receiver) return;

    socket.emit("privateMessage", {
      sender,
      receiver,
      text: message,
    });
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!sender) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-5 bg-[#0b121b] flex flex-col">
      <h2 className="text-2xl font-bold mb-6">
        Chat with <span className="text-green-400">{receiver}</span>
      </h2>

      <div className="flex-1 bg-[#1c2835] rounded-xl p-4 overflow-y-auto mb-4 max-h-[65vh]">
        {chat.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          chat.map((msg, i) => (
            <div
              key={i}
              className={`flex mb-4 ${
                msg.sender === sender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl break-words ${
                  msg.sender === sender ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 block mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 p-4 bg-[#162029] rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 transition"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          autoFocus
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}
