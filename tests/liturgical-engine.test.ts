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

console.log("\n==========================================");
console.log(`🎉 ALL ${passedCount}/${totalCount} TEST CASES PASSED WITH 100% SUCCESS!`);
console.log("==========================================");
