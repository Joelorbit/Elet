import type { AppLanguage, EthiopianDate, LocalizedText } from "@/src/types/app";

export interface MonthlyCommemoration {
  day: number;
  title: LocalizedText;
  source: "EOTC Calendar";
  description?: LocalizedText;
}

export interface AnnualFeast {
  month: number; // 1 to 13 (Meskerem to Pagume)
  day: number;
  title: LocalizedText;
  significance: LocalizedText;
  isMajorNigis: boolean;
}

const entries: Array<[string, string, "EOTC Calendar", string, string]> = [
  ["Lideta Mariam and Saint Elijah", "ልደተ ማርያም እና ቅዱስ ኤልያስ", "EOTC Calendar", "Nativity of the Virgin Mary and remembrance of the Prophet Elijah.", "የእመቤታችን የቅድስት ድንግል ማርያም የልደት መታሰቢያ እና የነቢዩ ቅዱስ ኤልያስ ዕለት።"],
  ["Saint Thaddeus", "ቅዱስ ታዴዎስ", "EOTC Calendar", "Commemoration of Saint Thaddeus the Apostle.", "የቅዱስ ታዴዎስ ሐዋርያ ወርሃዊ መታሰቢያ።"],
  ["Ba'eta Mariam and Abune Zena Markos", "ባዕታ ማርያም እና አቡነ ዜና ማርቆስ", "EOTC Calendar", "Entry of the Blessed Virgin into the Holy Temple.", "እመቤታችን ቅድስት ድንግል ማርያም ወደ ቤተ መቅደስ የገባችበት መታሰቢያ።"],
  ["Yohannis Wolde Negedguad", "ዮሐንስ ወልደ ነጎድጓድ", "EOTC Calendar", "Saint John the Evangelist and Apostle of Love.", "የሐዋርያውና የወንጌላዊው የቅዱስ ዮሐንስ ወልደ ነጎድጓድ መታሰቢያ።"],
  ["Abune Gebre Menfes Kidus, Peter and Paul", "አቡነ ገብረ መንፈስ ቅዱስ፣ ጴጥሮስ እና ጳውሎስ", "EOTC Calendar", "Abune Gebre Menfes Kidus (Abo) and Holy Apostles Peter and Paul.", "የጻድቁ አቡነ ገብረ መንፈስ ቅዱስ እና የቅዱሳን ሐዋርያት ጴጥሮስና ጳውሎስ መታሰቢያ።"],
  ["Saint Arsema and Eyesus", "ቅድስት አርሴማ እና ኢየሱስ", "EOTC Calendar", "Holy Virgin Martyr Saint Arsema.", "የሰማዕቷ የቅድስት አርሴማ እና የኢየሱስ መታሰቢያ።"],
  ["Holy Trinity", "ቅድስት ሥላሴ", "EOTC Calendar", "One God in Three Persons: Father, Son, and Holy Spirit.", "አንድ አምላክ የሚሆን የአብ፣ የወልድ፣ የመንፈስ ቅዱስ የቅድስት ሥላሴ መታሰቢያ።"],
  ["Saint Kiros and Abba Banuda", "አባ ኪሮስ እና አባ ባኑዳ", "EOTC Calendar", "Righteous Abba Kiros and Abba Banuda.", "የጻድቁ አባ ኪሮስ፣ አባ ባኑዳ እና የጻድቁ ኢዮብ መታሰቢያ።"],
  ["Saint Thomas and the 318 Fathers", "ቅዱስ ቶማስ እና ሠለስቱ ምእት", "EOTC Calendar", "Saint Thomas the Apostle and the 318 Orthodox Fathers of Nicaea.", "የቅዱስ ቶማስ ሐዋርያ እና የ318ቱ የኒቅያ ኦርቶዶክሳውያን አባቶች መታሰቢያ።"],
  ["The Holy Cross", "ቅዱስ መስቀል", "EOTC Calendar", "The Life-Giving Cross of Our Lord Jesus Christ.", "የጌታችን የኢየሱስ ክርስቶስ የከበረና ሕይወት ሰጪው ቅዱስ መስቀል መታሰቢያ።"],
  ["Hannah and Joachim", "ሐና እና ኢያቄም", "EOTC Calendar", "Righteous Hannah and Joachim, parents of the Theotokos.", "የእመቤታችን ቅድስት ድንግል ማርያም ወላጆች የጻድቃኑ ሐና እና ኢያቄም መታሰቢያ።"],
  ["Saint Michael the Archangel", "ቅዱስ ሚካኤል", "EOTC Calendar", "Chief of the Heavenly Hosts and Defender of the Faithful.", "የሊቃነ መላእክት አለቃ የቅዱስ ሚካኤል የከበረ ወርሃዊ መታሰቢያ።"],
  ["Saint Raphael and God the Father", "ቅዱስ ሩፋኤል እና እግዚአብሔር አብ", "EOTC Calendar", "Saint Raphael the Archangel, healer and protector.", "የፈዋሹና የምልጃው መልአክ የቅዱስ ሩፋኤል ሊቀ መላእክት መታሰቢያ።"],
  ["Abune Aregawi and Gebre Kristos", "አቡነ አረጋዊ እና ገብረ ክርስቶስ", "EOTC Calendar", "Abune Aregawi (one of the Nine Saints) and Saint Gebre Kristos.", "የተስዓቱ ቅዱሳን መሪ የአቡነ አረጋዊ እና የመርዓዊው ቅዱስ ገብረ ክርስቶስ መታሰቢያ።"],
  ["Saint Kirkos and Iyalota", "ቅዱስ ቂርቆስ እና እየሉጣ", "EOTC Calendar", "Child Martyr Saint Kirkos and his mother Saint Iyalota.", "ሕፃኑ ሰማዕት ቅዱስ ቂርቆስ እና እናቱ ቅድስት እየሉጣ።"],
  ["Kidane Mihret", "ቅድስት ኪዳነ ምሕረት", "EOTC Calendar", "Covenant of Mercy granted to the Holy Mother of God.", "የእመቤታችን የቅድስት ድንግል ማርያም የቃል ኪዳን መታሰቢያ።"],
  ["Saint Stephen and Abba Gerima", "ቅዱስ እስጢፋኖስ እና አባ ገሪማ", "EOTC Calendar", "Protomartyr Saint Stephen and Abba Gerima.", "የቀዳሜ ሰማዕት ቅዱስ እስጢፋኖስ እና የጻድቁ አባ ገሪማ መታሰቢያ።"],
  ["Saint Ewostatewos and Saint Philip", "ቅዱስ እውስጣቴዎስ እና ቅዱስ ፊልጶስ", "EOTC Calendar", "Saint Ewostatewos and Saint Philip the Apostle.", "የታላቁ አባት የአቡነ እውስጣቴዎስ እና የሐዋርያው ቅዱስ ፊልጶስ መታሰቢያ።"],
  ["Saint Gabriel the Archangel", "ቅዱስ ገብርኤል", "EOTC Calendar", "Archangel of Good Tidings, Deliverer of the Three Youths.", "የብስራቱ መልአክና የሠለስቱ ደቂቅ አዳኝ የቅዱስ ገብርኤል ሊቀ መላእክት መታሰቢያ።"],
  ["Dedication of Church and Saint Theodoros", "ሕንጸተ ቤተ ክርስቲያን እና ቅዱስ ቴዎድሮስ", "EOTC Calendar", "Dedication of the First Church in Philippi and Saint Theodore.", "የመጀመሪያዋ ቤተ ክርስቲያን የታነጸችበት መታሰቢያና የቅዱስ ቴዎድሮስ ዕለት።"],
  ["Holy Virgin Mary", "ቅድስት ድንግል ማርያም", "EOTC Calendar", "The Blessed Virgin Mary, Mother of God (Theotokos).", "የእመቤታችን የቅድስት ድንግል ማርያም ወርሃዊ በዓለ ዕረፍት።"],
  ["Saint Urael and Saint Dexius", "ቅዱስ ዑራኤል እና ደቅስዮስ", "EOTC Calendar", "Saint Urael the Archangel and Saint Dexius.", "ምስጢር ገላጭ የሆነው የቅዱስ ዑራኤል ሊቀ መላእክት መታሰቢያ።"],
  ["Saint George the Martyr", "ቅዱስ ጊዮርጊስ", "EOTC Calendar", "Great Martyr Saint George, Trophy-Bearer.", "የሰማዕታት አለቃ የከበረው የቅዱስ ጊዮርጊስ ወርሃዊ መታሰቢያ።"],
  ["Abune Tekle Haymanot and the 24 Heavenly Priests", "አቡነ ተክለ ሃይማኖት እና 24ቱ ካህናተ ሰማይ", "EOTC Calendar", "Father of Monasticism Abune Tekle Haymanot and the 24 Priests of Heaven.", "የኢትዮጵያ ብርሃን አቡነ ተክለ ሃይማኖት እና የ24ቱ ካህናተ ሰማይ መታሰቢያ።"],
  ["Saint Merkorios", "ቅዱስ መርቆሬዎስ", "EOTC Calendar", "Saint Mercurius the Two-Sword Martyr (Abu Seifein).", "ባለ ሁለት ሰይፉ ሰማዕት የቅዱስ መርቆሬዎስ መታሰቢያ።"],
  ["Abune Habte Mariam and Saint Joseph", "አቡነ ሀብተ ማርያም እና ቅዱስ ዮሴፍ", "EOTC Calendar", "Righteous Abune Habte Mariam and Saint Joseph the Betrothed.", "የጻድቁ አቡነ ሀብተ ማርያም እና የጻድቁ ዮሴፍ መታሰቢያ።"],
  ["Medhane Alem", "መድኃኔዓለም", "EOTC Calendar", "Our Lord Jesus Christ, Savior of the World.", "የዓለም መድኃኒት የጌታችን የመድኃኔዓለም ወርሃዊ መታሰቢያ።"],
  ["Saint Emmanuel", "ቅዱስ አማኑኤል", "EOTC Calendar", "Our Lord Emmanuel, God With Us.", "እግዚአብሔር ከእኛ ጋር የሚለው የጌታችን የቅዱስ አማኑኤል መታሰቢያ።"],
  ["Bale Wolde and Birth of Christ", "ባለ ወልድ እና ልደተ ክርስቶስ", "EOTC Calendar", "Commemoration of the Incarnation and Birth of Our Lord.", "የጌታችን የኢየሱስ ክርስቶስ የልደትና የባለወልድ መታሰቢያ።"],
  ["Saint John the Baptist", "መጥምቀ መለኮት ቅዱስ ዮሐንስ", "EOTC Calendar", "The Forerunner and Baptist Saint John.", "የጌታ መንገድ ጠራጊና መጥምቅ የቅዱስ ዮሐንስ መታሰቢያ።"],
];

export const monthlyCommemorations: MonthlyCommemoration[] = entries.map(([en, am, source, descEn, descAm], index) => ({
  day: index + 1,
  title: { en, am },
  source,
  description: { en: descEn, am: descAm },
}));

export const dailyReflection: LocalizedText = {
  en: "Take a quiet moment for prayer, gratitude, and remembrance.",
  am: "ለጸሎት፣ ለምስጋና እና ለመታሰቢያ በጸጥታ ትንሽ ጊዜ ይውሰዱ።",
};

export const majorAnnualFeasts: AnnualFeast[] = [
  // 1. Meskerem (መስከረም)
  {
    month: 1,
    day: 1,
    title: { en: "Enkutatash / Saint John (New Year)", am: "እንቁጣጣሽ / ቅዱስ ዮሐንስ (ርእሰ ዐውደ ዓመት)" },
    significance: { en: "Ethiopian Orthodox New Year and annual feast of Saint John the Baptist.", am: "የኢትዮጵያ አዲስ ዓመት እና የቅዱስ ዮሐንስ መጥምቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 1,
    day: 17,
    title: { en: "Finding of the True Cross (Meskel / Demera)", am: "ደመራ እና በዓለ ቅዱስ መስቀል" },
    significance: { en: "The discovery of the Life-Giving True Cross by Empress Helena.", am: "ንግሥት ዕሌኒ የከበረውን የጌታችንን መስቀል ያስቆፈረችበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 1,
    day: 18,
    title: { en: "Abune Ewostatewos", am: "መስከረም አቡነ ኤዎስጣቴዎስ" },
    significance: { en: "The holy repose of Saint Abune Ewostatewos in Armenia.", am: "የታላቁ ኢትዮጵያዊ አባት የአቡነ ኤዎስጣቴዎስ የዕረፍት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 1,
    day: 21,
    title: { en: "Gishen Debre Kerbe Mariam", am: "ግሸን ደብረ ከርቤ ማርያም" },
    significance: { en: "Deposition of the Right Half of the True Cross (Gimade Meskel) at Gishen Amba.", am: "ግማደ መስቀሉ በግሸን አምባ የገባበትና የእመቤታችን ታላቅ የንግሥ በዓል።" },
    isMajorNigis: true,
  },

  // 2. Tikemt (ጥቅምት)
  {
    month: 2,
    day: 5,
    title: { en: "Abune Gebre Menfes Kidus (Tikemt Abo)", am: "ጥቅምት አቡነ ገብረ መንፈስ ቅዱስ" },
    significance: { en: "Annual commemoration of the great desert father Abune Gebre Menfes Kidus.", am: "የታላቁ ጻድቅ የአቡነ ገብረ መንፈስ ቅዱስ ታላቅ ዓመታዊ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 2,
    day: 14,
    title: { en: "Abune Aregawi (Debre Damo)", am: "አቡነ አረጋዊ (ደብረ ዳሞ)" },
    significance: { en: "Annual feast of Abune Aregawi, leader of the Nine Saints of Ethiopia.", am: "የተስዓቱ ቅዱሳን መሪ የአቡነ አረጋዊ ዓመታዊ የንግሥ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 2,
    day: 24,
    title: { en: "Birth of Abune Tekle Haymanot", am: "አቡነ ተክለ ሃይማኖት (ዘልደት)" },
    significance: { en: "The miraculous birth of Saint Tekle Haymanot in Zorare.", am: "የኢትዮጵያ ብርሃን የጻድቁ አቡነ ተክለ ሃይማኖት የልደት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 2,
    day: 27,
    title: { en: "Tikemt Medhane Alem", am: "ጥቅምት መድኃኔዓለም" },
    significance: { en: "Annual feast of Our Lord Jesus Christ, Savior of the World.", am: "የዓለም መድኃኒት የመድኃኔዓለም ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 3. Hidar (ኅዳር)
  {
    month: 3,
    day: 6,
    title: { en: "Kuskwaam Mariam (End of Flight to Egypt)", am: "ቁስቋም ማርያም (የስደት ፍጻሜ)" },
    significance: { en: "The return of the Holy Family from Mount Kuskwaam in Egypt.", am: "እመቤታችን ከልጇ ጋር ከስደት ወደ ናዝሬት የተመለሰችበት የቁስቋም ማርያም በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 8,
    title: { en: "Four Heavenly Living Creatures (Arba'etu Ensisa)", am: "አርባዕቱ እንስሳ" },
    significance: { en: "Commemoration of the Four Incorporeal Heavenly Living Creatures before the Throne.", am: "የእግዚአብሔርን ዙፋን የሚሸከሙት የአራቱ ኪሩቤል (አርባዕቱ እንስሳ) ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 9,
    title: { en: "318 Orthodox Fathers of Nicaea (SelesTu Mi'it)", am: "ሠለስቱ ምእት (የኒቅያ አባቶች)" },
    significance: { en: "Commemoration of the 318 Holy Orthodox Fathers of the First Ecumenical Council of Nicaea.", am: "የ318ቱ የኒቅያ ቅዱሳን ኦርቶዶክሳውያን አባቶች ታላቅ ዓመታዊ ጉባኤ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 12,
    title: { en: "Hidar Saint Michael the Archangel", am: "ኅዳር ሚካኤል" },
    significance: { en: "Deliverance of King Durtawos and defense of the faithful by Archangel Michael.", am: "የሊቀ መላእክት የቅዱስ ሚካኤል ታላቅ ዓመታዊ በዓል፤ ዱርታዎስን ያዳነበትና የዳዊትን ዘር የጠበቀበት።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 13,
    title: { en: "Hidar Saint Raphael the Archangel", am: "ኅዳር ሩፋኤል" },
    significance: { en: "Dedication of the church of St. Raphael in Alexandria.", am: "በእስክንድርያ በአንበሪ ጀርባ ላይ የታነጸችው የቅዱስ ሩፋኤል ቤተ ክርስቲያን የተመረቀችበት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 21,
    title: { en: "Hidar Zion Saint Mary (Axum Tsion)", am: "ኅዳር ጽዮን ማርያም (አክሱም ጽዮን)" },
    significance: { en: "Arrival of the Ark of the Covenant at Axum and the first Marian Cathedral.", am: "ታቦተ ጽዮን ወደ አክሱም የገባችበትና የመጀመሪያዋ ማርያም ቤተ መቅደስ የታነጸችበት የታላቋ ጽዮን ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 23,
    title: { en: "Hidar Saint George (Dedication of Church in Lydda)", am: "ኅዳር ቅዱስ ጊዮርጊስ" },
    significance: { en: "Consecration of the first church of Saint George in Lydda.", am: "በልዳ አገር የከበረው የቅዱስ ጊዮርጊስ ቤተ ክርስቲያን የተመረቀበት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 24,
    title: { en: "24 Heavenly Priests (Kahnate Semay)", am: "24ቱ ካህናተ ሰማይ" },
    significance: { en: "Commemoration of the 24 Priests of Heaven offering incense before the Throne.", am: "በዙፋኑ ፊት ዕጣን የሚያሳርጉት የሃያ አራቱ ካህናተ ሰማይ ዓመታዊ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 25,
    title: { en: "Saint Mercurius the Martyr (Merkorios Abu Seifein)", am: "ኅዳር ቅዱስ መርቆሬዎስ" },
    significance: { en: "Annual feast of the Two-Sword Martyr Saint Mercurius.", am: "ባለ ሁለት ሰይፉ ሰማዕት የቅዱስ መርቆሬዎስ ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 3,
    day: 26,
    title: { en: "Abune Habte Mariam", am: "ኅዳር አቡነ ሀብተ ማርያም" },
    significance: { en: "The holy repose of Righteous Father Abune Habte Mariam.", am: "የጻድቁ አባታችን የአቡነ ሀብተ ማርያም የዕረፍት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 4. Tahsas (ታኅሣሥ)
  {
    month: 4,
    day: 3,
    title: { en: "Ba'eta Mariam (Entry of Mary to the Temple)", am: "በዓታ ለማርያም" },
    significance: { en: "Presentation of 3-year-old Mary into the Holy of Holies.", am: "እመቤታችን በሦስት ዓመቷ ወደ ቤተ መቅደስ የገባችበት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 4,
    day: 6,
    title: { en: "Tahsas Saint Arsema", am: "ታኅሣሥ ቅድስት አርሴማ" },
    significance: { en: "Martyrdom and annual commemoration of Holy Virgin Martyr Saint Arsema.", am: "የሰማዕቷ የቅድስት አርሴማ የሰማዕትነት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 4,
    day: 19,
    title: { en: "Tahsas Saint Gabriel (Kulubi Gabriel)", am: "ታኅሣሥ ገብርኤል (ቁልቢ ገብርኤል)" },
    significance: { en: "Deliverance of the Three Holy Youths from the fiery furnace; Kulubi Pilgrimage.", am: "ሠለስቱ ደቂቅን ከእቶን እሳት ያዳነበትና የቁልቢ ገብርኤል ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 4,
    day: 22,
    title: { en: "Saint Dexius (Deqsyos)", am: "ታኅሣሥ ቅዱስ ደቅስዮስ" },
    significance: { en: "Saint Dexius, author of the praises of the Virgin Mary.", am: "የእመቤታችንን ምስጋና የደረሰው የቅዱስ ደቅስዮስ ዓመታዊ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 4,
    day: 24,
    title: { en: "Tahsas Saint Tekle Haymanot", am: "ታኅሣሥ አቡነ ተክለ ሃይማኖት" },
    significance: { en: "Miraculous preservation of Saint Tekle Haymanot when his cave collapsed.", am: "የጻድቁ አባታችን የአቡነ ተክለ ሃይማኖት ዋሻቸው የፈረሰበትና የተረፉበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 4,
    day: 29,
    title: { en: "Genna / Nativity of Our Lord Jesus Christ", am: "ልደተ ክርስቶስ / በዓለ ገና" },
    significance: { en: "The Holy Nativity and Incarnation of Our Lord and Savior Jesus Christ (Tahsas 28 in Leap Year).", am: "የጌታችን የመድኃኒታችን የኢየሱስ ክርስቶስ የልደት በዓል (ገና — በዘመነ ዮሐንስ ታኅሣሥ 28 ይከበራል)።" },
    isMajorNigis: true,
  },

  // 5. Tir (ጥር)
  {
    month: 5,
    day: 2,
    title: { en: "Abba Paul the Hermit (Abba Pawli)", am: "ጥር አባ ጳውሊ" },
    significance: { en: "Commemoration of Abba Paul the Hermit, the first anchorite.", am: "የባሕታውያን አባት የታላቁ አባ ጳውሊ ዓመታዊ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 4,
    title: { en: "Saint John the Evangelist (Yohannis Wolde Negedguad)", am: "ጥር ዮሐንስ ወልደ ነጎድጓድ" },
    significance: { en: "The repose of Saint John the Apostle, Evangelist, and Beloved Disciple.", am: "የሐዋርያውና የወንጌላዊው የቅዱስ ዮሐንስ ወልደ ነጎድጓድ የዕረፍት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 6,
    title: { en: "Gizret (Circumcision of Jesus Christ)", am: "ግዝረተ ክርስቶስ" },
    significance: { en: "Circumcision of Our Lord Jesus Christ on the eighth day according to the Law.", am: "ጌታችን ኢየሱስ ክርስቶስ በስምንተኛው ቀን እንደ ሕጉ የተገረዘበት ንዑስ የጌታ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 7,
    title: { en: "Tir Holy Trinity", am: "ጥር ሥላሴ" },
    significance: { en: "Annual commemoration of the Most Holy Trinity.", am: "አንድ አምላክ የሚሆን የአብ፣ የወልድ፣ የመንፈስ ቅዱስ የቅድስት ሥላሴ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 11,
    title: { en: "Timkat / Feast of the Epiphany", am: "ከተራ እና በዓለ ጥምቀት" },
    significance: { en: "The Holy Baptism of Jesus Christ by John in the Jordan River.", am: "ጌታችን በዮርዳኖስ ወንዝ የተጠመቀበት ታላቅ የጥምቀት በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 12,
    title: { en: "Feast of Cana of Galilee / Tir Saint Michael", am: "ቃና ዘገሊላ / ጥር ሚካኤል" },
    significance: { en: "Jesus turning water into wine at Cana of Galilee and annual feast of Archangel Michael.", am: "ጌታችን በቃና ዘገሊላ ውኃውን ወደ ወይን የለወጠበት ንዑስ የጌታ በዓል እና የጥር ሚካኤል በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 15,
    title: { en: "Tir Saint Kirkos and Saint Iyalota", am: "ጥር ቂርቆስ እና እየሉጣ" },
    significance: { en: "Martyrdom of Saint Kirkos and his mother Saint Iyalota in the fiery cauldron.", am: "ሕፃኑ ቅዱስ ቂርቆስና እናቱ ቅድስት እየሉጣ በፈላ የናስ ጋን ውስጥ የጸኑበት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 17,
    title: { en: "Saint Stephen the Protomartyr", am: "ጥር ቅዱስ እስጢፋኖስ" },
    significance: { en: "Martyrdom of Saint Stephen the Archdeacon and First Martyr.", am: "የቀዳሜ ሰማዕት የቅዱስ እስጢፋኖስ ሊቀ ዲያቆናት የሰማዕትነት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 21,
    title: { en: "Aster'eyo Mariam (Dormition of Saint Mary)", am: "አስተርእዮ ማርያም (ዕረፍተ ድንግል)" },
    significance: { en: "The falling asleep (Dormition) of the Most Holy Virgin Mary.", am: "የእመቤታችን የቅድስት ድንግል ማርያም የዕረፍት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 5,
    day: 22,
    title: { en: "Tir Saint Urael the Archangel", am: "ጥር ዑራኤል" },
    significance: { en: "Saint Urael giving Ezra the scribe the cup of wisdom and descending with mercy.", am: "ቅዱስ ዑራኤል ነቢዩ ዕዝራን ጥበብ የመገበበትና ምሕረት ያወረደበት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 6. Yekatit (የካቲት)
  {
    month: 6,
    day: 8,
    title: { en: "Simeon the Elder (Lidete Simeon)", am: "ስምዖን አረጋዊ" },
    significance: { en: "Righteous Simeon receiving the Christ Child into his arms in the Temple.", am: "አረጋዊው ቅዱስ ስምዖን ሕፃኑን ጌታ በቤተ መቅደስ በክንዱ የታቀፈበት ንዑስ የጌታ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 6,
    day: 16,
    title: { en: "Yekatit Kidane Mihret (Covenant of Mercy)", am: "የካቲት ኪዳነ ምሕረት" },
    significance: { en: "The Eternal Covenant given by Christ to His Holy Mother at Golgotha.", am: "ጌታችን ለእመቤታችን በጎልጎታ የማትፈርሰውን ቃል ኪዳን የሰጠበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 7. Megabit (መጋቢት)
  {
    month: 7,
    day: 5,
    title: { en: "Repose of Abune Gebre Menfes Kidus (Megabit Abo)", am: "መጋቢት አቡነ ገብረ መንፈስ ቅዱስ" },
    significance: { en: "The holy repose and translation of Saint Abune Gebre Menfes Kidus.", am: "የታላቁ ጻድቅ የአቡነ ገብረ መንፈስ ቅዱስ (አቦ) የዕረፍት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 7,
    day: 10,
    title: { en: "Manifestation of the Holy Cross", am: "መገለጸ መስቀል (ዕለተ መስቀል)" },
    significance: { en: "The unearthing and revelation of the Holy Cross by Empress Helena.", am: "ቅዱስ መስቀል ተቆፍሮ የወጣበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 7,
    day: 27,
    title: { en: "Megabit Medhane Alem", am: "መጋቢት መድኃኔዓለም" },
    significance: { en: "The Crucifixion and Redemption of mankind by Our Savior Jesus Christ.", am: "ጌታችን ለዓለም ድኅነት በመስቀል ላይ የዋለበት ዓመታዊ መታሰቢያ።" },
    isMajorNigis: true,
  },
  {
    month: 7,
    day: 29,
    title: { en: "Feast of the Annunciation (Tsinset)", am: "በዓለ ጽንሰት (ብስራተ ገብርኤል)" },
    significance: { en: "Archangel Gabriel announcing the Divine Incarnation to the Virgin Mary.", am: "ቅዱስ ገብርኤል ለእመቤታችን የልደተ ክርስቶስን ብስራት ያበሰረበት ታላቅ የጌታ በዓል።" },
    isMajorNigis: true,
  },

  // 8. Miyazya (ሚያዝያ)
  {
    month: 8,
    day: 23,
    title: { en: "Martyrdom of Saint George (Trophy-Bearer)", am: "ሚያዝያ ቅዱስ ጊዮርጊስ (ዕረፍቱ)" },
    significance: { en: "The crown of martyrdom received by Saint George, Chief of Martyrs.", am: "የሰማዕታት አለቃ የቅዱስ ጊዮርጊስ የዕረፍትና የሰማዕትነት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 8,
    day: 30,
    title: { en: "Saint Mark the Evangelist", am: "ሚያዝያ ቅዱስ ማርቆስ" },
    significance: { en: "Martyrdom of Saint Mark the Apostle and Evangelist.", am: "የወንጌላዊው የቅዱስ ማርቆስ ሰማዕትነት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 9. Ginbot (ግንቦት)
  {
    month: 9,
    day: 1,
    title: { en: "Lideta Mariam (Nativity of Saint Mary)", am: "ግንቦት ልደታ ለማርያም" },
    significance: { en: "The miraculous birth of the Holy Virgin Mary in Nazareth.", am: "እመቤታችን ቅድስት ድንግል ማርያም የተወለደችበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 9,
    day: 12,
    title: { en: "Ginbot Saint Michael the Archangel", am: "ግንቦት ሚካኤል" },
    significance: { en: "Saint Michael assisting Habakkuk the prophet and delivering Saint John.", am: "ቅዱስ ሚካኤል ዕንባቆም ነቢይን ያመጣበትና ቅዱስ ዮሐንስን ያዳነበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 9,
    day: 21,
    title: { en: "Debre Mitmaq Mariam", am: "ደብረ ምጥማቅ ማርያም" },
    significance: { en: "Apparition of the Blessed Virgin Mary at Debre Mitmaq for five consecutive days.", am: "እመቤታችን በደብረ ምጥማቅ ተገልጣ አምስት ቀን ሙሉ የታየችበት ታላቅ በዓል።" },
    isMajorNigis: true,
  },

  // 10. Sene (ሰኔ)
  {
    month: 10,
    day: 12,
    title: { en: "Sene Saint Michael the Archangel", am: "ሰኔ ሚካኤል" },
    significance: { en: "Saint Michael delivering Saint Bahran and Saint Afomia from the adversary.", am: "ቅዱስ ሚካኤል ባሕራንንና አፎሚያን ያዳነበትና ምልጃው የተገለጠበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 10,
    day: 16,
    title: { en: "Sene Kidane Mihret", am: "ሰኔ ኪዳነ ምሕረት" },
    significance: { en: "Annual commemoration of the Covenant of Mercy granted to the Holy Theotokos.", am: "የእመቤታችን የቅድስት ድንግል ማርያም የሰኔ ኪዳነ ምሕረት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 10,
    day: 19,
    title: { en: "Sene Saint Gabriel (Deliverance of Saint Kirkos)", am: "ሰኔ ገብርኤል" },
    significance: { en: "Archangel Gabriel delivering child martyr Saint Kirkos from the boiling cauldron.", am: "ቅዱስ ገብርኤል ሕፃኑን ቅዱስ ቂርቆስን ከፈላ የናስ ጋን ያዳነበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 10,
    day: 20,
    title: { en: "Sene Golgota / Dedication of Church", am: "ሰኔ ጎልጎታ / ሕንጸተ ቤተ ክርስቲያን" },
    significance: { en: "The Virgin Mary's prayer at Golgotha and consecration of the first church in Philippi.", am: "እመቤታችን በጎልጎታ የጸለየችበትና የመጀመሪያዋ ቤተ ክርስቲያን የተመረቀችበት በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 10,
    day: 30,
    title: { en: "Nativity of Saint John the Baptist", am: "ሰኔ ቅዱስ ዮሐንስ መጥምቅ" },
    significance: { en: "The birth of Saint John the Baptist, forerunner of Christ.", am: "የመጥምቀ መለኮት የቅዱስ ዮሐንስ የልደት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 11. Hamle (ሐምሌ)
  {
    month: 11,
    day: 2,
    title: { en: "Saint Thaddeus the Apostle", am: "ሐምሌ ቅዱስ ታዴዎስ" },
    significance: { en: "Martyrdom of Saint Thaddeus the Apostle.", am: "የሐዋርያው የቅዱስ ታዴዎስ የሰማዕትነት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 11,
    day: 5,
    title: { en: "Saints Peter and Paul the Apostles", am: "ቅዱሳን ጴጥሮስ እና ጳውሎስ" },
    significance: { en: "Martyrdom of Holy Apostles Peter and Paul in Rome.", am: "የቅዱሳን ሐዋርያት የጴጥሮስና የጳውሎስ የሰማዕትነት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 11,
    day: 7,
    title: { en: "Hamle Holy Trinity (Abraham's Hospitality)", am: "ሐምሌ ሥላሴ" },
    significance: { en: "Abraham hosting the Holy Trinity under the Oak of Mamre.", am: "አብርሃም ቅድስት ሥላሴን በድንኳኑ ያስተናገደበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 11,
    day: 19,
    title: { en: "Hamle Saint Kirkos and Saint Iyalota", am: "ሐምሌ ቂርቆስ እና እየሉጣ" },
    significance: { en: "Martyrdom of the child Saint Kirkos and his mother Saint Iyalota.", am: "የሕፃኑ ቅዱስ ቂርቆስና የእናቱ ቅድስት እየሉጣ ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 12. Nehase (ነሐሴ)
  {
    month: 12,
    day: 13,
    title: { en: "Debre Tabor / Buhe (Transfiguration of Our Lord)", am: "ደብረ ታቦር / ቡሄ" },
    significance: { en: "The Transfiguration of Our Lord Jesus Christ on Mount Tabor in divine glory.", am: "ጌታችን በደብረ ታቦር መለኮታዊ ክብሩን ለደቀ መዛሙርቱ የገለጠበት ታላቅ የጌታ በዓል (ቡሄ)።" },
    isMajorNigis: true,
  },
  {
    month: 12,
    day: 16,
    title: { en: "Filseta / Assumption of Saint Mary", am: "ፍልሰታ ለማርያም (ትንሣኤዋና ዕርገቷ)" },
    significance: { en: "The Assumption and Resurrection of the Most Holy Theotokos into Heaven.", am: "የእመቤታችን የቅድስት ድንግል ማርያም የትንሣኤዋና የዕርገቷ ታላቅ የንግሥ በዓል።" },
    isMajorNigis: true,
  },
  {
    month: 12,
    day: 24,
    title: { en: "Repose of Abune Tekle Haymanot", am: "አቡነ ተክለ ሃይማኖት (ዕረፍታቸው)" },
    significance: { en: "The holy repose of Saint Tekle Haymanot of Debre Libanos.", am: "የደብረ ሊባኖሱ ጻድቅ የአቡነ ተክለ ሃይማኖት የዕረፍት ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },

  // 13. Pagume (ጳጉሜን)
  {
    month: 13,
    day: 3,
    title: { en: "Pagume Saint Raphael the Archangel", am: "ጳጉሜን ቅዱስ ሩፋኤል" },
    significance: { en: "Archangel Raphael blessing the water and healing the sick.", am: "የቅዱስ ሩፋኤል ሊቀ መላእክት ውኃ የሚባርክበት ታላቅ ዓመታዊ በዓል።" },
    isMajorNigis: true,
  },
];

export function getMonthlyCommemoration(day: number) {
  return monthlyCommemorations.find((entry) => entry.day === day);
}

export function getAnnualFeast(month: number, day: number, year?: number): AnnualFeast | undefined {
  return majorAnnualFeasts.find((entry) => {
    // Handle Leap Year Genna (Tahsas 28 vs 29 in ዘመነ ዮሐንስ)
    if (year !== undefined && entry.month === 4 && entry.title.am.includes("ገና")) {
      const ameteAlem = year + 5500;
      const isLeapGenna = ameteAlem % 4 === 0;
      const gennaDay = isLeapGenna ? 28 : 29;
      return month === 4 && day === gennaDay;
    }
    return entry.month === month && entry.day === day;
  });
}

export function isMajorFeastDay(date: EthiopianDate): boolean {
  return getAnnualFeast(date.month, date.day, date.year) !== undefined;
}

export function getTodayOrthodoxCommemoration(date: EthiopianDate) {
  const monthly = getMonthlyCommemoration(date.day);
  const annual = getAnnualFeast(date.month, date.day, date.year);
  return { monthly, annual };
}

export function localizedCommemorationTitle(entry: MonthlyCommemoration, language: AppLanguage) {
  return entry.title[language] || entry.title.en;
}

export function localizedAnnualFeastTitle(entry: AnnualFeast, language: AppLanguage) {
  return entry.title[language] || entry.title.en;
}

export function localizedAnnualFeastSignificance(entry: AnnualFeast, language: AppLanguage) {
  return entry.significance[language] || entry.significance.en;
}
