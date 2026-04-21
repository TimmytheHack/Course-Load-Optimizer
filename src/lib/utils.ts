import { Day, DAYS, StressLabel } from "@/lib/types";

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, precision = 1) {
  const power = 10 ** precision;
  return Math.round(value * power) / power;
}

export function formatHours(value: number) {
  const rounded = roundTo(value);
  return Number.isInteger(rounded) ? `${rounded.toFixed(0)}h` : `${rounded.toFixed(1)}h`;
}

export function formatTimeLabel(time: string) {
  const [hoursString, minutesString] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;
  return `${normalizedHour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function getStressTone(score: number): StressLabel {
  if (score <= 30) {
    return "light";
  }

  if (score <= 60) {
    return "balanced";
  }

  if (score <= 80) {
    return "intense";
  }

  return "overload risk";
}

export function orderDays(days: Day[]) {
  return [...days].sort((left, right) => DAYS.indexOf(left) - DAYS.indexOf(right));
}

export function formatDayList(days: Day[]) {
  return orderDays(days).join(" / ");
}

export function safeDateLabel(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}
