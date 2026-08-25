import { gregorianToEthiopian } from "@/src/features/liturgy/utils/calendar";
import type { AppLanguage, LocalizedText } from "@/src/types/app";

export type BibleCategory =
  | "all"
  | "gospels"
  | "wisdom"
  | "prophets"
  | "epistles"
  | "canon81"
  | "torah";

export interface CanonicalBook {
  id: string;
  category: BibleCategory;
  name: LocalizedText;
  chapters: number;
}

export interface DailyBibleReference {
  id: string;
  category: BibleCategory;
  bookId: string;
  reference: LocalizedText;
  focus: LocalizedText;
  text: LocalizedText;
}

/**
 * 81 Canonical Books of the Ethiopian Orthodox Tewahedo Church
 */
export const CANONICAL_BOOKS: CanonicalBook[] = [
  { id: "matthew", category: "gospels", name: { am: "የማቴዎስ ወንጌል", en: "Matthew" }, chapters: 28 },
  { id: "mark", category: "gospels", name: { am: "የማርቆስ ወንጌል", en: "Mark" }, chapters: 16 },
  { id: "luke", category: "gospels", name: { am: "የሉቃስ ወንጌል", en: "Luke" }, chapters: 24 },
  { id: "john", category: "gospels", name: { am: "የዮሐንስ ወንጌል", en: "John" }, chapters: 21 },
  { id: "psalms", category: "wisdom", name: { am: "መዝሙረ ዳዊት", en: "Psalms" }, chapters: 150 },
  { id: "proverbs", category: "wisdom", name: { am: "መጽሐፈ ምሳሌ", en: "Proverbs" }, chapters: 31 },
  { id: "wisdom", category: "canon81", name: { am: "መጽሐፈ ጥበብ", en: "Wisdom of Solomon" }, chapters: 19 },
  { id: "sirach", category: "canon81", name: { am: "መጽሐፈ ሲራክ", en: "Sirach" }, chapters: 51 },
  { id: "enoch", category: "canon81", name: { am: "መጽሐፈ ሄኖክ", en: "Book of Enoch" }, chapters: 108 },
  { id: "jubilees", category: "canon81", name: { am: "መጽሐፈ ኩፋሌ", en: "Book of Jubilees" }, chapters: 50 },
  { id: "tobit", category: "canon81", name: { am: "መጽሐፈ ጦቢት", en: "Tobit" }, chapters: 14 },
  { id: "genesis", category: "torah", name: { am: "ኦሪት ዘፍጥረት", en: "Genesis" }, chapters: 50 },
  { id: "isaiah", category: "prophets", name: { am: "ትንቢተ ኢሳይያስ", en: "Isaiah" }, chapters: 66 },
  { id: "romans", category: "epistles", name: { am: "ወደ ሮሜ ሰዎች", en: "Romans" }, chapters: 16 },
  { id: "1-thessalonians", category: "epistles", name: { am: "1ኛ ወደ ተሰሎንቄ ሰዎች", en: "1 Thessalonians" }, chapters: 5 },
];

export const dailyBibleReferences: DailyBibleReference[] = [
  {
    id: "gosp-matt-5-14",
    category: "gospels",
    bookId: "matthew",
    reference: { en: "Matthew 5:14", am: "የማቴዎስ ወንጌል 5፥14" },
    focus: { en: "Light of the World", am: "የዓለም ብርሃን" },
    text: {
      en: "Ye are the light of the world. A city that is set on an hill cannot be hid.",
      am: "እናንተ የዓለም ብርሃን ናችሁ፤ በተራራ ላይ ያለች ከተማ ልትሰወር አይቻላትም።",
    },
  },
  {
    id: "gosp-matt-6-33",
    category: "gospels",
    bookId: "matthew",
    reference: { en: "Matthew 6:33", am: "የማቴዎስ ወንጌል 6፥33" },
    focus: { en: "The Kingdom First", am: "የእግዚአብሔርን መንግሥት ማስቀደም" },
    text: {
      en: "Seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      am: "አስቀድማችሁ የእግዚአብሔርን መንግሥት ጽድቁንም ፈልጉ፥ ይህም ሁሉ ይጨመርላችኋል።",
    },
  },
  {
    id: "gosp-matt-11-28",
    category: "gospels",
    bookId: "matthew",
    reference: { en: "Matthew 11:28", am: "የማቴዎስ ወንጌል 11፥28" },
    focus: { en: "Rest in Christ", am: "የደከማችሁ ወደ እኔ ኑ" },
    text: {
      en: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
      am: "እናንተ ደካሞች ሸክማችሁ የከበደ ሁሉ፥ ወደ እኔ ኑ፥ እኔም አሳርፋችኋለሁ።",
    },
  },
  {
    id: "gosp-john-1-1",
    category: "gospels",
    bookId: "john",
    reference: { en: "John 1:1", am: "የዮሐንስ ወንጌል 1፥1" },
    focus: { en: "The Eternal Word", am: "የሕይወት ቃል" },
    text: {
      en: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      am: "በመጀመሪያ ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ።",
    },
  },
  {
    id: "gosp-john-14-6",
    category: "gospels",
    bookId: "john",
    reference: { en: "John 14:6", am: "የዮሐንስ ወንጌል 14፥6" },
    focus: { en: "Way, Truth, Life", am: "መንገድ፣ እውነት፣ ሕይወት" },
    text: {
      en: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
      am: "ኢየሱስም፦ እኔ መንገድና እውነት ሕይወትም ነኝ፤ በእኔ በቀር ወደ አብ የሚመጣ የለም አለው።",
    },
  },
  {
    id: "canon-enoch-1-9",
    category: "canon81",
    bookId: "enoch",
    reference: { en: "Enoch 1:9", am: "መጽሐፈ ሄኖክ 1፥9" },
    focus: { en: "The Lord's Coming with Ten Thousands of Saints", am: "የጌታ መምጣት ከአእላፋት ቅዱሳን ጋር" },
    text: {
      en: "Behold, He cometh with ten thousands of His holy ones to execute judgment upon all.",
      am: "እነሆ፥ ጌታ በሁሉ ላይ ፍርድን ሊያደርግ ከአእላፋት ቅዱሳኑ ጋር መጥቷል።",
    },
  },
  {
    id: "canon-jubilees-1-29",
    category: "canon81",
    bookId: "jubilees",
    reference: { en: "Jubilees 1:29", am: "መጽሐፈ ኩፋሌ 1፥29" },
    focus: { en: "Sanctuary of Eternity", am: "የዘላለም መቅደስ" },
    text: {
      en: "The Lord shall build His sanctuary in their midst, and dwell with them forever and ever.",
      am: "እግዚአብሔር መቅደሱን በመካከላቸው ይሠራል፥ ከእነርሱም ጋር ለዘላለም ይኖራል።",
    },
  },
  {
    id: "canon-wisdom-3-1",
    category: "canon81",
    bookId: "wisdom",
    reference: { en: "Wisdom of Solomon 3:1", am: "መጽሐፈ ጥበብ 3፥1" },
    focus: { en: "Souls of the Righteous", am: "የጻድቃን ነፍሳት በእግዚአብሔር እጅ" },
    text: {
      en: "The souls of the righteous are in the hand of God, and there shall no torment touch them.",
      am: "የጻድቃን ነፍሳት ግን በእግዚአብሔር እጅ ናቸው፥ ሥቃይም አያገኛቸውም።",
    },
  },
  {
    id: "canon-sirach-2-1",
    category: "canon81",
    bookId: "sirach",
    reference: { en: "Sirach 2:1", am: "መጽሐፈ ሲራክ 2፥1" },
    focus: { en: "Preparing the Soul for Service", am: "ለፈተና መዘጋጀት" },
    text: {
      en: "My son, if thou come to serve the Lord, prepare thy soul for temptation.",
      am: "ልጄ ሆይ፥ እግዚአብሔርን ለማገልገል ብትመጣ ሰውነትህን ለፈተና አዘጋጅ።",
    },
  },
  {
    id: "wisd-psalm-23-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { en: "Psalm 23:1", am: "መዝሙረ ዳዊት 23፥1" },
    focus: { en: "The Good Shepherd", am: "እግዚአብሔር እረኛዬ ነው" },
    text: {
      en: "The LORD is my shepherd; I shall not want.",
      am: "እግዚአብሔር እረኛዬ ነው፥ የሚያሳጣኝም የለም።",
    },
  },
  {
    id: "wisd-psalm-91-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { en: "Psalm 91:1", am: "መዝሙረ ዳዊት 91፥1" },
    focus: { en: "Under the Shadow of the Almighty", am: "በልዑል መጠጊያ" },
    text: {
      en: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
      am: "በልዑል መጠጊያ የሚኖር ሁሉን በሚችል አምላክ ጥላ ውስጥ ያድራል።",
    },
  },
  {
    id: "prop-isa-40-31",
    category: "prophets",
    bookId: "isaiah",
    reference: { en: "Isaiah 40:31", am: "ትንቢተ ኢሳይያስ 40፥31" },
    focus: { en: "Renewed Wings as Eagles", am: "ኃይልን ማደስ እንደ ንስር" },
    text: {
      en: "They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.",
      am: "እግዚአብሔርን በመተማመን የሚጠባበቁ ግን ኃይላቸውን ያድሳሉ፤ እንደ ንስር በክንፍ ይወጣሉ።",
    },
  },
  {
    id: "epis-phil-4-13",
    category: "epistles",
    bookId: "philippians",
    reference: { en: "Philippians 4:13", am: "ወደ ፊልጵስዩስ 4፥13" },
    focus: { en: "Strength in Christ", am: "በክርስቶስ ሁሉን እችላለሁ" },
    text: {
      en: "I can do all things through Christ which strengtheneth me.",
      am: "ኃይልን በሚሰጠኝ በክርስቶስ ሁሉን እችላለሁ።",
    },
  },
  {
    id: "epis-1thess-5-16",
    category: "epistles",
    bookId: "1-thessalonians",
    reference: { en: "1 Thessalonians 5:16–18", am: "1ኛ ወደ ተሰሎንቄ ሰዎች 5፥16-18" },
    focus: { en: "Pray Without Ceasing", am: "ሳታቋርጡ ጸልዩ" },
    text: {
      en: "Rejoice evermore. Pray without ceasing. In every thing give thanks.",
      am: "ሁልጊዜ ደስ ይበላችሁ፤ ሳታቋርጡ ጸልዩ፤ በሁሉ አመስግኑ።",
    },
  },
];

export function getDailyBibleReference(date: Date, language: AppLanguage, offset = 0) {
  const ethDate = gregorianToEthiopian(date);
  const dayIndex = (ethDate.year * 365 + ethDate.month * 30 + ethDate.day + offset) % dailyBibleReferences.length;
  const selected = dailyBibleReferences[Math.abs(dayIndex)];
  return {
    ...selected,
    referenceText: selected.reference[language] || selected.reference.en,
    focusText: selected.focus[language] || selected.focus.en,
    verseText: selected.text[language] || selected.text.en,
  };
}

export function getRandomBibleVerse(language: AppLanguage, category: BibleCategory = "all") {
  const pool = category === "all"
    ? dailyBibleReferences
    : dailyBibleReferences.filter((v) => v.category === category);
  const finalPool = pool.length > 0 ? pool : dailyBibleReferences;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  const selected = finalPool[randomIndex];
  return {
    ...selected,
    referenceText: selected.reference[language] || selected.reference.en,
    focusText: selected.focus[language] || selected.focus.en,
    verseText: selected.text[language] || selected.text.en,
  };
}
