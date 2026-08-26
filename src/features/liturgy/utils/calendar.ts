import type { AppLanguage, EthiopianDate, LocalizedText } from "@/src/types/app";
import {
  getEthiopianFastForDate,
  getMovableFeastForDate,
  YEBEALAT_MAWECHA_2018_2041,
} from "@/src/features/liturgy/utils/yebealat-mawecha";

export {
  getEthiopianFastForDate,
  getMovableFeastForDate,
  YEBEALAT_MAWECHA_2018_2041,
};

const ETHIOPIAN_MONTHS: Record<AppLanguage, string[]> = {
  en: [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miazia",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehasse",
    "Pagume",
  ],
  am: ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"],
};

const WEEKDAYS: Record<AppLanguage, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  am: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"],
};

function isGregorianLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function ethiopianNewYear(gregorianYear: number) {
  return new Date(gregorianYear, 8, isGregorianLeapYear(gregorianYear + 1) ? 12 : 11);
}

function localMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function gregorianToEthiopian(date: Date): EthiopianDate {
  const localDate = localMidnight(date);
  const currentYearStart = ethiopianNewYear(localDate.getFullYear());
  const hasReachedNewYear = localDate.getTime() >= currentYearStart.getTime();
  const start = hasReachedNewYear ? currentYearStart : ethiopianNewYear(localDate.getFullYear() - 1);
  const year = hasReachedNewYear ? localDate.getFullYear() - 7 : localDate.getFullYear() - 8;
  const millisecondsPerDay = 86_400_000;
  const dayOfYear = Math.round((localDate.getTime() - start.getTime()) / millisecondsPerDay);
  return {
    year,
    month: Math.floor(dayOfYear / 30) + 1,
    day: (dayOfYear % 30) + 1,
  };
}

export function ethiopianToGregorian(date: EthiopianDate): Date {
  const newYearGregorian = date.year + 7;
  const start = ethiopianNewYear(newYearGregorian);
  const offset = (date.month - 1) * 30 + (date.day - 1);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
}

export function isLeapEthiopianYear(year: number): boolean {
  return year % 4 === 3;
}

export function daysInEthiopianMonth(year: number, month: number) {
  if (month < 13) return 30;
  return isLeapEthiopianYear(year) ? 6 : 5;
}

export function formatEthiopianDate(date: EthiopianDate, language: AppLanguage) {
  const monthName = ETHIOPIAN_MONTHS[language][date.month - 1];
  return language === "am" ? `${monthName} ${date.day} ቀን ${date.year} ዓ.ም.` : `${monthName} ${date.day}, ${date.year} E.C.`;
}

export function formatGregorianDate(date: Date, language: AppLanguage) {
  return new Intl.DateTimeFormat(language === "am" ? "am-ET" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function weekdayName(date: Date, language: AppLanguage) {
  return WEEKDAYS[language][date.getDay()];
}

export function isWeeklyFastDay(date: Date) {
  return date.getDay() === 3 || date.getDay() === 5;
}

export function isFastingDay(date: Date): { isFast: boolean; reason?: LocalizedText } {
  const ethDate = gregorianToEthiopian(date);
  const fast = getEthiopianFastForDate(ethDate);
  if (fast) {
    return { isFast: true, reason: fast.name };
  }
  if (isWeeklyFastDay(date)) {
    const cal = YEBEALAT_MAWECHA_2018_2041[ethDate.year];
    if (cal) {
      const tensaeVal = cal.tensae.month * 30 + cal.tensae.day;
      const peraqlitosVal = cal.peraqlitos.month * 30 + cal.peraqlitos.day;
      const currentVal = ethDate.month * 30 + ethDate.day;
      if (currentVal >= tensaeVal && currentVal <= peraqlitosVal) {
        return { isFast: false, reason: { am: "የትንሣኤ ሃምሳ ቀናት (ፍስክ)", en: "50 Days of Pentecost (Non-fasting)" } };
      }
    }
    return { isFast: true, reason: { am: "ሳምንታዊ ጾም (ረቡዕ/ዓርብ)", en: "Weekly Fast (Wed/Fri)" } };
  }
  return { isFast: false };
}

export function getDayObservance(date: Date): LocalizedText {
  const fastCheck = isFastingDay(date);
  if (fastCheck.isFast && fastCheck.reason) {
    return {
      en: `${fastCheck.reason.en} — observe according to parish tradition.`,
      am: `${fastCheck.reason.am} — በቤተ ክርስቲያን ሥርዓት መሠረት ይከበር።`,
    };
  }
  return {
    en: "A quiet day for prayer, reading, and reflection.",
    am: "ለጸሎት፣ ለንባብ እና ለማሰላሰል የተዘጋጀ ቀን።",
  };
}

export function getEthiopianMonths(language: AppLanguage) {
  return ETHIOPIAN_MONTHS[language];
}
