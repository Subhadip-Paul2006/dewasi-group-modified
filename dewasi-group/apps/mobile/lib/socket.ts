import { io, Socket } from 'socket.io-client';
import { Config } from './config';
import { TokenStorage } from './secure-store';

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  const token = await TokenStorage.getAccessToken();
  if (!socket) {
    socket = io(Config.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: token ? { token: `Bearer ${token}` } : undefined,
    });
  } else if (token) {
    socket.auth = { token: `Bearer ${token}` };
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
