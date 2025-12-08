import { io } from "socket.io-client";

export const socket = io("https://realtimechat-4uzm.onrender.com", {
  transports: ["websocket"],
});
