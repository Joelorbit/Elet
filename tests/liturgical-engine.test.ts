import {
  daysInEthiopianMonth,
  ethiopianToGregorian,
  getEthiopianFastForDate,
  getEthiopianMonths,
  getMovableFeastForDate,
  gregorianToEthiopian,
  isFastingDay,
  isLeapEthiopianYear,
} from "../src/features/liturgy/utils/calendar";
import { YEBEALAT_MAWECHA_2018_2041 } from "../src/features/liturgy/utils/yebealat-mawecha";
import { getMonthlyCommemoration, getAnnualFeast } from "../src/features/liturgy/utils/monthly-commemorations";
import {
  CANONICAL_BOOKS,
  dailyBibleReferences,
  getRandomBibleVerse,
  getDailyBibleReference,
  type BibleCategory,
} from "../src/features/bible/utils/daily-bible";
import { calculatePracticeStreak, formatDateKey, getMonthHeatmapData } from "../src/features/streaks/utils/streaks";
import { translations } from "../src/shared/utils/i18n";

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string) {
  totalCount++;
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    throw new Error(`Test assertion failed: ${testName}`);
  }
  passedCount++;
}

console.log("==========================================");
console.log("🕊️ ELET LITURGICAL ENGINE & TEST SUITE");
console.log("==========================================");

// SUITE 1: 24-Year Bahire Hasab (2018–2041) Integrity (24 tests)
console.log("\n[Suite 1] 24-Year Bahire Hasab Mathematical Integrity (2018–2041)");
for (let year = 2018; year <= 2041; year++) {
  const data = YEBEALAT_MAWECHA_2018_2041[year];
  assert(data !== undefined, `Bahire Hasab table must exist for Ethiopian Year ${year}`);
  assert((data.abektie + data.metqie) % 30 === 0 || (data.abektie + data.metqie) === 30, `Abektie + Metqie sum rule for year ${year}`);
  assert(data.tsomeNenewe.month === 5 || data.tsomeNenewe.month === 6, `Tsome Nenewe month in Tir or Yekatit for year ${year}`);
  assert([7, 8, 9].includes(data.tensae.month), `Tensae (Easter) must be in Megabit, Miyazya, or Ginbot for year ${year}`);
  assert(data.peraqlitos.month === 9 || data.peraqlitos.month === 10, `Peraqlitos month in Ginbot or Sene for year ${year}`);
}

// SUITE 2: Ethiopian Calendar Roundtrip Conversions (30 tests)
console.log("\n[Suite 2] Ethiopian ⇄ Gregorian JDN Roundtrip Precision");
for (let m = 1; m <= 13; m++) {
  const maxD = m === 13 ? 5 : 30;
  const testDays = m === 13 ? [1, 3, maxD] : [1, 15, maxD];
  for (let d of testDays) {
    const eth = { year: 2018, month: m, day: d };
    const greg = ethiopianToGregorian(eth);
    const convertedEth = gregorianToEthiopian(greg);
    assert(
      convertedEth.year === eth.year && convertedEth.month === eth.month && convertedEth.day === eth.day,
      `Roundtrip match for Ethiopian ${eth.year}/${eth.month}/${eth.day} -> ${greg.toISOString()}`
    );
  }
}

// SUITE 3: Pagume Leap Year Checks (10 tests)
console.log("\n[Suite 3] Leap Year & Pagume Days Count");
for (let yr = 2015; yr <= 2025; yr++) {
  const isLeap = isLeapEthiopianYear(yr);
  const pagumeDays = daysInEthiopianMonth(yr, 13);
  if (isLeap) {
    assert(pagumeDays === 6, `Leap Year ${yr} Pagume must have 6 days`);
  } else {
    assert(pagumeDays === 5, `Non-Leap Year ${yr} Pagume must have 5 days`);
  }
}

// SUITE 4: 30 Monthly Tabot Saints & Annual Feasts (30 tests)
console.log("\n[Suite 4] 30 Monthly Tabot Commemorations");
for (let day = 1; day <= 30; day++) {
  const saint = getMonthlyCommemoration(day);
  assert(saint !== undefined && saint.title.am.length > 0 && saint.title.en.length > 0, `Bilingual titles for Tabot Day ${day}`);
}

// SUITE 5: 81-Canon Bible Catalog & Verses (20 tests)
console.log("\n[Suite 5] 81-Canon Biblical Scriptures & Deuterocanon");
assert(CANONICAL_BOOKS.length >= 30, "Canonical books array populated");
const enoch = CANONICAL_BOOKS.find((b) => b.id === "enoch");
assert(enoch !== undefined && enoch.chapters === 108, "Book of Enoch in Canon 81 with 108 chapters");
const jubilees = CANONICAL_BOOKS.find((b) => b.id === "jubilees");
assert(jubilees !== undefined && jubilees.chapters === 50, "Book of Jubilees in Canon 81 with 50 chapters");
const sirach = CANONICAL_BOOKS.find((b) => b.id === "sirach");
assert(sirach !== undefined && sirach.chapters === 51, "Book of Sirach in Canon 81 with 51 chapters");
assert(dailyBibleReferences.length >= 30, "Daily scripture references catalog expansive");

// SUITE 6: Streak & Heatmap Arithmetic (15 tests)
console.log("\n[Suite 6] Streak & Heatmap Arithmetic Engine");
const today = new Date("2026-08-26T12:00:00Z");
const sampleDates = [
  "2026-08-26",
  "2026-08-25",
  "2026-08-24",
  "2026-08-23",
  "2026-08-22",
];
const streak = calculatePracticeStreak(sampleDates, today);
assert(streak === 5, `Streak calculation: 5 consecutive days must equal 5 (got ${streak})`);

const brokenDates = ["2026-08-26", "2026-08-24"];
const brokenStreak = calculatePracticeStreak(brokenDates, today);
assert(brokenStreak === 1, `Broken streak must reset to 1 (got ${brokenStreak})`);

const emptyStreak = calculatePracticeStreak([], today);
assert(emptyStreak === 0, `Empty activity streak must equal 0`);

const heatmap = getMonthHeatmapData(today, sampleDates, [sampleDates]);
assert(heatmap.length === 30, `Month heatmap must return exactly 30 days`);
assert(heatmap[29].count >= 2, `Today's heatmap intensity reflected`);

// SUITE 7: Translations Parity (10 tests)
console.log("\n[Suite 7] Bilingual Translations Dictionary Parity");
const enKeys = Object.keys(translations.en);
const amKeys = Object.keys(translations.am);
assert(enKeys.length === amKeys.length, `English & Amharic key counts match (${enKeys.length} vs ${amKeys.length})`);
for (const key of enKeys) {
  assert((translations.am as any)[key] !== undefined, `Amharic translation exists for key: ${key}`);
}

// SUITE 8: 81-Canon Random Verse Entropy & Category Distribution (25 tests)
console.log("\n[Suite 8] 81-Canon Random Verse Entropy & Non-Repetition");
const categoriesToTest: BibleCategory[] = ["all", "gospels", "canon81", "wisdom", "prophets", "epistles", "torah"];
for (const cat of categoriesToTest) {
  const v1 = getRandomBibleVerse("am", cat);
  const v2 = getRandomBibleVerse("am", cat);
  assert(v1.verseText.length > 0 && v1.referenceText.length > 0, `Valid verse generated for category: ${cat}`);
  assert(v2.verseText.length > 0 && v2.referenceText.length > 0, `Consecutive valid verse for category: ${cat}`);
  if (cat !== "all") {
    const item = dailyBibleReferences.find((r) => r.reference.am === v1.reference.am || r.reference.en === v1.reference.en);
    assert(item !== undefined && item.category === cat, `Category filter accuracy for ${cat}`);
  }
}

// Check non-consecutive variety over 20 random rolls
let previousRef = "";
let duplicateConsecutiveCount = 0;
for (let i = 0; i < 20; i++) {
  const verse = getRandomBibleVerse("en");
  if (verse.reference.en === previousRef) {
    duplicateConsecutiveCount++;
  }
  previousRef = verse.reference.en;
}
assert(duplicateConsecutiveCount === 0, "Zero consecutive duplicate verses in 20 random rolls");

// SUITE 9: Major & Minor Annual Orthodox Feasts Verification
console.log("\n[Suite 9] Annual Orthodox Feasts & Saint Commemorations");
const hamle7 = getAnnualFeast(11, 7);
assert(hamle7 !== undefined && hamle7.title.am.includes("ሥላሴ"), "Hamle 7 is Annual Holy Trinity (ሐምሌ ሥላሴ)");
assert(hamle7 !== undefined && hamle7.title.en.includes("Trinity"), "Hamle 7 English title contains Trinity");

const nehase13 = getAnnualFeast(12, 13);
assert(nehase13 !== undefined && (nehase13.title.am.includes("ደብረ ታቦር") || nehase13.title.am.includes("ቡሄ")), "Nehase 13 is Debre Tabor / Buhe (ደብረ ታቦር / ቡሄ)");

const hidar12 = getAnnualFeast(3, 12);
assert(hidar12 !== undefined && hidar12.title.am.includes("ሚካኤል"), "Hidar 12 is Annual Archangel Michael (ኅዳር ሚካኤል)");

const sene12 = getAnnualFeast(10, 12);
assert(sene12 !== undefined && sene12.title.am.includes("ሚካኤል"), "Sene 12 is Annual Archangel Michael (ሰኔ ሚካኤል)");

const ginbot12 = getAnnualFeast(9, 12);
assert(ginbot12 !== undefined && ginbot12.title.am.includes("ሚካኤል"), "Ginbot 12 is Annual Archangel Michael (ግንቦት ሚካኤል)");

const tir12 = getAnnualFeast(5, 12);
assert(tir12 !== undefined && tir12.title.am.includes("ቃና ዘገሊላ"), "Tir 12 is Cana of Galilee / Tir Michael");

const tahsas19 = getAnnualFeast(4, 19);
assert(tahsas19 !== undefined && tahsas19.title.am.includes("ገብርኤል"), "Tahsas 19 is Kulubi Saint Gabriel (ታኅሣሥ ገብርኤል)");

const megabit10 = getAnnualFeast(7, 10);
assert(megabit10 !== undefined && megabit10.title.am.includes("መስቀል"), "Megabit 10 is Manifestation of the Holy Cross (መገለጸ መስቀል)");

// SUITE 10: 2018–2041 Exact Canonical Benchmark Calculations
console.log("\n[Suite 10] 2018–2041 Exact Canonical Benchmark Dates");
// 2018 E.C. (Mark): Tir 25 Nenewe, Miyazya 4 Tensae
const b2018 = YEBEALAT_MAWECHA_2018_2041[2018];
assert(b2018.evangelist.am === "ማርቆስ", "2018 Evangelist is Mark (ማርቆስ)");
assert(b2018.newYearDay.am === "ሐሙስ", "2018 New Year starts on Thursday (ሐሙስ)");
assert(b2018.tsomeNenewe.month === 5 && b2018.tsomeNenewe.day === 25, "2018 Tsome Nenewe is Tir 25 (ጥር 25)");
assert(b2018.abiyTsome.month === 6 && b2018.abiyTsome.day === 9, "2018 Abiy Tsome is Yekatit 9 (የካቲት 9)");
assert(b2018.tensae.month === 8 && b2018.tensae.day === 4, "2018 Tensae is Miyazya 4 (ሚያዝያ 4)");

// 2019 E.C. (Luke): Yekatit 15 Nenewe, Miyazya 24 Tensae
const b2019 = YEBEALAT_MAWECHA_2018_2041[2019];
assert(b2019.evangelist.am === "ሉቃስ", "2019 Evangelist is Luke (ሉቃስ)");
assert(b2019.newYearDay.am === "ዓርብ", "2019 New Year starts on Friday (ዓርብ)");
assert(b2019.tsomeNenewe.month === 6 && b2019.tsomeNenewe.day === 15, "2019 Tsome Nenewe is Yekatit 15 (የካቲት 15)");
assert(b2019.tensae.month === 8 && b2019.tensae.day === 24, "2019 Tensae is Miyazya 24 (ሚያዝያ 24)");

// 2020 E.C. (John - Leap): Tir 29 Nenewe, Miyazya 8 Tensae
const b2020 = YEBEALAT_MAWECHA_2018_2041[2020];
assert(b2020.evangelist.am === "ዮሐንስ", "2020 Evangelist is John (ዮሐንስ)");
assert(b2020.newYearDay.am === "እሑድ", "2020 New Year starts on Sunday (እሑድ)");
assert(b2020.tsomeNenewe.month === 5 && b2020.tsomeNenewe.day === 29, "2020 Tsome Nenewe is Tir 29 (ጥር 29)");
assert(b2020.tensae.month === 8 && b2020.tensae.day === 8, "2020 Tensae is Miyazya 8 (ሚያዝያ 8)");

// 2041 E.C. (Matthew): Yekatit 8 Nenewe, Miyazya 17 Tensae
const b2041 = YEBEALAT_MAWECHA_2018_2041[2041];
assert(b2041.evangelist.am === "ማቴዎስ", "2041 Evangelist is Matthew (ማቴዎስ)");
assert(b2041.newYearDay.am === "ዓርብ", "2041 New Year starts on Friday (ዓርብ)");
assert(b2041.tsomeNenewe.month === 6 && b2041.tsomeNenewe.day === 8, "2041 Tsome Nenewe is Yekatit 8 (የካቲት 8)");
assert(b2041.tensae.month === 8 && b2041.tensae.day === 17, "2041 Tensae is Miyazya 17 (ሚያዝያ 17)");

// SUITE 11: 3D Roller Time Picker & Dynamic Alarm Countdown Logic
console.log("\n[Suite 11] 3D Roller Time Picker & Alarm Countdown Arithmetic");
import { calculateAlarmCountdown } from "../src/shared/utils/alarm-countdown";

const countdownAm = calculateAlarmCountdown(12, 0, "am");
assert(typeof countdownAm === "string" && countdownAm.length > 0, "Amharic alarm countdown string is valid");

const countdownEn = calculateAlarmCountdown(15, 30, "en");
assert(typeof countdownEn === "string" && countdownEn.length > 0, "English alarm countdown string is valid");

assert(countdownEn.includes("Ring") || countdownEn.includes("min") || countdownEn.includes("hour"), "English countdown contains expected time keywords");
assert(countdownAm.includes("ይደውላል") || countdownAm.includes("ሰዓት") || countdownAm.includes("ደቂቃ"), "Amharic countdown contains expected Geez/Amharic time keywords");

console.log("\n==========================================");
console.log(`🎉 ALL ${passedCount}/${totalCount} TEST CASES PASSED WITH 100% SUCCESS!`);
console.log("==========================================");


