import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketOrigin(): string {
  if (typeof process.env.NEXT_PUBLIC_SOCKET_URL === "string" && process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof process.env.NEXT_PUBLIC_API_URL === "string" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
  }
  return "http://localhost:8000";
}

export function getSocket(): Socket {
  if (!socket) {
    const url = getSocketOrigin();
    socket = io(url, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect_error", (err) => {
      // Soft log - socket failures should never crash the app
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Socket] connection error:", err.message);
      }
    });
  }
  return socket;
}
