import axios, { InternalAxiosRequestConfig } from 'axios';
import { Config } from './config';
import { TokenStorage } from './secure-store';

export const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

type UnauthorizedCallback = () => void;
let onUnauthorizedCallback: UnauthorizedCallback | null = null;

export function setOnUnauthorized(callback: UnauthorizedCallback | null) {
  onUnauthorizedCallback = callback;
}

function notifyUnauthorized() {
  if (onUnauthorizedCallback) {
    try {
      onUnauthorizedCallback();
    } catch {
      // Safe no-op to protect interceptor pipeline
    }
  }
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

// Request Interceptor: Attach Bearer token (and await in-flight refresh if active)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If a token refresh is currently underway, await it so this request gets the fresh token
    if (refreshPromise) {
      try {
        await refreshPromise;
      } catch {
        // Handled downstream
      }
    }

    let token = inMemoryAccessToken;
    if (!token) {
      token = await TokenStorage.getAccessToken();
      if (token) {
        inMemoryAccessToken = token;
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & token refresh with singleton concurrency queue
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest?.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      // Ensure only ONE refresh request is in-flight across all concurrent 401s
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const storedRefreshToken = await TokenStorage.getRefreshToken();
            if (!storedRefreshToken) {
              throw new Error('No refresh token available');
            }

            const { data } = await axios.post(
              `${Config.API_URL}/auth/refresh`,
              { refreshToken: storedRefreshToken },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
              }
            );

            const newAccessToken = data?.data?.accessToken;
            if (newAccessToken) {
              setAccessToken(newAccessToken);
              await TokenStorage.setAccessToken(newAccessToken);
              return newAccessToken;
            }
            throw new Error('Missing accessToken in refresh response');
          } catch (refreshError) {
            setAccessToken(null);
            await TokenStorage.clearAll();
            notifyUnauthorized();
            throw refreshError;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newAccessToken = await refreshPromise;
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
