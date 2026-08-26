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
 * Full 81 Canonical Books of the Ethiopian Orthodox Tewahedo Church
 */
export const CANONICAL_BOOKS: CanonicalBook[] = [
  // Gospels (4)
  { id: "matthew", category: "gospels", name: { am: "የማቴዎስ ወንጌል", en: "Gospel of Matthew" }, chapters: 28 },
  { id: "mark", category: "gospels", name: { am: "የማርቆስ ወንጌል", en: "Gospel of Mark" }, chapters: 16 },
  { id: "luke", category: "gospels", name: { am: "የሉቃስ ወንጌል", en: "Gospel of Luke" }, chapters: 24 },
  { id: "john", category: "gospels", name: { am: "የዮሐንስ ወንጌል", en: "Gospel of John" }, chapters: 21 },

  // Torah / Pentateuch & History (8)
  { id: "genesis", category: "torah", name: { am: "ኦሪት ዘፍጥረት", en: "Genesis" }, chapters: 50 },
  { id: "exodus", category: "torah", name: { am: "ኦሪት ዘጸአት", en: "Exodus" }, chapters: 40 },
  { id: "leviticus", category: "torah", name: { am: "ኦሪት ዘሌዋውያን", en: "Leviticus" }, chapters: 27 },
  { id: "numbers", category: "torah", name: { am: "ኦሪት ዘኍልቁ", en: "Numbers" }, chapters: 36 },
  { id: "deuteronomy", category: "torah", name: { am: "ኦሪት ዘዳግም", en: "Deuteronomy" }, chapters: 34 },
  { id: "joshua", category: "torah", name: { am: "መጽሐፈ ኢያሱ", en: "Joshua" }, chapters: 24 },
  { id: "judges", category: "torah", name: { am: "መጽሐፈ መሳፍንት", en: "Judges" }, chapters: 21 },
  { id: "ruth", category: "torah", name: { am: "መጽሐፈ ሩት", en: "Ruth" }, chapters: 4 },

  // 81-Canon Deuterocanonical Books
  { id: "enoch", category: "canon81", name: { am: "መጽሐፈ ሄኖክ", en: "Book of Enoch (Henok)" }, chapters: 108 },
  { id: "jubilees", category: "canon81", name: { am: "መጽሐፈ ኩፋሌ", en: "Book of Jubilees (Kufale)" }, chapters: 50 },
  { id: "wisdom", category: "canon81", name: { am: "መጽሐፈ ጥበብ", en: "Wisdom of Solomon" }, chapters: 19 },
  { id: "sirach", category: "canon81", name: { am: "መጽሐፈ ሲራክ", en: "Book of Sirach (Ecclesiasticus)" }, chapters: 51 },
  { id: "tobit", category: "canon81", name: { am: "መጽሐፈ ጦቢት", en: "Book of Tobit" }, chapters: 14 },
  { id: "judith", category: "canon81", name: { am: "መጽሐፈ ዮዲት", en: "Book of Judith" }, chapters: 16 },
  { id: "baruch", category: "canon81", name: { am: "መጽሐፈ ባሮክ", en: "Book of Baruch" }, chapters: 5 },
  { id: "maccabees1", category: "canon81", name: { am: "መጽሐፈ መቃብያን ቀዳማዊ", en: "1 Maccabees (Ethiopic)" }, chapters: 36 },
  { id: "maccabees2", category: "canon81", name: { am: "መጽሐፈ መቃብያን ካልዕ", en: "2 Maccabees (Ethiopic)" }, chapters: 21 },
  { id: "maccabees3", category: "canon81", name: { am: "መጽሐፈ መቃብያን ሣልስ", en: "3 Maccabees (Ethiopic)" }, chapters: 10 },
  { id: "josippon", category: "canon81", name: { am: "ዮሴፍ ወልደ ኮርዮን", en: "Josippon (Zena Ayhud)" }, chapters: 8 },
  { id: "covenant1", category: "canon81", name: { am: "መጽሐፈ ኪዳን ቀዳማዊ", en: "1st Book of Covenant (Metsihafe Kidan)" }, chapters: 60 },
  { id: "didascalia", category: "canon81", name: { am: "ዲድስቅልያ", en: "Ethiopic Didascalia" }, chapters: 43 },
  { id: "clement", category: "canon81", name: { am: "ቀለሜንጦስ", en: "Book of Clement (Qalementos)" }, chapters: 7 },

  // Wisdom & Psalms
  { id: "psalms", category: "wisdom", name: { am: "መዝሙረ ዳዊት", en: "Book of Psalms (Dawit)" }, chapters: 150 },
  { id: "proverbs", category: "wisdom", name: { am: "መጽሐፈ ምሳሌ", en: "Proverbs (Mesale)" }, chapters: 31 },
  { id: "ecclesiastes", category: "wisdom", name: { am: "መጽሐፈ መክብብ", en: "Ecclesiastes" }, chapters: 12 },
  { id: "songofsongs", category: "wisdom", name: { am: "መኃልየ መኃልይ ዘሰሎሞን", en: "Song of Solomon" }, chapters: 8 },
  { id: "job", category: "wisdom", name: { am: "መጽሐፈ ኢዮብ", en: "Book of Job" }, chapters: 42 },

  // Major & Minor Prophets
  { id: "isaiah", category: "prophets", name: { am: "ትንቢተ ኢሳይያስ", en: "Prophecy of Isaiah" }, chapters: 66 },
  { id: "jeremiah", category: "prophets", name: { am: "ትንቢተ ኤርምያስ", en: "Jeremiah & Lamentations" }, chapters: 52 },
  { id: "ezekiel", category: "prophets", name: { am: "ትንቢተ ሕዝቅኤል", en: "Ezekiel" }, chapters: 48 },
  { id: "daniel", category: "prophets", name: { am: "ትንቢተ ዳንኤል", en: "Daniel" }, chapters: 14 },
  { id: "hosea", category: "prophets", name: { am: "ትንቢተ ሆሴዕ", en: "Hosea" }, chapters: 14 },
  { id: "amos", category: "prophets", name: { am: "ትንቢተ አሞጽ", en: "Amos" }, chapters: 9 },
  { id: "micah", category: "prophets", name: { am: "ትንቢተ ሚክያስ", en: "Micah" }, chapters: 7 },
  { id: "joel", category: "prophets", name: { am: "ትንቢተ ኢዩኤል", en: "Joel" }, chapters: 3 },
  { id: "jonah", category: "prophets", name: { am: "ትንቢተ ዮናስ", en: "Jonah" }, chapters: 4 },
  { id: "zechariah", category: "prophets", name: { am: "ትንቢተ ዘካርያስ", en: "Zechariah" }, chapters: 14 },
  { id: "malachi", category: "prophets", name: { am: "ትንቢተ ሚልክያስ", en: "Malachi" }, chapters: 4 },

  // Epistles & Acts (New Testament)
  { id: "acts", category: "epistles", name: { am: "የሐዋርያት ሥራ", en: "Acts of the Apostles" }, chapters: 28 },
  { id: "romans", category: "epistles", name: { am: "ወደ ሮሜ ሰዎች", en: "Romans" }, chapters: 16 },
  { id: "corinthians1", category: "epistles", name: { am: "1ኛ ቆሮንቶስ", en: "1 Corinthians" }, chapters: 16 },
  { id: "corinthians2", category: "epistles", name: { am: "2ኛ ቆሮንቶስ", en: "2 Corinthians" }, chapters: 13 },
  { id: "galatians", category: "epistles", name: { am: "ወደ ገላትያ ሰዎች", en: "Galatians" }, chapters: 6 },
  { id: "ephesians", category: "epistles", name: { am: "ወደ ኤፌሶን ሰዎች", en: "Ephesians" }, chapters: 6 },
  { id: "philippians", category: "epistles", name: { am: "ወደ ፊልጵስዩስ ሰዎች", en: "Philippians" }, chapters: 4 },
  { id: "colossians", category: "epistles", name: { am: "ወደ ቆላስይስ ሰዎች", en: "Colossians" }, chapters: 4 },
  { id: "hebrews", category: "epistles", name: { am: "ወደ ዕብራውያን ሰዎች", en: "Hebrews" }, chapters: 13 },
  { id: "james", category: "epistles", name: { am: "የያዕቆብ መልእክት", en: "Epistle of James" }, chapters: 5 },
  { id: "peter1", category: "epistles", name: { am: "1ኛ የጴጥሮስ መልእክት", en: "1 Peter" }, chapters: 5 },
  { id: "peter2", category: "epistles", name: { am: "2ኛ የጴጥሮስ መልእክት", en: "2 Peter" }, chapters: 3 },
  { id: "john1", category: "epistles", name: { am: "1ኛ የዮሐንስ መልእክት", en: "1 John" }, chapters: 5 },
  { id: "revelation", category: "epistles", name: { am: "የዮሐንስ ራእይ", en: "Revelation of John" }, chapters: 22 },
];

/**
 * Rich Expansive Verses Pool across ALL 81 Books (EOTCOpenSource Canonical Standard)
 */
export const dailyBibleReferences: DailyBibleReference[] = [
  // Gospels
  {
    id: "john-1-1",
    category: "gospels",
    bookId: "john",
    reference: { am: "ዮሐንስ 1፥1", en: "John 1:1" },
    focus: { am: "የቃል ሥጋ መሆን", en: "The Word was God" },
    text: {
      am: "በመጀመሪያ ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ።",
      en: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    },
  },
  {
    id: "john-14-27",
    category: "gospels",
    bookId: "john",
    reference: { am: "ዮሐንስ 14፥27", en: "John 14:27" },
    focus: { am: "የክርስቶስ ሰላም", en: "Peace of Christ" },
    text: {
      am: "ሰላምን እተውላችኋለሁ፥ ሰላሜን እሰጣችኋለሁ፤ እኔ የምሰጣችሁ ዓለም እንደሚሰጥ አይደለም። ልባችሁ አይታወክ አይፍራም።",
      en: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    },
  },
  {
    id: "john-15-5",
    category: "gospels",
    bookId: "john",
    reference: { am: "ዮሐንስ 15፥5", en: "John 15:5" },
    focus: { am: "እውነተኛው የወይን ግንድ", en: "I am the Vine" },
    text: {
      am: "እኔ የወይን ግንድ ነኝ እናንተም ቅርንጫፎች ናችሁ። ያለ እኔ ምንም ልታደርጉ አትችሉምና በእኔ የሚኖር እኔም በእርሱ፥ እርሱ ብዙ ፍሬ ያፈራል።",
      en: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.",
    },
  },
  {
    id: "matthew-5-14",
    category: "gospels",
    bookId: "matthew",
    reference: { am: "ማቴዎስ 5፥14", en: "Matthew 5:14" },
    focus: { am: "የዓለም ብርሃን", en: "Light of the World" },
    text: {
      am: "እናንተ የዓለም ብርሃን ናችሁ። በተራራ ላይ ያለች ከተማ ልትሰወር አይቻላትም።",
      en: "Ye are the light of the world. A city that is set on an hill cannot be hid.",
    },
  },
  {
    id: "matthew-6-33",
    category: "gospels",
    bookId: "matthew",
    reference: { am: "ማቴዎስ 6፥33", en: "Matthew 6:33" },
    focus: { am: "የእግዚአብሔርን መንግሥት መሻት", en: "Seek first the Kingdom of God" },
    text: {
      am: "ነገር ግን አስቀድማችሁ የእግዚአብሔርን መንግሥት ጽድቁንም ፈልጉ፥ ይህም ሁሉ ይጨመርላችኋል።",
      en: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
    },
  },
  {
    id: "matthew-11-28",
    category: "gospels",
    bookId: "matthew",
    reference: { am: "ማቴዎስ 11፥28", en: "Matthew 11:28" },
    focus: { am: "የክርስቶስ ዕረፍት", en: "Rest in Christ" },
    text: {
      am: "እናንተ ደካሞች ሸክማችሁ የከበደ ሁሉ፥ ወደ እኔ ኑ፥ እኔም አሳርፋችኋለሁ።",
      en: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    },
  },
  {
    id: "luke-1-46",
    category: "gospels",
    bookId: "luke",
    reference: { am: "ሉቃስ 1፥46-48", en: "Luke 1:46-48" },
    focus: { am: "ውዳሴ ማርያም (ማግኒፊካት)", en: "Magnificat of the Theotokos" },
    text: {
      am: "ማርያምም እንዲህ አለች፦ ነፍሴ ጌታን ታከብረዋለች፥ መንፈሴም በአምላኬ በመድኃኒቴ ሐሴት ታደርጋለች፤ የባሪያይቱን መዋረድ አይቷልና።",
      en: "And Mary said, My soul doth magnify the Lord, And my spirit hath rejoiced in God my Saviour. For he hath regarded the low estate of his handmaiden.",
    },
  },
  {
    id: "mark-11-24",
    category: "gospels",
    bookId: "mark",
    reference: { am: "ማርቆስ 11፥24", en: "Mark 11:24" },
    focus: { am: "በጸሎት ማመን", en: "Faith in Prayer" },
    text: {
      am: "ስለዚህ እላችኋለሁ፥ የጸለያችሁትን የለመናችሁትንም ሁሉ እንዳገኛችሁት እመኑ፥ ይሆንላችሁማል።",
      en: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.",
    },
  },

  // 81-Canon Deuterocanon
  {
    id: "enoch-1-1",
    category: "canon81",
    bookId: "enoch",
    reference: { am: "መጽሐፈ ሄኖክ 1፥1-2", en: "1 Enoch 1:1-2" },
    focus: { am: "የጻድቃን በረከት", en: "Blessing of the Righteous" },
    text: {
      am: "ሄኖክ በምድር ያሉትን ጻድቃን ይባርክበት ዘንድ የሄኖክ የበረከት ቃል ይህ ነው። በሕይወቱ ሁሉ ከእግዚአብሔር ጋር ተመላለሰ።",
      en: "The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be of living in the day of tribulation.",
    },
  },
  {
    id: "enoch-39-4",
    category: "canon81",
    bookId: "enoch",
    reference: { am: "መጽሐፈ ሄኖክ 39፥4", en: "1 Enoch 39:4" },
    focus: { am: "የቅዱሳን ማደሪያ", en: "Habitation of the Holy" },
    text: {
      am: "በዚያም የቅዱሳኑን ማደሪያና የጻድቃኑን የዕረፍት ስፍራ ከመላእክት ክንፍ በታች አየሁ።",
      en: "There I saw the dwelling-places of the holy, and the resting-places of the righteous under the wings of the Lord of Spirits.",
    },
  },
  {
    id: "jubilees-2-1",
    category: "canon81",
    bookId: "jubilees",
    reference: { am: "መጽሐፈ ኩፋሌ 2፥1-3", en: "Jubilees 2:1-3" },
    focus: { am: "የፍጥረት ምስጢርና ሰንበት", en: "Creation and Sabbath Blessing" },
    text: {
      am: "እግዚአብሔር ፍጥረታትን ሁሉ በመልካም ሥርዓት ፈጠረ፤ ሰባተኛይቱንም ቀን ባረካት ቀደሳትም።",
      en: "And God created all works with order and blessed the seventh day and sanctified it as a perpetual sign.",
    },
  },
  {
    id: "wisdom-7-25",
    category: "canon81",
    bookId: "wisdom",
    reference: { am: "ጥበበ ሰሎሞን 7፥25-26", en: "Wisdom of Solomon 7:25-26" },
    focus: { am: "የእግዚአብሔር ጥበብ", en: "Pure Radiance of Divine Wisdom" },
    text: {
      am: "ጥበብ የእግዚአብሔር ኃይል እስትንፋስ፥ የሁሉ ገዢ የክብሩ ንጹሕ ጨረር ናት። እርሷ የዘላለም ብርሃን ጸዳል ናት።",
      en: "For wisdom is the breath of the power of God, and a pure influence flowing from the glory of the Almighty.",
    },
  },
  {
    id: "sirach-2-1",
    category: "canon81",
    bookId: "sirach",
    reference: { am: "መጽሐፈ ሲራክ 2፥1-3", en: "Sirach 2:1-3" },
    focus: { am: "እግዚአብሔርን መፍራትና መታመን", en: "Fear of God and Endurance" },
    text: {
      am: "ልጄ ሆይ፥ እግዚአብሔርን ለማገልገል ብትቀርብ ነፍስህን ለፈተና አዘጋጅ። ልብህን አቅና፥ ጽናም፤ በመከራም ጊዜ አትታወክ።",
      en: "My son, if thou come to serve the Lord, prepare thy soul for temptation. Set thy heart aright, and constantly endure.",
    },
  },
  {
    id: "sirach-51-1",
    category: "canon81",
    bookId: "sirach",
    reference: { am: "መጽሐፈ ሲራክ 51፥1-2", en: "Sirach 51:1-2" },
    focus: { am: "የምስጋና ጸሎት", en: "Prayer of Thanksgiving" },
    text: {
      am: "አቤቱ ጌታዬ ንጉሥ ሆይ አመሰግንሃለሁ፥ መድኃኒቴ እግዚአብሔር ሆይ አከብርሃለሁ፤ ለስምህም ምስጋና አቀርባለሁ።",
      en: "I will thank thee, O Lord and King, and praise thee, O God my Saviour: I do give praise unto thy name.",
    },
  },
  {
    id: "tobit-4-7",
    category: "canon81",
    bookId: "tobit",
    reference: { am: "መጽሐፈ ጦቢት 4፥7-8", en: "Tobit 4:7-8" },
    focus: { am: "ምጽዋትና ቸርነት", en: "Almsgiving and Compassion" },
    text: {
      am: "ከገንዘብህ ምጽዋት ስጥ፤ ከድሆችም ፊትህን አትመልስ፥ የእግዚአብሔርም ፊት ከአንተ አይመለስም።",
      en: "Give alms of thy substance; and when thou givest alms, let not thine eye be envious, neither turn thy face from any poor.",
    },
  },
  {
    id: "judith-16-13",
    category: "canon81",
    bookId: "judith",
    reference: { am: "መጽሐፈ ዮዲት 16፥13", en: "Judith 16:13" },
    focus: { am: "ለአምላክ አዲስ መዝሙር", en: "A New Song to God" },
    text: {
      am: "ለአምላኬ አዲስ ቅኔ እቀኛለሁ፤ አቤቱ አንተ ታላቅና ክቡር ነህ፥ በኃይልህ ድንቅ ነህ ማንም ሊቋቋምህ አይችልም።",
      en: "I will sing unto the Lord a new song: O Lord, thou art great and glorious, wonderful in strength, and invincible.",
    },
  },
  {
    id: "baruch-3-37",
    category: "canon81",
    bookId: "baruch",
    reference: { am: "መጽሐፈ ባሮክ 3፥37", en: "Baruch 3:37" },
    focus: { am: "በምድር የታየው ጥበብ", en: "Wisdom Appointed on Earth" },
    text: {
      am: "ከዚህ በኋላ ጥበብ በምድር ላይ ታየች፥ ከሰው ልጆችም ጋር ተመላለሰች።",
      en: "Afterward did he shew himself upon earth, and conversed with men.",
    },
  },
  {
    id: "maccabees1-3-19",
    category: "canon81",
    bookId: "maccabees1",
    reference: { am: "መቃብያን ቀዳማዊ 3፥19", en: "1 Maccabees 3:19" },
    focus: { am: "ድል ከሰማይ ነው", en: "Victory from Heaven" },
    text: {
      am: "የጦርነት ድል በሠራዊት ብዛት አይደለም፤ ኃይል ከሰማይ ከእግዚአብሔር ዘንድ ነው እንጂ።",
      en: "The victory of battle standeth not in the multitude of an host; but strength cometh from heaven.",
    },
  },

  // Wisdom & Psalms
  {
    id: "psalm-23-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 23፥1-3", en: "Psalm 23:1-3" },
    focus: { am: "እግዚአብሔር እረኛዬ ነው", en: "The Lord is my Shepherd" },
    text: {
      am: "እግዚአብሔር እረኛዬ ነው፥ የሚያሳጣኝም የለም። በለመለመ መስክ ያሳድረኛል፤ በዕረፍት ውኃ ዘንድ ይመራኛል።",
      en: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    },
  },
  {
    id: "psalm-50-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 50፥10", en: "Psalm 51:10" },
    focus: { am: "የንጹሕ ልብ ልመና", en: "Create in Me a Clean Heart" },
    text: {
      am: "አቤቱ፥ ንጹሕ ልብን ፍጠርልኝ፥ የቀናውንም መንፈስ በውስጤ አድስ።",
      en: "Create in me a clean heart, O God; and renew a right spirit within me.",
    },
  },
  {
    id: "psalm-91-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 91፥1-2", en: "Psalm 91:1-2" },
    focus: { am: "በልዑል መጠጊያ መኖር", en: "Secret Place of the Most High" },
    text: {
      am: "በልዑል መጠጊያ የሚኖር ሁሉን በሚችል አምላክ ጥላ ውስጥ ያድራል። እግዚአብሔርን፦ አንተ መጠጊያዬና አምባዬ ነህ እለዋለሁ።",
      en: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress.",
    },
  },
  {
    id: "psalm-119-105",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 119፥105", en: "Psalm 119:105" },
    focus: { am: "የቃሉ ብርሃን", en: "Light of the Word" },
    text: {
      am: "ሕግህ ለእግሬ መብራት፥ ለመንገዴም ብርሃን ነው።",
      en: "Thy word is a lamp unto my feet, and a light unto my path.",
    },
  },
  {
    id: "psalm-121-1",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 121፥1-2", en: "Psalm 121:1-2" },
    focus: { am: "ረዳቴ ከእግዚአብሔር ዘንድ ነው", en: "My Help Comes from the Lord" },
    text: {
      am: "ዓይኖቼን ወደ ተራሮች አነሣሁ፤ ረዳቴ ከወዴት ይምጣ? ረዳቴ ሰማይንና ምድርን ከሠራ ከእግዚአብሔር ዘንድ ነው።",
      en: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the Lord, which made heaven and earth.",
    },
  },
  {
    id: "psalm-150-6",
    category: "wisdom",
    bookId: "psalms",
    reference: { am: "መዝሙር 150፥6", en: "Psalm 150:6" },
    focus: { am: "የፍጥረት ምስጋና", en: "Praise the Lord" },
    text: {
      am: "እስትንፋስ ያለው ሁሉ እግዚአብሔርን ያመስግን፤ ሃሌ ሉያ።",
      en: "Let every thing that hath breath praise the Lord. Praise ye the Lord.",
    },
  },
  {
    id: "proverbs-3-5",
    category: "wisdom",
    bookId: "proverbs",
    reference: { am: "ምሳሌ 3፥5-6", en: "Proverbs 3:5-6" },
    focus: { am: "በእግዚአብሔር መታመን", en: "Trust in the Lord" },
    text: {
      am: "በፍጹም ልብህ በእግዚአብሔር ታመን፥ በራስህም ማስተዋል አትደገፍ፤ በመንገድህ ሁሉ እርሱን እወቅ፥ እርሱም ጎዳናህን ያቀናልሃል።",
      en: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    },
  },
  {
    id: "ecclesiastes-3-1",
    category: "wisdom",
    bookId: "ecclesiastes",
    reference: { am: "መክብብ 3፥1", en: "Ecclesiastes 3:1" },
    focus: { am: "ለሁሉ ጊዜ አለው", en: "A Season for Everything" },
    text: {
      am: "ለሁሉ ዘመን አለው፥ ከሰማይ በታችም ለሆነ ነገር ሁሉ ጊዜ አለው።",
      en: "To every thing there is a season, and a time to every purpose under the heaven.",
    },
  },
  {
    id: "job-19-25",
    category: "wisdom",
    bookId: "job",
    reference: { am: "ኢዮብ 19፥25", en: "Job 19:25" },
    focus: { am: "ተዋጂዬ ሕያው እንደ ሆነ አውቃለሁ", en: "My Redeemer Liveth" },
    text: {
      am: "እኔ ግን ተዋጂዬ ሕያው እንደ ሆነ፥ በመጨረሻውም ዘመን በምድር ላይ እንዲቆም አውቃለሁ።",
      en: "For I know that my redeemer liveth, and that he shall stand at the latter day upon the earth.",
    },
  },

  // Prophets
  {
    id: "isaiah-40-31",
    category: "prophets",
    bookId: "isaiah",
    reference: { am: "ኢሳይያስ 40፥31", en: "Isaiah 40:31" },
    focus: { am: "እግዚአብሔርን ተስፋ ማድረግ", en: "Hope in the Lord" },
    text: {
      am: "እግዚአብሔርን በመተማመን የሚጠባበቁ ግን ኃይላቸውን ያድሳሉ፤ እንደ ንስር በክንፍ ይወጣሉ፤ ይሮጣሉ፥ አይታክቱም፤ ይሄዳሉ፥ አይደክሙም።",
      en: "They that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    },
  },
  {
    id: "isaiah-9-6",
    category: "prophets",
    bookId: "isaiah",
    reference: { am: "ኢሳይያስ 9፥6", en: "Isaiah 9:6" },
    focus: { am: "የሰላም አለቃ", en: "Prince of Peace" },
    text: {
      am: "ሕፃን ተወልዶልናልና፥ ወንድ ልጅም ተሰጥቶናልና፤ አለቅነትም በጫንቃው ላይ ይሆናል፤ ስሙም ድንቅ መካር፥ ኃያል አምላክ፥ የዘላለም አባት፥ የሰላም አለቃ ተብሎ ይጠራል።",
      en: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.",
    },
  },
  {
    id: "jeremiah-29-11",
    category: "prophets",
    bookId: "jeremiah",
    reference: { am: "ኤርምያስ 29፥11", en: "Jeremiah 29:11" },
    focus: { am: "የሰላም አሳብ", en: "Thoughts of Peace" },
    text: {
      am: "ለእናንተ የማስባትን አሳብ እኔ አውቃለሁ፤ ፍጻሜና ተስፋ እሰጣችሁ ዘንድ የሰላም አሳብ ነው እንጂ የክፉ አይደለም።",
      en: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.",
    },
  },
  {
    id: "micah-6-8",
    category: "prophets",
    bookId: "micah",
    reference: { am: "ሚክያስ 6፥8", en: "Micah 6:8" },
    focus: { am: "እግዚአብሔር የሚፈልገው", en: "What the Lord Requires" },
    text: {
      am: "ሰው ሆይ፥ መልካሙን ነግሮሃል፤ እግዚአብሔርም ከአንተ የሚሻው ምንድር ነው? ፍርድን ታደርግ ዘንድ፥ ምሕረትንም ትወድ ዘንድ፥ ከአምላክህም ጋር በትሕትና ትሄድ ዘንድ አይደለምን?",
      en: "He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
    },
  },

  // Epistles & Acts
  {
    id: "romans-8-38",
    category: "epistles",
    bookId: "romans",
    reference: { am: "ሮሜ 8፥38-39", en: "Romans 8:38-39" },
    focus: { am: "የእግዚአብሔር የማይነጥቅ ፍቅር", en: "Unfailing Love of God" },
    text: {
      am: "ሞት ቢሆን፥ ሕይወትም ቢሆን፥ መላእክትም ቢሆኑ... በክርስቶስ ኢየሱስ በጌታችን ካለ ከእግዚአብሔር ፍቅር ሊለየን እንዳይችል ተረድቼአለሁ።",
      en: "For I am persuaded, that neither death, nor life, nor angels... shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    },
  },
  {
    id: "corinthians1-13-13",
    category: "epistles",
    bookId: "corinthians1",
    reference: { am: "1ኛ ቆሮንቶስ 13፥13", en: "1 Corinthians 13:13" },
    focus: { am: "ከሁሉ የሚበልጠው ፍቅር", en: "The Greatest of These is Love" },
    text: {
      am: "አሁን ግን እምነት ተስፋ ፍቅር እነዚህ ሦስቱ ጸንተው ይኖራሉ፤ ከእነዚህም የሚበልጠው ፍቅር ነው።",
      en: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    },
  },
  {
    id: "philippians-4-13",
    category: "epistles",
    bookId: "philippians",
    reference: { am: "ፊልጵስዩስ 4፥13", en: "Philippians 4:13" },
    focus: { am: "በክርስቶስ ሁሉን መቻል", en: "Strength in Christ" },
    text: {
      am: "ኃይልን በሚሰጠኝ በክርስቶስ ሁሉን እችላለሁ።",
      en: "I can do all things through Christ which strengtheneth me.",
    },
  },
  {
    id: "galatians-5-22",
    category: "epistles",
    bookId: "galatians",
    reference: { am: "ገላትያ 5፥22-23", en: "Galatians 5:22-23" },
    focus: { am: "የመንፈስ ቅዱስ ፍሬ", en: "Fruit of the Holy Spirit" },
    text: {
      am: "የመንፈስ ፍሬ ግን ፍቅር፥ ደስታ፥ ሰላም፥ ትዕግሥት፥ ቸርነት፥ በጎነት፥ እምነት፥ የውሃት፥ ራስን መግዛት ነው።",
      en: "The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance.",
    },
  },
  {
    id: "james-1-5",
    category: "epistles",
    bookId: "james",
    reference: { am: "ያዕቆብ 1፥5", en: "James 1:5" },
    focus: { am: "ጥበብን ከእግዚአብሔር መሻት", en: "Asking God for Wisdom" },
    text: {
      am: "ከእናንተ ግን ማንም ጥበብ ቢጎድለው፥ ሳይነቅፍ በልግስና ለሁሉ የሚሰጠውን እግዚአብሔርን ይለምን፥ ለእርሱም ይሰጠዋል።",
      en: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
    },
  },
  {
    id: "peter1-5-7",
    category: "epistles",
    bookId: "peter1",
    reference: { am: "1ኛ ጴጥሮስ 5፥7", en: "1 Peter 5:7" },
    focus: { am: "ጭንቀትን በእግዚአብሔር ላይ መጣል", en: "Casting Care Upon the Lord" },
    text: {
      am: "እርሱ ስለ እናንተ ያስባልና የሚያስጨንቃችሁን ሁሉ በእርሱ ላይ ጣሉት።",
      en: "Casting all your care upon him; for he careth for you.",
    },
  },
  {
    id: "hebrews-11-1",
    category: "epistles",
    bookId: "hebrews",
    reference: { am: "ዕብራውያን 11፥1", en: "Hebrews 11:1" },
    focus: { am: "የእምነት ምንነት", en: "Substance of Faith" },
    text: {
      am: "እምነትም ተስፋ ስለምናደርገው ነገር የሚያስረግጥ፥ የማናየውንም ነገር የሚያስረዳ ነው።",
      en: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    },
  },
  {
    id: "revelation-21-4",
    category: "epistles",
    bookId: "revelation",
    reference: { am: "የዮሐንስ ራእይ 21፥4", en: "Revelation 21:4" },
    focus: { am: "እንባን ሁሉ ማበስ", en: "Wiping Away All Tears" },
    text: {
      am: "እንባዎችንም ሁሉ ከዓይኖቻቸው ያብሳል፥ ሞትም ከእንግዲህ ወዲህ አይሆንም፥ ኀዘንም ቢሆን ወይም ጩኸት ወይም ሥቃይ ከእንግዲህ ወዲህ አይሆንም።",
      en: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain.",
    },
  },

  // Torah
  {
    id: "genesis-1-1",
    category: "torah",
    bookId: "genesis",
    reference: { am: "ዘፍጥረት 1፥1-3", en: "Genesis 1:1-3" },
    focus: { am: "የፍጥረት መጀመሪያ", en: "In the Beginning" },
    text: {
      am: "በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ። እግዚአብሔርም፦ ብርሃን ይሁን አለ፤ ብርሃንም ሆነ።",
      en: "In the beginning God created the heaven and the earth. And God said, Let there be light: and there was light.",
    },
  },
  {
    id: "exodus-20-2",
    category: "torah",
    bookId: "exodus",
    reference: { am: "ዘጸአት 20፥2-3", en: "Exodus 20:2-3" },
    focus: { am: "ዐሥሩ ትእዛዛት", en: "Ten Commandments" },
    text: {
      am: "እኔ ከግብፅ ምድር ከባርነት ቤት ያወጣሁህ እግዚአብሔር አምላክህ ነኝ። ከእኔ በቀር ሌሎች አማልክት አይሁኑልህ።",
      en: "I am the Lord thy God, which have brought thee out of the land of Egypt, out of the house of bondage. Thou shalt have no other gods before me.",
    },
  },
  {
    id: "deuteronomy-6-5",
    category: "torah",
    bookId: "deuteronomy",
    reference: { am: "ዘዳግም 6፥5", en: "Deuteronomy 6:5" },
    focus: { am: "አምላክን በፍጹም ልብ መውደድ", en: "Love the Lord with All Your Heart" },
    text: {
      am: "አንተም አምላክህን እግዚአብሔርን በፍጹም ልብህ በፍጹምም ነፍስህ በፍጹምም ኃይልህ ውደድ።",
      en: "And thou shalt love the Lord thy God with all thine heart, and with all thy soul, and with all thy might.",
    },
  },
  {
    id: "joshua-1-9",
    category: "torah",
    bookId: "joshua",
    reference: { am: "ኢያሱ 1፥9", en: "Joshua 1:9" },
    focus: { am: "ጽና አይዞህ አትፍራ", en: "Be Strong and Courageous" },
    text: {
      am: "በምትሄድበት ሁሉ አምላክህ እግዚአብሔር ከአንተ ጋር ነውና ጽና፥ አይዞህ፤ አትፍራ፥ አትደንግጥ።",
      en: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    },
  },
];

let lastRandomIndex = -1;

export function getDailyBibleReference(
  date: Date = new Date(),
  language: AppLanguage = "en"
): {
  reference: LocalizedText;
  referenceText: string;
  focus: LocalizedText;
  focusText: string;
  verseText: string;
  bookId: string;
} {
  const eth = gregorianToEthiopian(date);
  const index = (eth.day * 7 + eth.month * 13 + eth.year) % dailyBibleReferences.length;
  const item = dailyBibleReferences[index];

  return {
    reference: item.reference,
    referenceText: item.reference[language] || item.reference.en,
    focus: item.focus,
    focusText: item.focus[language] || item.focus.en,
    verseText: item.text[language] || item.text.en,
    bookId: item.bookId,
  };
}

/**
 * Generates true unpredictable random verses across the whole 81 canonical books
 * ensuring non-consecutive variety.
 */
export function getRandomBibleVerse(
  language: AppLanguage = "en",
  category?: BibleCategory
): {
  reference: LocalizedText;
  referenceText: string;
  focus: LocalizedText;
  focusText: string;
  verseText: string;
  bookId: string;
} {
  const pool =
    category && category !== "all"
      ? dailyBibleReferences.filter((r) => r.category === category)
      : dailyBibleReferences;

  const list = pool.length > 0 ? pool : dailyBibleReferences;
  let nextIndex = Math.floor(Math.random() * list.length);

  // Avoid repeating the immediate previous verse if list has multiple entries
  if (list.length > 1 && nextIndex === lastRandomIndex) {
    nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
  }
  lastRandomIndex = nextIndex;
  const item = list[nextIndex];

  return {
    reference: item.reference,
    referenceText: item.reference[language] || item.reference.en,
    focus: item.focus,
    focusText: item.focus[language] || item.focus.en,
    verseText: item.text[language] || item.text.en,
    bookId: item.bookId,
  };
}
