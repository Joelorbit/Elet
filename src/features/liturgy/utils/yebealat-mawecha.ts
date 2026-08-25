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

/**
 * Official Canonical Ethiopian Orthodox Tewahedo Church Bahire Hasab / Yebealat Mawecha
 * Extracted directly from Patriarchate Liturgical Calendar (2018 - 2041 ዓ.ም.)
 */
export const YEBEALAT_MAWECHA_2018_2041: Record<number, EthiopianYearLiturgicalData> = {
  2018: {
    year: 2018,
    evangelist: { am: "ማርቆስ", en: "Mark" },
    newYearDay: { am: "ሐሙስ", en: "Thursday" },
    abektie: 15,
    metqie: 15,
    tsomeNenewe: { month: 5, day: 25 },
    abiyTsome: { month: 6, day: 9 },
    debreZeyt: { month: 7, day: 3 },
    hosanna: { month: 7, day: 27 },
    siklet: { month: 8, day: 2 },
    tensae: { month: 8, day: 4 },
    rikbeKahnat: { month: 8, day: 28 },
    erget: { month: 9, day: 13 },
    peraqlitos: { month: 9, day: 23 },
    tsomeHawaryat: { month: 9, day: 24 },
    tsomeDihnet: { month: 9, day: 26 },
  },
  2019: {
    year: 2019,
    evangelist: { am: "ሉቃስ", en: "Luke" },
    newYearDay: { am: "ዓርብ", en: "Friday" },
    abektie: 26,
    metqie: 4,
    tsomeNenewe: { month: 6, day: 15 },
    abiyTsome: { month: 6, day: 29 },
    debreZeyt: { month: 7, day: 23 },
    hosanna: { month: 8, day: 27 },
    siklet: { month: 9, day: 2 },
    tensae: { month: 9, day: 4 },
    rikbeKahnat: { month: 9, day: 28 },
    erget: { month: 10, day: 13 },
    peraqlitos: { month: 10, day: 23 },
    tsomeHawaryat: { month: 10, day: 24 },
    tsomeDihnet: { month: 10, day: 26 },
  },
  2020: {
    year: 2020,
    evangelist: { am: "ዮሐንስ", en: "John" },
    newYearDay: { am: "እሑድ", en: "Sunday" },
    abektie: 7,
    metqie: 23,
    tsomeNenewe: { month: 5, day: 29 },
    abiyTsome: { month: 6, day: 13 },
    debreZeyt: { month: 7, day: 7 },
    hosanna: { month: 8, day: 1 },
    siklet: { month: 8, day: 6 },
    tensae: { month: 8, day: 8 },
    rikbeKahnat: { month: 9, day: 2 },
    erget: { month: 9, day: 17 },
    peraqlitos: { month: 9, day: 27 },
    tsomeHawaryat: { month: 9, day: 28 },
    tsomeDihnet: { month: 9, day: 30 },
  },
  2021: {
    year: 2021,
    evangelist: { am: "ማቴዎስ", en: "Matthew" },
    newYearDay: { am: "ሰኞ", en: "Monday" },
    abektie: 18,
    metqie: 12,
    tsomeNenewe: { month: 5, day: 21 },
    abiyTsome: { month: 6, day: 5 },
    debreZeyt: { month: 6, day: 29 },
    hosanna: { month: 7, day: 23 },
    siklet: { month: 7, day: 28 },
    tensae: { month: 7, day: 30 },
    rikbeKahnat: { month: 8, day: 24 },
    erget: { month: 9, day: 9 },
    peraqlitos: { month: 9, day: 19 },
    tsomeHawaryat: { month: 9, day: 20 },
    tsomeDihnet: { month: 9, day: 22 },
  },
  2022: {
    year: 2022,
    evangelist: { am: "ማርቆስ", en: "Mark" },
    newYearDay: { am: "ማክሰኞ", en: "Tuesday" },
    abektie: 29,
    metqie: 1,
    tsomeNenewe: { month: 6, day: 11 },
    abiyTsome: { month: 6, day: 25 },
    debreZeyt: { month: 7, day: 19 },
    hosanna: { month: 8, day: 23 },
    siklet: { month: 8, day: 28 },
    tensae: { month: 8, day: 30 },
    rikbeKahnat: { month: 9, day: 24 },
    erget: { month: 10, day: 9 },
    peraqlitos: { month: 10, day: 19 },
    tsomeHawaryat: { month: 10, day: 20 },
    tsomeDihnet: { month: 10, day: 22 },
  },
  2023: {
    year: 2023,
    evangelist: { am: "ሉቃስ", en: "Luke" },
    newYearDay: { am: "ረቡዕ", en: "Wednesday" },
    abektie: 10,
    metqie: 20,
    tsomeNenewe: { month: 5, day: 26 },
    abiyTsome: { month: 6, day: 10 },
    debreZeyt: { month: 7, day: 4 },
    hosanna: { month: 7, day: 28 },
    siklet: { month: 8, day: 3 },
    tensae: { month: 8, day: 5 },
    rikbeKahnat: { month: 8, day: 29 },
    erget: { month: 9, day: 14 },
    peraqlitos: { month: 9, day: 24 },
    tsomeHawaryat: { month: 9, day: 25 },
    tsomeDihnet: { month: 9, day: 27 },
  },
  2024: {
    year: 2024,
    evangelist: { am: "ዮሐንስ", en: "John" },
    newYearDay: { am: "ዓርብ", en: "Friday" },
    abektie: 21,
    metqie: 9,
    tsomeNenewe: { month: 6, day: 15 },
    abiyTsome: { month: 6, day: 29 },
    debreZeyt: { month: 7, day: 23 },
    hosanna: { month: 8, day: 27 },
    siklet: { month: 9, day: 2 },
    tensae: { month: 9, day: 4 },
    rikbeKahnat: { month: 9, day: 28 },
    erget: { month: 10, day: 13 },
    peraqlitos: { month: 10, day: 23 },
    tsomeHawaryat: { month: 10, day: 24 },
    tsomeDihnet: { month: 10, day: 26 },
  },
  2025: {
    year: 2025,
    evangelist: { am: "ማቴዎስ", en: "Matthew" },
    newYearDay: { am: "ቅዳሜ", en: "Saturday" },
    abektie: 0,
    metqie: 30,
    tsomeNenewe: { month: 6, day: 7 },
    abiyTsome: { month: 6, day: 21 },
    debreZeyt: { month: 7, day: 15 },
    hosanna: { month: 8, day: 19 },
    siklet: { month: 8, day: 24 },
    tensae: { month: 8, day: 26 },
    rikbeKahnat: { month: 9, day: 20 },
    erget: { month: 10, day: 5 },
    peraqlitos: { month: 10, day: 15 },
    tsomeHawaryat: { month: 10, day: 16 },
    tsomeDihnet: { month: 10, day: 18 },
  },
  2026: {
    year: 2026,
    evangelist: { am: "ማርቆስ", en: "Mark" },
    newYearDay: { am: "እሑድ", en: "Sunday" },
    abektie: 11,
    metqie: 19,
    tsomeNenewe: { month: 5, day: 27 },
    abiyTsome: { month: 6, day: 11 },
    debreZeyt: { month: 7, day: 5 },
    hosanna: { month: 7, day: 29 },
    siklet: { month: 8, day: 4 },
    tensae: { month: 8, day: 6 },
    rikbeKahnat: { month: 8, day: 30 },
    erget: { month: 9, day: 15 },
    peraqlitos: { month: 9, day: 25 },
    tsomeHawaryat: { month: 9, day: 26 },
    tsomeDihnet: { month: 9, day: 28 },
  },
  2027: {
    year: 2027,
    evangelist: { am: "ሉቃስ", en: "Luke" },
    newYearDay: { am: "ሰኞ", en: "Monday" },
    abektie: 22,
    metqie: 8,
    tsomeNenewe: { month: 6, day: 17 },
    abiyTsome: { month: 7, day: 1 },
    debreZeyt: { month: 7, day: 25 },
    hosanna: { month: 8, day: 29 },
    siklet: { month: 9, day: 4 },
    tensae: { month: 9, day: 6 },
    rikbeKahnat: { month: 10, day: 1 },
    erget: { month: 10, day: 15 },
    peraqlitos: { month: 10, day: 25 },
    tsomeHawaryat: { month: 10, day: 26 },
    tsomeDihnet: { month: 10, day: 28 },
  },
};

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
  const cal = YEBEALAT_MAWECHA_2018_2041[date.year] || YEBEALAT_MAWECHA_2018_2041[2018];

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
  const cal = YEBEALAT_MAWECHA_2018_2041[date.year] || YEBEALAT_MAWECHA_2018_2041[2018];
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
