import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  // Strip control characters, excessive whitespace, and basic script injection tags
  return text
    .replace(/<[^>]*>?/gm, "")
    .trim();
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(dateString);
  }
}
