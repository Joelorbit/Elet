import { gregorianToEthiopian } from "@/src/features/liturgy/utils/calendar";
import type { EthiopianDate } from "@/src/types/app";

export interface HeatmapDay {
  date: Date;
  dateKey: string;
  ethiopianDate: EthiopianDate;
  count: number;
  intensity: 0 | 1 | 2 | 3;
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function calculatePracticeStreak(activityDates: string[], today: Date): number {
  if (!activityDates || activityDates.length === 0) return 0;
  const sorted = Array.from(new Set(activityDates)).sort().reverse();
  const todayKey = formatDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  if (!sorted.includes(todayKey) && !sorted.includes(yesterdayKey)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(sorted.includes(todayKey) ? today : yesterday);

  while (true) {
    const key = formatDateKey(checkDate);
    if (sorted.includes(key)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function dailyPracticeProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, completed / total));
}

export function getMonthHeatmapData(
  centerDate: Date,
  activityDates: string[],
  prayerCompletedDates: string[][] = []
): HeatmapDay[] {
  const result: HeatmapDay[] = [];
  const daysInMonth = 30; // Ethiopian standard liturgical month view (30 days)

  for (let i = 29; i >= 0; i--) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() - i);
    const key = formatDateKey(d);

    let count = activityDates.filter((k) => k === key).length;
    for (const prayerDates of prayerCompletedDates) {
      if (prayerDates.includes(key)) count += 1;
    }

    let intensity: 0 | 1 | 2 | 3 = 0;
    if (count >= 4) intensity = 3;
    else if (count >= 2) intensity = 2;
    else if (count >= 1) intensity = 1;

    result.push({
      date: d,
      dateKey: key,
      ethiopianDate: gregorianToEthiopian(d),
      count,
      intensity,
    });
  }

  return result;
}

export function getYearHeatmapData(
  centerDate: Date,
  activityDates: string[],
  prayerCompletedDates: string[][] = []
): HeatmapDay[][] {
  const weeks: HeatmapDay[][] = [];
  const totalDays = 52 * 7;

  let currentWeek: HeatmapDay[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() - i);
    const key = formatDateKey(d);

    let count = activityDates.filter((k) => k === key).length;
    for (const prayerDates of prayerCompletedDates) {
      if (prayerDates.includes(key)) count += 1;
    }

    let intensity: 0 | 1 | 2 | 3 = 0;
    if (count >= 4) intensity = 3;
    else if (count >= 2) intensity = 2;
    else if (count >= 1) intensity = 1;

    currentWeek.push({
      date: d,
      dateKey: key,
      ethiopianDate: gregorianToEthiopian(d),
      count,
      intensity,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}
