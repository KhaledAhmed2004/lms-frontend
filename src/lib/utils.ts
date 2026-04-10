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

export function getFileUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';
  const sanitizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const sanitizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${sanitizedBase}${sanitizedPath}`;
}
