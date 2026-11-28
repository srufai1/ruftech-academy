import type { UnitMinutes } from "@ruftech-academy/shared/content-schema";

const hours = (minutes: number) => new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(minutes / 60);

export function unitEstimate(minutes: UnitMinutes): string {
  if (typeof minutes === "number") return `about ${hours(minutes)} ${minutes === 60 ? "hour" : "hours"}`;
  return `estimate ${hours(minutes.min)}–${hours(minutes.max)} hours`;
}

export function moduleEstimate(units: { minutes: UnitMinutes }[]): string {
  if (!units.length) return "";
  let min = 0;
  let max = 0;
  for (const { minutes } of units) {
    min += typeof minutes === "number" ? minutes : minutes.min;
    max += typeof minutes === "number" ? minutes : minutes.max;
  }
  return min === max ? unitEstimate(min) : unitEstimate({ min, max });
}
