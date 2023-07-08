// Socket.io imports
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

let socket: Socket | { on: () => void; emit: () => void; off: () => void };

// Connect to web socket
if (typeof window !== "undefined") {
  socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });
} else {
  socket = { on: () => {}, emit: () => {}, off: () => {} };
}

let attempts = 0;

socket.on("connect", () => {
  console.log("Connected to socket.io server");
});
socket.on("disconnect", () => {
  console.log("Disconnected from socket.io server");
});

// socket.on("connect_error", () => {
//   attempts++;
//   if (attempts === 5 && typeof window !== "undefined") {
//     attempts = 0;
//     window.location.href = "/error";
//   }
// });

export default socket;
