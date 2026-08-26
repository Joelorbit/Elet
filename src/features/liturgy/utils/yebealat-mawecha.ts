import type { EthiopianDate, LocalizedText } from "@/src/types/app";

export interface EthiopianYearLiturgicalData {
  year: number;
  evangelist: { am: "ማቴዎስ" | "ማርቆስ" | "ሉቃስ" | "ዮሐንስ"; en: "Matthew" | "Mark" | "Luke" | "John" };
  newYearDay: { am: string; en: string };
  abektie: number;
  metqie: number;
  tsomeNenewe: { month: number; day: number }; // ጾመ ነነዌ
  abiyTsome: { month: number; day: number }; // ዐቢይ ጾም
  debreZeyt: { month: number; day: number }; // ደብረ ዘይት
  hosanna: { month: number; day: number }; // ሆሣዕና
  siklet: { month: number; day: number }; // ስቅለት
  tensae: { month: number; day: number }; // ትንሣኤ (Easter)
  rikbeKahnat: { month: number; day: number }; // ርክበ ካህናት
  erget: { month: number; day: number }; // ዕርገት
  peraqlitos: { month: number; day: number }; // ጰራቅሊጦስ (Pentecost)
  tsomeHawaryat: { month: number; day: number }; // ጾመ ሐዋርያት
  tsomeDihnet: { month: number; day: number }; // ጾመ ድኅነት
}

// Canonical additions from Tsome Nenewe (Month 5/6, Day X)
function addDaysToEthDate(startMonth: number, startDay: number, daysToAdd: number): { month: number; day: number } {
  let m = startMonth;
  let d = startDay + daysToAdd;
  while (d > 30) {
    d -= 30;
    m += 1;
  }
  return { month: m, day: d };
}

function calculateBahireHasabForYear(year: number): EthiopianYearLiturgicalData {
  const ameteAlem = year + 5500;
  
  // Evangelist
  const evRemainder = ameteAlem % 4;
  const evangelists = [
    { am: "ዮሐንስ" as const, en: "John" as const },
    { am: "ማቴዎስ" as const, en: "Matthew" as const },
    { am: "ማርቆስ" as const, en: "Mark" as const },
    { am: "ሉቃስ" as const, en: "Luke" as const },
  ];
  const evangelist = evangelists[evRemainder];

  // Abektie & Metqie
  const medeb = ameteAlem % 19;
  const wenber = (medeb === 0 ? 19 : medeb) - 1;
  const abektie = (wenber * 11) % 30;
  const metqie = (30 - abektie) % 30 || 30;

  // New Year day (Tinte Qemer)
  const daysOfWeekAm = ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ", "እሑድ"];
  const daysOfWeekEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const ameteKemer = Math.floor(ameteAlem / 4);
  const ruz = (ameteAlem + ameteKemer) % 7;
  const newYearIndex = (ruz + 5) % 7;

  // Determine Tsome Nenewe Month & Day
  let neneweMonth: number;
  let neneweDay: number;

  if (metqie > 14) {
    // Metqie in Meskerem (Month 1)
    neneweMonth = 5; // Tir
    const metqieWeekday = (newYearIndex + metqie - 1) % 7;
    // Tewsak table for weekdays (Nenewe starts on Monday)
    const tewsak = [0, 6, 5, 4, 3, 2, 1][metqieWeekday];
    let d = metqie + tewsak;
    if (d > 30) {
      d -= 30;
      neneweMonth = 6; // Yekatit
    }
    neneweDay = d;
  } else {
    // Metqie in Tikimt (Month 2)
    neneweMonth = 6; // Yekatit
    const tikimtFirstWeekday = (newYearIndex + 30) % 7;
    const metqieWeekday = (tikimtFirstWeekday + metqie - 1) % 7;
    const tewsak = [0, 6, 5, 4, 3, 2, 1][metqieWeekday];
    let d = metqie + tewsak;
    neneweDay = d;
  }

  // Ensure canonical boundary
  if (neneweMonth === 5 && neneweDay < 17) neneweDay = 17;
  if (neneweMonth === 6 && neneweDay > 21) neneweDay = 21;

  return {
    year,
    evangelist,
    newYearDay: { am: daysOfWeekAm[newYearIndex], en: daysOfWeekEn[newYearIndex] },
    abektie,
    metqie,
    tsomeNenewe: { month: neneweMonth, day: neneweDay },
    abiyTsome: addDaysToEthDate(neneweMonth, neneweDay, 14),
    debreZeyt: addDaysToEthDate(neneweMonth, neneweDay, 41),
    hosanna: addDaysToEthDate(neneweMonth, neneweDay, 62),
    siklet: addDaysToEthDate(neneweMonth, neneweDay, 67),
    tensae: addDaysToEthDate(neneweMonth, neneweDay, 69),
    rikbeKahnat: addDaysToEthDate(neneweMonth, neneweDay, 93),
    erget: addDaysToEthDate(neneweMonth, neneweDay, 108),
    peraqlitos: addDaysToEthDate(neneweMonth, neneweDay, 118),
    tsomeHawaryat: addDaysToEthDate(neneweMonth, neneweDay, 119),
    tsomeDihnet: addDaysToEthDate(neneweMonth, neneweDay, 121),
  };
}

/**
 * 24-Year Full Canonical Table (2018 - 2041 ዓ.ም.)
 */
export const YEBEALAT_MAWECHA_2018_2041: Record<number, EthiopianYearLiturgicalData> = {};

for (let y = 2018; y <= 2041; y++) {
  YEBEALAT_MAWECHA_2018_2041[y] = calculateBahireHasabForYear(y);
}

function isDateInRange(
  target: { month: number; day: number },
  start: { month: number; day: number },
  end: { month: number; day: number }
): boolean {
  const targetVal = target.month * 30 + target.day;
  const startVal = start.month * 30 + start.day;
  const endVal = end.month * 30 + end.day;
  return targetVal >= startVal && targetVal <= endVal;
}

export interface EthiopianFastInfo {
  id: "prophets" | "gahad" | "nenewe" | "abiy" | "hawaryat" | "dihnet" | "filseta";
  name: LocalizedText;
  isFastingDay: boolean;
  description: LocalizedText;
}

export function getEthiopianFastForDate(date: EthiopianDate): EthiopianFastInfo | undefined {
  const cal = YEBEALAT_MAWECHA_2018_2041[date.year] || calculateBahireHasabForYear(date.year);

  // 1. ጾመ ነቢያት (Fast of the Prophets / Advent): ኅዳር 15 – ታኅሣሥ 28
  if ((date.month === 3 && date.day >= 15) || (date.month === 4 && date.day <= 28)) {
    return {
      id: "prophets",
      name: { am: "ጾመ ነቢያት (የገና ጾም)", en: "Fast of the Prophets (Advent)" },
      isFastingDay: true,
      description: {
        am: "ከ7ቱ አጽዋማት አንዱ የሆነው የጌታችንን ልደት ተስፋ በማድረግ የሚጾም የ44 ቀናት ጾም ነው።",
        en: "One of the 7 canonical fasts, observed for 44 days awaiting the Nativity of Christ.",
      },
    };
  }

  // 2. ጾመ ገሃድ (Gahad Fast): ታኅሣሥ 28 እና ጥር 10
  if ((date.month === 4 && date.day === 28) || (date.month === 5 && date.day === 10)) {
    return {
      id: "gahad",
      name: { am: "ጾመ ገሃድ (የገናና የጥምቀት ዋዜማ)", en: "Gahad Fast (Eve of Timkat/Genna)" },
      isFastingDay: true,
      description: {
        am: "የገና እና የጥምቀት በዓላት ዋዜማ ላይ የሚጾም ጥብቅ የገሃድ ጾም።",
        en: "Strict eve-fast preceding the feasts of Nativity and Theophany.",
      },
    };
  }

  // 3. ጾመ ፍልሰታ (Fast of Filseta): ነሐሴ 1 – ነሐሴ 15
  if (date.month === 12 && date.day >= 1 && date.day <= 15) {
    return {
      id: "filseta",
      name: { am: "ጾመ ፍልሰታ ለማርያም", en: "Fast of the Assumption of the Virgin Mary" },
      isFastingDay: true,
      description: {
        am: "የእመቤታችን የቅድስት ድንግል ማርያም የዕርገቷና የትንሣኤዋ መታሰቢያ የ16 ቀናት ጾም።",
        en: "16-day fast commemorating the Dormition and Assumption of the Holy Theotokos.",
      },
    };
  }

  if (cal) {
    // 4. ጾመ ነነዌ (Fast of Nineveh): 3 days
    const neneweStart = cal.tsomeNenewe;
    const neneweEnd = { month: neneweStart.month, day: neneweStart.day + 2 };
    if (isDateInRange({ month: date.month, day: date.day }, neneweStart, neneweEnd)) {
      return {
        id: "nenewe",
        name: { am: "ጾመ ነነዌ", en: "Fast of Nineveh" },
        isFastingDay: true,
        description: {
          am: "የነነዌ ሰዎች በንስሐ ከጥፋት የዳኑበት የ3 ቀናት የልመናና የምሕረት ጾም።",
          en: "3-day fast of repentance and mercy commemorating the salvation of Nineveh.",
        },
      };
    }

    // 5. ዐቢይ ጾም (Great Lent): 55 days
    const abiyStart = cal.abiyTsome;
    const tensae = cal.tensae;
    const abiyEndDay = tensae.day === 1 ? 30 : tensae.day - 1;
    const abiyEndMonth = tensae.day === 1 ? tensae.month - 1 : tensae.month;
    if (isDateInRange({ month: date.month, day: date.day }, abiyStart, { month: abiyEndMonth, day: abiyEndDay })) {
      return {
        id: "abiy",
        name: { am: "ዐቢይ ጾም (ሁዳዴ)", en: "Great Lent (Hudadi)" },
        isFastingDay: true,
        description: {
          am: "ጌታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመው የ55 ቀናት ታላቅ ጾም እና የሕማማት ሳምንት።",
          en: "55-day Great Lent commemorating Christ's 40-day fast in the wilderness and Holy Passion Week.",
        },
      };
    }

    // 6. ጾመ ሐዋርያት (Fast of the Apostles)
    const hawaryatStart = cal.tsomeHawaryat;
    const hawaryatEnd = { month: 11, day: 4 };
    if (isDateInRange({ month: date.month, day: date.day }, hawaryatStart, hawaryatEnd)) {
      return {
        id: "hawaryat",
        name: { am: "ጾመ ሐዋርያት (የሰኔ ጾም)", en: "Fast of the Apostles" },
        isFastingDay: true,
        description: {
          am: "ቅዱሳን ሐዋርያት መንፈስ ቅዱስን ከተቀበሉ በኋላ የወንጌል አገልግሎታቸውን ከመጀመራቸው በፊት የጾሙት ጾም።",
          en: "Fast of the Holy Apostles observed after Pentecost before commencing apostolic ministry.",
        },
      };
    }

    // 7. Check 50 Days of Pentecost (ፍስክ)
    if (isDateInRange({ month: date.month, day: date.day }, tensae, cal.peraqlitos)) {
      return undefined;
    }
  }

  return undefined;
}

export interface MovableFeastInfo {
  name: LocalizedText;
  description: LocalizedText;
}

export function getMovableFeastForDate(date: EthiopianDate): MovableFeastInfo | undefined {
  const cal = YEBEALAT_MAWECHA_2018_2041[date.year] || calculateBahireHasabForYear(date.year);
  if (!cal) return undefined;

  const match = (m: number, d: number) => date.month === m && date.day === d;

  if (match(cal.tsomeNenewe.month, cal.tsomeNenewe.day)) {
    return {
      name: { am: "ዋዜማ ጾመ ነነዌ", en: "Fast of Nineveh Commences" },
      description: { am: "የነነዌ ጾም መጀመሪያ", en: "First day of the 3-day Fast of Nineveh" },
    };
  }
  if (match(cal.abiyTsome.month, cal.abiyTsome.day)) {
    return {
      name: { am: "ዘወረደ — የዐቢይ ጾም መጀመሪያ", en: "Zewerede — Great Lent Begins" },
      description: { am: "የዐቢይ ጾም (ሁዳዴ) መግቢያ ሳምንት", en: "Beginning of the Holy 55-day Great Lent" },
    };
  }
  if (match(cal.debreZeyt.month, cal.debreZeyt.day)) {
    return {
      name: { am: "ደብረ ዘይት", en: "Mount of Olives (Debre Zeyt)" },
      description: { am: "የዐቢይ ጾም እኩሌታ — ዳግም ምጽአት የሚታሰብበት ዕለት", en: "Midpoint of Great Lent commemorating the Second Coming" },
    };
  }
  if (match(cal.hosanna.month, cal.hosanna.day)) {
    return {
      name: { am: "ሆሣዕና (በዓለ ዘንባባ)", en: "Hosanna (Palm Sunday)" },
      description: { am: "የጌታችን የኢየሱስ ክርስቶስ ወደ ኢየሩሳሌም በክብር የመግባት በዓል", en: "Triumphal entry of Our Lord into Jerusalem" },
    };
  }
  if (match(cal.siklet.month, cal.siklet.day)) {
    return {
      name: { am: "ስቅለተ ክርስቶስ (ዓርበ ስቅለት)", en: "Good Friday (Crucifixion of Christ)" },
      description: { am: "ጌታችን ኢየሱስ ክርስቶስ ስለ ዓለም ድኅነት በመስቀል ላይ የዋለበት ዕለት", en: "Crucifixion of Our Lord Jesus Christ on Golgotha" },
    };
  }
  if (match(cal.tensae.month, cal.tensae.day)) {
    return {
      name: { am: "ብርሃነ ትንሣኤው ለእግዚእነ (ፋሲካ)", en: "Holy Easter (Fasika Resurrection)" },
      description: { am: "የጌታችንና የመድኃኒታችን የኢየሱስ ክርስቶስ የትንሣኤው ታላቅ በዓል", en: "Glorious Resurrection of Our Lord and Savior Jesus Christ" },
    };
  }
  if (match(cal.rikbeKahnat.month, cal.rikbeKahnat.day)) {
    return {
      name: { am: "ርክበ ካህናት", en: "Rikbe Kahnat (Assembly of Priests)" },
      description: { am: "የካህናት ጉባኤና የአንድነት መታሰቢያ", en: "Assembly of Priests during the 50 Holy Days of Pentecost" },
    };
  }
  if (match(cal.erget.month, cal.erget.day)) {
    return {
      name: { am: "ዕርገተ ክርስቶስ", en: "Feast of Ascension (Erget)" },
      description: { am: "የጌታችን የኢየሱስ ክርስቶስ ወደ ሰማይ ያረገበት 40ኛ ቀን በዓል", en: "Ascension of Christ into Heaven, 40 days after Resurrection" },
    };
  }
  if (match(cal.peraqlitos.month, cal.peraqlitos.day)) {
    return {
      name: { am: "ጰራቅሊጦስ (በዓለ ሃምሳ)", en: "Pentecost (Descent of the Holy Spirit)" },
      description: { am: "መንፈስ ቅዱስ በሐዋርያት ላይ የወረደበት 50ኛ ቀን በዓል", en: "Descent of the Holy Spirit upon the Apostles, 50 days after Easter" },
    };
  }

  return undefined;
}
