import type { LocalizedText, NoteCategory } from "@/src/types/app";

export interface DailyReadingItem {
  id: string;
  day: number;
  reference: string;
  title: LocalizedText;
  theme: LocalizedText;
}

export const dailyReadings: DailyReadingItem[] = [
  {
    id: "read-1",
    day: 1,
    reference: "Matthew 5:1–16",
    title: { am: "ስብከተ ተራራ — አንቀጸ ብጹዓን", en: "Sermon on the Mount — Beatitudes" },
    theme: { am: "የመንፈሳዊ ሕይወት መሠረት", en: "Foundations of Spiritual Life" },
  },
  {
    id: "read-2",
    day: 2,
    reference: "John 15:1–17",
    title: { am: "እውነተኛው የወይን ግንድ", en: "The True Vine and Branches" },
    theme: { am: "በክርስቶስ መኖርና ፍሬ ማፍራት", en: "Abiding in Christ and Bearing Fruit" },
  },
  {
    id: "read-3",
    day: 3,
    reference: "Psalm 91:1–16",
    title: { am: "በልዑል መጠጊያ መኖር", en: "Dwelling in the Secret Place" },
    theme: { am: "መለኮታዊ ጥበቃና መታመን", en: "Divine Protection and Faith" },
  },
  {
    id: "read-4",
    day: 4,
    reference: "Romans 8:14–39",
    title: { am: "የእግዚአብሔር ልጆች ሕይወት", en: "Life in the Spirit" },
    theme: { am: "በፍቅሩ አሸናፊዎች መሆን", en: "More Than Conquerors in Love" },
  },
  {
    id: "read-5",
    day: 5,
    reference: "James 1:1–27",
    title: { am: "የእምነት ፈተናና ትዕግሥት", en: "Testing of Faith and Works" },
    theme: { am: "ቃሉን ሰሚ ብቻ ሳይሆን አድራጊ መሆን", en: "Doers of the Word" },
  },
  {
    id: "read-6",
    day: 6,
    reference: "Sirach 2:1–18",
    title: { am: "ለፈተና መዘጋጀትና መታመን", en: "Duties under Trial and Trust" },
    theme: { am: "ጥበብና ታማኝነት በፈተና ወቅት", en: "Endurance and Confidence in God" },
  },
  {
    id: "read-7",
    day: 7,
    reference: "1 Corinthians 13:1–13",
    title: { am: "የፍቅር የበላይነት", en: "The Greatest of These is Love" },
    theme: { am: "የመንፈሳዊ ሕይወት ጣሪያ ፍቅር ነው", en: "The Crown of Virtues" },
  },
];

export function getDailyReading(day: number): DailyReadingItem {
  const index = Math.abs((day - 1) % dailyReadings.length);
  return dailyReadings[index];
}

export const noteCategoryLabels: Record<NoteCategory, LocalizedText> = {
  sermon: { am: "ስብከት", en: "Sermon" },
  prayer: { am: "ጸሎት", en: "Prayer" },
  verse: { am: "ጥቅስ", en: "Verse" },
  priest: { am: "የነፍስ አባት ምክር", en: "Spiritual Father" },
  gratitude: { am: "ምስጋና", en: "Gratitude" },
  reflection: { am: "ማሰላሰል", en: "Reflection" },
  confession: { am: "ለንስሐ ዝግጅት", en: "Confession Prep" },
  service: { am: "አገልግሎት", en: "Church Service" },
};

export interface ConfessionPrompt {
  id: string;
  category: "god" | "neighbor" | "self";
  text: LocalizedText;
}

export const confessionPrompts: ConfessionPrompt[] = [
  {
    id: "p1",
    category: "god",
    text: {
      am: "የጸሎትና የጾም ጊዜዬን በአግባቡ ተጠቅሜያለሁ?",
      en: "Have I been faithful in prayer, fasting, and honoring God?",
    },
  },
  {
    id: "p2",
    category: "neighbor",
    text: {
      am: "በልቤ ያቆየሁት ቂም፣ ቁጣ ወይም ይቅር ያላልኩት ሰው አለ?",
      en: "Do I harbor resentment, bitterness, or an unwillingness to forgive?",
    },
  },
  {
    id: "p3",
    category: "neighbor",
    text: {
      am: "በንግግሬ ሰው አስከፍቻለሁ ወይስ ሐሜት ተናግሬያለሁ?",
      en: "Have I hurt anyone through harsh words, gossip, or uncharitable speech?",
    },
  },
  {
    id: "p4",
    category: "self",
    text: {
      am: "ልቤን በትዕቢት፣ በስግብግብነት ወይም በጭንቀት ሞልቼዋለሁ?",
      en: "Have I given in to pride, excessive material worry, or selfishness?",
    },
  },
];
