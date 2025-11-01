import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSessionStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(key);
}

export function setSessionStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, value);
}

export function getOrCreateUserId() {
  let user_id = getSessionStorage("user_id");

  if (user_id === null) {
    user_id = crypto.randomUUID();
    setSessionStorage("user_id", user_id);
  }

  return user_id;
}
