import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  AppLanguage,
  AppStateData,
  ConfessionSession,
  FastingPreferences,
  Intercession,
  JournalNote,
  PenanceItem,
  PrayerRoutine,
  ReadingProgress,
  SpiritualFatherProfile,
  ThemeMode,
  UserPreferences,
} from "@/src/types/app";
import { formatDateKey } from "@/src/features/streaks/utils/streaks";

const STORAGE_KEY = "@elet_state_v2";

const DEFAULT_PRAYERS: PrayerRoutine[] = [
  {
    id: "prayer-morning",
    title: { am: "የነግህ ጸሎት (1 ሰዓት)", en: "Morning Prayer (1st Hour - 7:00 AM)" },
    timeLabel: { am: "ጠዋት 1፡00", en: "7:00 AM" },
    completedDates: [],
    custom: false,
    reminderHour: 7,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-3rd",
    title: { am: "የሠለስት ጸሎት (3 ሰዓት)", en: "Third Hour Prayer (9:00 AM)" },
    timeLabel: { am: "ረፋድ 3፡00", en: "9:00 AM" },
    completedDates: [],
    custom: false,
    reminderHour: 9,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-noon",
    title: { am: "የቀትር ጸሎት (6 ሰዓት)", en: "Sixth Hour Prayer (Noon - 12:00 PM)" },
    timeLabel: { am: "ቀትር 6፡00", en: "12:00 PM" },
    completedDates: [],
    custom: false,
    reminderHour: 12,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-9th",
    title: { am: "የተስዓት ጸሎት (9 ሰዓት)", en: "Ninth Hour Prayer (3:00 PM)" },
    timeLabel: { am: "ከሰዓት 9፡00", en: "3:00 PM" },
    completedDates: [],
    custom: false,
    reminderHour: 15,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-evening",
    title: { am: "የሰርክ ጸሎት (11 ሰዓት)", en: "Evening Prayer (11th Hour - 5:00 PM)" },
    timeLabel: { am: "ምሽት 11፡00", en: "5:00 PM" },
    completedDates: [],
    custom: false,
    reminderHour: 17,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-bedtime",
    title: { am: "የንዋም ጸሎት (የመኝታ)", en: "Compline Prayer (Before Sleep)" },
    timeLabel: { am: "ምሽት 3፡00", en: "9:00 PM" },
    completedDates: [],
    custom: false,
    reminderHour: 21,
    reminderMinute: 0,
    reminderEnabled: true,
  },
  {
    id: "prayer-midnight",
    title: { am: "የመንፈቀ ሌሊት ጸሎት", en: "Midnight Office (መንፈቀ ሌሊት)" },
    timeLabel: { am: "እኩለ ሌሊት 6፡00", en: "12:00 AM" },
    completedDates: [],
    custom: false,
    reminderHour: 0,
    reminderMinute: 0,
    reminderEnabled: true,
  },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  language: "en",
  themeMode: "system",
  textScale: "standard",
  onboardingComplete: false, // Default false so fresh install & clear data land on Onboarding
  dailyReminderEnabled: true,
  reminderHour: 7,
  reminderMinute: 30,
  feastReminderEnabled: true,
  feastReminderHour: 7,
  prayerRemindersEnabled: true,
  fastingRemindersEnabled: true,
  appLockEnabled: false,
  appLockMode: "none",
  autoLockTimeout: "immediately",
};

const DEFAULT_FASTING: FastingPreferences = {
  breakFastHour: 15,
  breakFastMinute: 0,
  fastingReminderEnabled: true,
  customRules: [],
  personalVowNote: "",
};

const DEFAULT_SPIRITUAL_FATHER: SpiritualFatherProfile = {
  name: "",
  church: "",
  phone: "",
  notes: "",
  penanceItems: [
    {
      id: "pen-1",
      title: "41 Sagdet (ስግደት)",
      targetCount: 41,
      currentCount: 0,
      frequency: "daily",
      completed: false,
    },
    {
      id: "pen-2",
      title: "Psalm 50 (መዝሙር 50)",
      frequency: "daily",
      completed: false,
    },
  ],
};

interface AppStoreContextType {
  preferences: UserPreferences;
  prayers: PrayerRoutine[];
  fastingPreferences: FastingPreferences;
  spiritualFather: SpiritualFatherProfile;
  readingProgress: ReadingProgress;
  dailyPracticeDates: string[];
  notes: JournalNote[];
  confessionSessions: ConfessionSession[];
  intercessions: Intercession[];
  isReady: boolean;
  confessionLocked: boolean;
  setConfessionLocked: (locked: boolean) => void;
  setLanguage: (language: AppLanguage) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  togglePrayerCompletion: (prayerId: string) => void;
  addCustomPrayer: (prayer: { titleAm: string; titleEn: string; timeLabel: string; hour: number; minute?: number }) => void;
  updatePrayer: (id: string, patch: Partial<PrayerRoutine>) => void;
  deletePrayer: (id: string) => void;
  togglePenanceItem: (penanceId: string) => void;
  addPenanceItem: (title: string, targetCount?: number) => void;
  deletePenanceItem: (id: string) => void;
  setDailyReminder: (enabled: boolean, hour?: number, minute?: number) => Promise<boolean>;
  saveNote: (note: Omit<JournalNote, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  deleteNote: (id: string) => void;
  saveConfessionSession: (session: Omit<ConfessionSession, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  deleteConfessionSession: (id: string) => void;
  addIntercession: (name: string, intention: string) => void;
  togglePrayForIntercession: (id: string) => void;
  deleteIntercession: (id: string) => void;
  clearAllData: () => Promise<void>;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [prayers, setPrayers] = useState<PrayerRoutine[]>(DEFAULT_PRAYERS);
  const [fastingPreferences, setFastingPreferences] = useState<FastingPreferences>(DEFAULT_FASTING);
  const [spiritualFather, setSpiritualFather] = useState<SpiritualFatherProfile>(DEFAULT_SPIRITUAL_FATHER);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({
    completedIds: ["read-1"],
    reflections: {},
    favoriteIds: [],
  });
  const [dailyPracticeDates, setDailyPracticeDates] = useState<string[]>(() => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(formatDateKey(d));
    }
    return dates;
  });
  const [notes, setNotes] = useState<JournalNote[]>([
    {
      id: "note-welcome",
      title: "Welcome to Elet (እንኳን ወደ ዕለት በደህና መጡ)",
      body: "A sacred, offline spiritual companion built with orthodox canonical precision. Your notes, prayers, and confessions are stored 100% locally on this device.",
      category: "reflection",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: true,
      sensitive: false,
    },
  ]);
  const [confessionSessions, setConfessionSessions] = useState<ConfessionSession[]>([]);
  const [intercessions, setIntercessions] = useState<Intercession[]>([
    {
      id: "int-1",
      name: "Our Parish Priest & Deacons",
      intention: "For wisdom, strength, and blessings in church ministry.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      prayedDates: [formatDateKey(new Date())],
      archived: false,
    },
  ]);
  const [confessionLocked, setConfessionLocked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    async function loadStoredState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppStateData>;
          if (parsed.preferences) setPreferences((prev) => ({ ...prev, ...parsed.preferences }));
          if (parsed.prayers) setPrayers(parsed.prayers);
          if (parsed.fastingPreferences) setFastingPreferences(parsed.fastingPreferences);
          if (parsed.spiritualFather) setSpiritualFather(parsed.spiritualFather);
          if (parsed.readingProgress) setReadingProgress(parsed.readingProgress);
          if (parsed.dailyPracticeDates) setDailyPracticeDates(parsed.dailyPracticeDates);
          if (parsed.notes) setNotes(parsed.notes);
          if (parsed.confessionSessions) setConfessionSessions(parsed.confessionSessions);
          if (parsed.intercessions) setIntercessions(parsed.intercessions);
        }
      } catch {
        // Fallback to defaults
      } finally {
        setIsReady(true);
      }
    }
    void loadStoredState();
  }, []);

  // Save to AsyncStorage on change
  useEffect(() => {
    if (!isReady) return;
    const dataToStore: AppStateData = {
      preferences,
      prayers,
      fastingPreferences,
      spiritualFather,
      readingProgress,
      dailyPracticeDates,
      notes,
      confessionSessions,
      intercessions,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore)).catch(() => {});
  }, [
    isReady,
    preferences,
    prayers,
    fastingPreferences,
    spiritualFather,
    readingProgress,
    dailyPracticeDates,
    notes,
    confessionSessions,
    intercessions,
  ]);

  const setLanguage = useCallback((language: AppLanguage) => {
    setPreferences((prev) => ({ ...prev, language }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }));
  }, []);

  const togglePrayerCompletion = useCallback((prayerId: string) => {
    const todayKey = formatDateKey(new Date());
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== prayerId) return p;
        const exists = p.completedDates.includes(todayKey);
        const nextDates = exists
          ? p.completedDates.filter((d) => d !== todayKey)
          : [...p.completedDates, todayKey];
        return { ...p, completedDates: nextDates };
      })
    );
    setDailyPracticeDates((prev) => (prev.includes(todayKey) ? prev : [...prev, todayKey]));
  }, []);

  const addCustomPrayer = useCallback(
    ({
      titleAm,
      titleEn,
      timeLabel,
      hour,
      minute = 0,
    }: {
      titleAm: string;
      titleEn: string;
      timeLabel: string;
      hour: number;
      minute?: number;
    }) => {
      const newPrayer: PrayerRoutine = {
        id: `prayer-custom-${Date.now()}`,
        title: { am: titleAm || titleEn, en: titleEn || titleAm },
        timeLabel: { am: timeLabel, en: timeLabel },
        completedDates: [],
        custom: true,
        reminderHour: hour,
        reminderMinute: minute,
        reminderEnabled: true,
      };
      setPrayers((prev) => [...prev, newPrayer]);
    },
    []
  );

  const updatePrayer = useCallback((id: string, patch: Partial<PrayerRoutine>) => {
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deletePrayer = useCallback((id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const togglePenanceItem = useCallback((penanceId: string) => {
    setSpiritualFather((prev) => ({
      ...prev,
      penanceItems: prev.penanceItems.map((item) =>
        item.id === penanceId ? { ...item, completed: !item.completed } : item
      ),
    }));
  }, []);

  const addPenanceItem = useCallback((title: string, targetCount?: number) => {
    const newItem: PenanceItem = {
      id: `pen-${Date.now()}`,
      title,
      targetCount,
      currentCount: 0,
      frequency: "daily",
      completed: false,
    };
    setSpiritualFather((prev) => ({
      ...prev,
      penanceItems: [newItem, ...prev.penanceItems],
    }));
  }, []);

  const deletePenanceItem = useCallback((id: string) => {
    setSpiritualFather((prev) => ({
      ...prev,
      penanceItems: prev.penanceItems.filter((i) => i.id !== id),
    }));
  }, []);

  const setDailyReminder = useCallback(async (enabled: boolean, hour = 7, minute = 30) => {
    setPreferences((prev) => ({
      ...prev,
      dailyReminderEnabled: enabled,
      reminderHour: hour,
      reminderMinute: minute,
    }));
    return true;
  }, []);

  const saveNote = useCallback(
    (noteInput: Omit<JournalNote, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
      const now = new Date().toISOString();
      if (noteInput.id) {
        setNotes((prev) =>
          prev.map((n) => (n.id === noteInput.id ? { ...n, ...noteInput, updatedAt: now } : n))
        );
      } else {
        const newNote: JournalNote = {
          ...noteInput,
          id: `note-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        setNotes((prev) => [newNote, ...prev]);
      }
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const saveConfessionSession = useCallback(
    (sessionInput: Omit<ConfessionSession, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
      const now = new Date().toISOString();
      if (sessionInput.id) {
        setConfessionSessions((prev) =>
          prev.map((s) => (s.id === sessionInput.id ? { ...s, ...sessionInput, updatedAt: now } : s))
        );
      } else {
        const newSession: ConfessionSession = {
          ...sessionInput,
          id: `conf-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        setConfessionSessions((prev) => [newSession, ...prev]);
      }
    },
    []
  );

  const deleteConfessionSession = useCallback((id: string) => {
    setConfessionSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addIntercession = useCallback((name: string, intention: string) => {
    const now = new Date().toISOString();
    const newItem: Intercession = {
      id: `int-${Date.now()}`,
      name,
      intention,
      createdAt: now,
      updatedAt: now,
      prayedDates: [],
      archived: false,
    };
    setIntercessions((prev) => [newItem, ...prev]);
  }, []);

  const togglePrayForIntercession = useCallback((id: string) => {
    const todayKey = formatDateKey(new Date());
    setIntercessions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const exists = item.prayedDates.includes(todayKey);
        const nextDates = exists
          ? item.prayedDates.filter((d) => d !== todayKey)
          : [...item.prayedDates, todayKey];
        return { ...item, prayedDates: nextDates };
      })
    );
  }, []);

  const deleteIntercession = useCallback((id: string) => {
    setIntercessions((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
    setPreferences(DEFAULT_PREFERENCES);
    setPrayers(DEFAULT_PRAYERS);
    setFastingPreferences(DEFAULT_FASTING);
    setSpiritualFather(DEFAULT_SPIRITUAL_FATHER);
    setReadingProgress({ completedIds: [], reflections: {}, favoriteIds: [] });
    setDailyPracticeDates([]);
    setNotes([]);
    setConfessionSessions([]);
    setIntercessions([]);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      prayers,
      fastingPreferences,
      spiritualFather,
      readingProgress,
      dailyPracticeDates,
      notes,
      confessionSessions,
      intercessions,
      isReady,
      confessionLocked,
      setConfessionLocked,
      setLanguage,
      updatePreferences,
      togglePrayerCompletion,
      addCustomPrayer,
      updatePrayer,
      deletePrayer,
      togglePenanceItem,
      addPenanceItem,
      deletePenanceItem,
      setDailyReminder,
      saveNote,
      deleteNote,
      saveConfessionSession,
      deleteConfessionSession,
      addIntercession,
      togglePrayForIntercession,
      deleteIntercession,
      clearAllData,
    }),
    [
      preferences,
      prayers,
      fastingPreferences,
      spiritualFather,
      readingProgress,
      dailyPracticeDates,
      notes,
      confessionSessions,
      intercessions,
      isReady,
      confessionLocked,
      setConfessionLocked,
      setLanguage,
      updatePreferences,
      togglePrayerCompletion,
      addCustomPrayer,
      updatePrayer,
      deletePrayer,
      togglePenanceItem,
      addPenanceItem,
      deletePenanceItem,
      setDailyReminder,
      saveNote,
      deleteNote,
      saveConfessionSession,
      deleteConfessionSession,
      addIntercession,
      togglePrayForIntercession,
      deleteIntercession,
      clearAllData,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
}

export function useAppLanguage(): AppLanguage {
  return useAppStore().preferences.language;
}

export function useTodayKey(): string {
  return formatDateKey(new Date());
}
