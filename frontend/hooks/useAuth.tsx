"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, tokenStore } from "@/lib/api";
import { decodeJwt, isExpired } from "@/lib/jwt";
import { mock } from "@/lib/mock";
import type { LoginPayload, RegisterPayload, Role, User } from "@/lib/types";

type AuthState = {
  user: User | null;
  ready: boolean; // hydration done
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function deriveUserFromToken(token: string): User | null {
  const payload = decodeJwt(token);
  if (!payload || isExpired(payload)) return null;
  return {
    id: 0,
    email: payload.sub ?? "unknown",
    full_name: payload.sub?.split("@")[0] ?? "User",
    role: (payload.role ?? "voter") as Role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const token = tokenStore.get();
    if (token) {
      const u = deriveUserFromToken(token);
      if (u) setUser(u);
      else tokenStore.clear();
    }
    setReady(true);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await api.login(payload);
    tokenStore.set(res.access_token);
    const u = deriveUserFromToken(res.access_token);
    if (!u) throw new Error("Invalid token from server");
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.register(payload);
    // Mirror the registration into the in-memory user list so admins see the
    // account immediately. Replace this once a real GET /users endpoint exists.
    mock.registerLocalUser({
      full_name: payload.full_name,
      email: payload.email,
      role: payload.role,
    });
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthState>(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Client-side route guard. Renders nothing until auth state is hydrated, then:
 *  - If not logged in: redirects to /login.
 *  - If `roles` is provided and user role is excluded: redirects to /dashboard.
 */
export function useRequireAuth(roles?: Role[]) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, ready, roles, router]);

  return { user, ready };
}
