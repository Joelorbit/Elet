import type { AppLanguage } from "@/src/types/app";

/**
 * Calculates remaining duration string from current time to next alarm time
 */
export function calculateAlarmCountdown(
  targetHour24: number,
  targetMinute: number,
  language: AppLanguage = "am"
): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let targetMinutes = targetHour24 * 60 + targetMinute;

  let diff = targetMinutes - currentMinutes;
  if (diff <= 0) {
    diff += 24 * 60; // Next day
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (language === "am") {
    if (hours === 0) return `በ${minutes} ደቂቃ ውስጥ ይደውላል`;
    if (minutes === 0) return `በ${hours} ሰዓት ውስጥ ይደውላል`;
    return `በ${hours} ሰዓት ከ${minutes} ደቂቃ በኋላ ይደውላል`;
  }

  if (hours === 0) return `Rings in ${minutes} minutes`;
  if (minutes === 0) return `Rings in ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Rings in ${hours} hr ${minutes} min`;
}
