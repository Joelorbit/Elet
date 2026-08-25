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
  // Meskerem
  { month: 1, day: 1, title: { en: "Enkutatash / Saint John (New Year)", am: "እንቁጣጣሽ / ቅዱስ ዮሐንስ (ርእሰ ዐውደ ዓመት)" }, significance: { en: "Ethiopian Orthodox New Year and feast of Saint John.", am: "የኢትዮጵያ አዲስ ዓመት እና የቅዱስ ዮሐንስ መጥምቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 1, day: 17, title: { en: "Finding of the True Cross (Meskel / Demera)", am: "ደመራ እና በዓለ ቅዱስ መስቀል" }, significance: { en: "The discovery of the Life-Giving True Cross by Queen Helena.", am: "ንግሥት ዕሌኒ የከበረውን የጌታችንን መስቀል ያስቆፈረችበት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 1, day: 21, title: { en: "Gishen Debre Kerbe Mariam", am: "ግሸን ደብረ ከርቤ ማርያም" }, significance: { en: "Deposition of the Right Half of the True Cross at Gishen Amba.", am: "ግማደ መስቀሉ በግሸን አምባ የገባበትና የእመቤታችን ታላቅ የንግሥ በዓል።" }, isMajorNigis: true },

  // Tikemt
  { month: 2, day: 5, title: { en: "Abune Gebre Menfes Kidus (Tikemt Abo)", am: "ጥቅምት አቡነ ገብረ መንፈስ ቅዱስ" }, significance: { en: "Annual commemoration of the great desert father Abune Gebre Menfes Kidus.", am: "የታላቁ ጻድቅ የአቡነ ገብረ መንፈስ ቅዱስ ዓመታዊ መታሰቢያ።" }, isMajorNigis: true },
  { month: 2, day: 14, title: { en: "Abune Aregawi (Debre Damo)", am: "አቡነ አረጋዊ (ደብረ ዳሞ)" }, significance: { en: "Commemoration of Abune Aregawi of the Nine Saints.", am: "የተስዓቱ ቅዱሳን አለቃ የአቡነ አረጋዊ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 2, day: 24, title: { en: "Birth of Abune Tekle Haymanot", am: "አቡነ ተክለ ሃይማኖት (ዘልደት)" }, significance: { en: "The miraculous birth of Saint Tekle Haymanot.", am: "የኢትዮጵያ ብርሃን የጻድቁ አቡነ ተክለ ሃይማኖት የልደት በዓል።" }, isMajorNigis: true },
  { month: 2, day: 27, title: { en: "Tikemt Medhane Alem", am: "ጥቅምት መድኃኔዓለም" }, significance: { en: "Annual feast of the Savior of the World.", am: "የዓለም መድኃኒት የመድኃኔዓለም ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Hidar
  { month: 3, day: 6, title: { en: "Kuskwaam Mariam (End of Flight to Egypt)", am: "ቁስቋም ማርያም (የስደት ፍጻሜ)" }, significance: { en: "The return of the Holy Family from Mount Kuskwaam in Egypt.", am: "እመቤታችን ከልጇ ጋር ከስደት ወደ ናዝሬት የተመለሰችበት የቁስቋም ማርያም በዓል።" }, isMajorNigis: true },
  { month: 3, day: 12, title: { en: "Hidar Saint Michael", am: "ኅዳር ሚካኤል" }, significance: { en: "Deliverance of the faithful through the intercession of Archangel Michael.", am: "የቅዱስ ሚካኤል ሊቀ መላእክት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 3, day: 21, title: { en: "Hidar Zion Saint Mary (Axum Tsion)", am: "ኅዳር ጽዮን ማርያም (አክሱም ጽዮን)" }, significance: { en: "The Ark of the Covenant arriving at Axum and St. Mary of Zion.", am: "ታቦተ ጽዮን ወደ አክሱም የገባችበት የታላቋ ጽዮን ማርያም ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Tahsas
  { month: 4, day: 3, title: { en: "Ba'eta Mariam (Entry to the Temple)", am: "በዓታ ለማርያም" }, significance: { en: "The presentation of 3-year-old Mary into the Holy of Holies.", am: "እመቤታችን በሦስት ዓመቷ ወደ ቤተ መቅደስ የገባችበት ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 4, day: 19, title: { en: "Tahsas Saint Gabriel (Kulubi Gabriel)", am: "ታኅሣሥ ገብርኤል (ቁልቢ ገብርኤል)" }, significance: { en: "Deliverance of the Three Holy Youths; Kulubi Pilgrimage.", am: "ሠለስቱ ደቂቅን ከእቶን እሳት ያዳነበትና የቁልቢ ገብርኤል ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 4, day: 29, title: { en: "Genna / Nativity of Our Lord Jesus Christ", am: "ልደተ ክርስቶስ / በዓለ ገና" }, significance: { en: "The Holy Nativity and Incarnation of Our Lord Jesus Christ.", am: "የጌታችን የመድኃኒታችን የኢየሱስ ክርስቶስ የልደት በዓል (ገና)።" }, isMajorNigis: true },

  // Tir
  { month: 5, day: 11, title: { en: "Timkat / Feast of the Epiphany", am: "ከተራ እና በዓለ ጥምቀት" }, significance: { en: "The Holy Baptism of Jesus Christ in the Jordan River.", am: "ጌታችን በዮርዳኖስ ወንዝ የተጠመቀበት ታላቅ የጥምቀት በዓል።" }, isMajorNigis: true },
  { month: 5, day: 12, title: { en: "Feast of Cana of Galilee / Saint Michael", am: "ቃና ዘገሊላ / ጥር ሚካኤል" }, significance: { en: "The first miracle of Jesus turning water into wine.", am: "ጌታችን በቃና ዘገሊላ ውኃውን ወደ ወይን የለወጠበትና የጥር ሚካኤል በዓል።" }, isMajorNigis: true },
  { month: 5, day: 21, title: { en: "Aster'eyo Mariam (Dormition of Saint Mary)", am: "አስተርእዮ ማርያም (ዕረፍተ ድንግል)" }, significance: { en: "The falling asleep (Dormition) of the Most Holy Theotokos.", am: "የእመቤታችን የቅድስት ድንግል ማርያም የዕረፍት ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Yekatit
  { month: 6, day: 16, title: { en: "Yekatit Kidane Mihret (Covenant of Mercy)", am: "የካቲት ኪዳነ ምሕረት" }, significance: { en: "The Great Covenant given by Christ to His Holy Mother.", am: "ጌታችን ለእመቤታችን በጎልጎታ የማትፈርሰውን ቃል ኪዳን የሰጠበት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Megabit
  { month: 7, day: 10, title: { en: "Manifestation of the Holy Cross", am: "መገለጸ መስቀል (ዕለተ መስቀል)" }, significance: { en: "The unearthing and revelation of the Holy Cross.", am: "ቅዱስ መስቀል ተቆፍሮ የወጣበት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 7, day: 27, title: { en: "Megabit Medhane Alem", am: "መጋቢት መድኃኔዓለም" }, significance: { en: "The Crucifixion and Redemption of mankind by Our Savior.", am: "ጌታችን ለዓለም ድኅነት በመስቀል ላይ የዋለበት መታሰቢያ።" }, isMajorNigis: true },
  { month: 7, day: 29, title: { en: "Feast of the Annunciation (Tsinset)", am: "በዓለ ጽንሰት (ብስራተ ገብርኤል)" }, significance: { en: "Archangel Gabriel announcing the Incarnation.", am: "ቅዱስ ገብርኤል ለእመቤታችን የልደተ ክርስቶስን ብስራት ያበሰረበት በዓል።" }, isMajorNigis: true },

  // Miyazya
  { month: 8, day: 23, title: { en: "Martyrdom of Saint George", am: "ሚያዝያ ቅዱስ ጊዮርጊስ (ዕረፍቱ)" }, significance: { en: "The crown of martyrdom received by Saint George.", am: "የሰማዕታት አለቃ የቅዱስ ጊዮርጊስ የዕረፍትና የሰማዕትነት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Ginbot
  { month: 9, day: 1, title: { en: "Lideta Mariam (Nativity of Saint Mary)", am: "ግንቦት ልደታ ለማርያም" }, significance: { en: "The miraculous birth of the Holy Virgin Mary.", am: "እመቤታችን ቅድስት ድንግል ማርያም የተወለደችበት ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 9, day: 12, title: { en: "Ginbot Saint Michael", am: "ግንቦት ሚካኤል" }, significance: { en: "Saint Michael assisting Habakkuk the prophet.", am: "የቅዱስ ሚካኤል ሊቀ መላእክት ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 9, day: 21, title: { en: "Debre Mitmaq Mariam", am: "ደብረ ምጥማቅ ማርያም" }, significance: { en: "Apparition of the Virgin Mary at Debre Mitmaq.", am: "እመቤታችን በደብረ ምጥማቅ ተገልጣ አምስት ቀን ሙሉ የተመሰገነችበት ታላቅ በዓል።" }, isMajorNigis: true },

  // Sene
  { month: 10, day: 12, title: { en: "Sene Saint Michael", am: "ሰኔ ሚካኤል" }, significance: { en: "Saint Michael saving Bahran.", am: "ቅዱስ ሚካኤል ባሕራንን ያዳነበትና ምልጃው የተገለጠበት ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 10, day: 20, title: { en: "Sene Golgota / Dedication of Church", am: "ሰኔ ጎልጎታ / ሕንጸተ ቤተ ክርስቲያን" }, significance: { en: "The Virgin Mary's prayer at Golgotha and first church consecration.", am: "እመቤታችን በጎልጎታ የጸለየችበትና የመጀመሪያዋ ቤተ ክርስቲያን የተመረቀችበት በዓል።" }, isMajorNigis: true },

  // Hamle
  { month: 11, day: 5, title: { en: "Saints Peter and Paul the Apostles", am: "ቅዱሳን ጴጥሮስ እና ጳውሎስ" }, significance: { en: "Martyrdom of Apostles Peter and Paul.", am: "የቅዱሳን ሐዋርያት የጴጥሮስና የጳውሎስ የሰማዕትነት ዓመታዊ በዓል።" }, isMajorNigis: true },
  { month: 11, day: 19, title: { en: "Hamle Saint Kirkos and Saint Iyalota", am: "ሐምሌ ቂርቆስ እና እየሉጣ" }, significance: { en: "Martyrdom of Saint Kirkos and his mother Iyalota.", am: "የሕፃኑ ቅዱስ ቂርቆስና የእናቱ ቅድስት እየሉጣ ታላቅ ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Nehase
  { month: 12, day: 7, title: { en: "Debre Tabor / Buhe (Transfiguration)", am: "ደብረ ታቦር / ቡሄ" }, significance: { en: "The Transfiguration of Our Lord Jesus Christ on Mount Tabor.", am: "ጌታችን በደብረ ታቦር ክብሩንና መለኮታዊ ብርሃኑን የገለጠበት ታላቅ በዓል።" }, isMajorNigis: true },
  { month: 12, day: 16, title: { en: "Filseta / Assumption of Saint Mary", am: "ፍልሰታ ለማርያም (ትንሣኤዋና ዕርገቷ)" }, significance: { en: "The assumption of the Blessed Virgin Mary into Heaven.", am: "የእመቤታችን የቅድስት ድንግል ማርያም የትንሣኤዋና የዕርገቷ ታላቅ የንግሥ በዓል።" }, isMajorNigis: true },
  { month: 12, day: 24, title: { en: "Repose of Abune Tekle Haymanot", am: "አቡነ ተክለ ሃይማኖት (ዕረፍታቸው)" }, significance: { en: "The holy repose of Saint Tekle Haymanot.", am: "የደብረ ሊባኖሱ ጻድቅ የአቡነ ተክለ ሃይማኖት የዕረፍት ዓመታዊ በዓል።" }, isMajorNigis: true },

  // Pagume
  { month: 13, day: 3, title: { en: "Pagume Saint Raphael the Archangel", am: "ጳጉሜን ቅዱስ ሩፋኤል" }, significance: { en: "Archangel Raphael blessing the water.", am: "የቅዱስ ሩፋኤል ሊቀ መላእክት ዓመታዊ በዓል እና የታቦት መታሰቢያ።" }, isMajorNigis: true },
];

export function getMonthlyCommemoration(day: number) {
  return monthlyCommemorations.find((entry) => entry.day === day);
}

export function getAnnualFeast(month: number, day: number): AnnualFeast | undefined {
  return majorAnnualFeasts.find((entry) => entry.month === month && entry.day === day);
}

export function isMajorFeastDay(date: EthiopianDate): boolean {
  return majorAnnualFeasts.some((entry) => entry.month === date.month && entry.day === date.day);
}

export function getTodayOrthodoxCommemoration(date: EthiopianDate) {
  const monthly = getMonthlyCommemoration(date.day);
  const annual = getAnnualFeast(date.month, date.day);
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
