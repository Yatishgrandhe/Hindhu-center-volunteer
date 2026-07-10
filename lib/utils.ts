export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function formatTimeRange(startIso: string, endIso: string): string {
  const sameDay =
    new Date(startIso).toDateString() === new Date(endIso).toDateString();
  if (sameDay) {
    return `${formatDate(startIso)} · ${formatTime(startIso)} – ${formatTime(endIso)}`;
  }
  return `${formatDateTime(startIso)} → ${formatDateTime(endIso)}`;
}

export function formatHours(n: number): string {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function ageFromDob(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function isMinor(dob: string | null): boolean {
  const age = ageFromDob(dob);
  return age !== null && age < 18;
}

/** Format an ISO timestamp into a value usable by <input type="datetime-local">. */
export function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function initials(name: string | null | undefined): string {
  if (!name) return "❤";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}
