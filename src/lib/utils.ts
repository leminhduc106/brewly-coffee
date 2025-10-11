import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizePhoneNumber(input: string): string {
  if (!input) return "";
  // Preserve leading + then remove common separators
  const hasPlus = input.trim().startsWith("+");
  const digitsOnly = input.replace(/[\s\-()]/g, "").replace(/^\+/, "");
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

export function isValidPhoneNumber(input: string): boolean {
  const phone = sanitizePhoneNumber(input);
  if (!phone) return false;

  if (phone.startsWith("+")) {
    // E.164: Country code 1-9, followed by 7 to 14 more digits (total 8-15)
    return /^\+[1-9][0-9]{7,14}$/.test(phone);
  }

  // Local numbers: 9 to 15 digits
  return /^[0-9]{9,15}$/.test(phone);
}
