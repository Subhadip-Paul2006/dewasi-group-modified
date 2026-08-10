"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthUser } from "@doctor-contract/shared";
import { api, setAccessToken } from "./api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const refreshRes = await api.post("/auth/refresh");
      setAccessToken(refreshRes.data.data.accessToken);
      const meRes = await api.get("/auth/me");
      setUserState(meRes.data.data.user);
    } catch {
      setAccessToken(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore -- local state is cleared regardless
    }
    setAccessToken(null);
    setUserState(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser: setUserState, logout, refetchUser: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
