import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns the public base URL of the app for auth redirects.
// Prefers an explicit NEXT_PUBLIC_SITE_URL if provided; falls back to window.origin in the browser.
export function getPublicBaseUrl(): string {
  if (typeof process !== "undefined") {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (envUrl && envUrl.length > 0) return envUrl.replace(/\/$/, "")
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin
  }
  // Default to Netlify style preview env var if present, otherwise localhost as a safe fallback
  const netlifyUrl = process.env.URL || process.env.DEPLOY_URL
  if (netlifyUrl) return netlifyUrl.replace(/\/$/, "")
  return "http://localhost:3000"
}
