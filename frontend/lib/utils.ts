import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// N1 / N2 codes: alphanumeric, 8–24 chars in our demo. Adjust as backend evolves.
const CODE_RE = /^[A-Za-z0-9]{8,24}$/;

export function isValidCode(value: string): boolean {
  return CODE_RE.test(value.trim());
}

export function maskCode(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "•".repeat(value.length);
  return `${value.slice(0, 2)}${"•".repeat(value.length - 4)}${value.slice(-2)}`;
}
