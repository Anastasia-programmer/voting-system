// Minimal base64url JWT payload decoder. We don't verify the signature on the
// client (the server is the source of truth), we just need `sub` and `role`
// for routing & UI display.

import type { Role } from "./types";

export type JwtPayload = {
  sub?: string;
  role?: Role;
  exp?: number;
  [k: string]: unknown;
};

function base64UrlDecode(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "=".repeat(4 - pad);
  if (typeof atob === "function") return atob(s);
  return Buffer.from(s, "base64").toString("binary");
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = decodeURIComponent(
      Array.from(base64UrlDecode(payload))
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return Date.now() / 1000 > payload.exp;
}
