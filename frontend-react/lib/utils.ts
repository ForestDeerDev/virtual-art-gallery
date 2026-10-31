export { cn, type ClassValue } from "cn"

export function formatDate(dateString: string): string {
  return dateString.slice(0, 16).replace("T", " ")
}
