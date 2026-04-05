import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateShort(dateString: string, locale: string = "en-GB") {
  const targetLocale = locale === "de" ? "de-DE" : locale;
  return new Date(dateString).toLocaleDateString(targetLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
