import { io, Socket } from 'socket.io-client';
import { Config } from './config';
import { TokenStorage } from './secure-store';

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const token = await TokenStorage.getAccessToken();

    socket = io(Config.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: token ? { token: `Bearer ${token}` } : undefined,
    });

    socket.on('connect_error', (err) => {
      // Soft log - socket failures should never crash the app
      if (__DEV__) {
        console.warn('[Socket] Connection warning:', err.message);
      }
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
