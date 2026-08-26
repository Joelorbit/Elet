export type AppLanguage = "am" | "en";
export type ThemeMode = "system" | "light" | "dark" | "sacred-night";
export type AppLockMode = "app" | "confession" | "none";
export type AutoLockTimeout = "immediately" | "1_min" | "5_min" | "15_min" | "1_hour";

export type NoteCategory =
  | "sermon"
  | "prayer"
  | "verse"
  | "priest"
  | "gratitude"
  | "reflection"
  | "confession"
  | "service";

export type LocalizedText = Record<AppLanguage, string>;

export interface CustomFastPlan {
  id: string;
  title: string;
  startDateKey: string;
  endDateKey: string;
  targetDays: number;
  breakFastHour: number; // e.g. 15 for 3:00 PM
  breakFastMinute: number;
  notes?: string;
  completedDates: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CustomReadingPlan {
  id: string;
  title: LocalizedText;
  theme: LocalizedText;
  reference: string;
  reminderHour?: number;
  reminderMinute?: number;
  reminderEnabled?: boolean;
  completedDates: string[];
  custom: boolean;
}

export interface UserPreferences {
  language: AppLanguage;
  themeMode: ThemeMode;
  textScale: "standard" | "large";
  onboardingComplete: boolean;
  dailyReminderEnabled: boolean;
  reminderHour: number;
  reminderMinute?: number;
  feastReminderEnabled?: boolean;
  feastReminderHour?: number;
  prayerRemindersEnabled?: boolean;
  fastingRemindersEnabled?: boolean;
  readingRemindersEnabled?: boolean;
  streakProtectionReminderEnabled?: boolean;
  dailyVerseReminderEnabled?: boolean;
  appLockEnabled: boolean;
  appLockMode: AppLockMode;
  autoLockTimeout: AutoLockTimeout;
}

export interface PrayerRoutine {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  completedDates: string[];
  custom: boolean;
  reminderHour?: number;
  reminderMinute?: number;
  reminderEnabled?: boolean;
}

export interface FastingPreferences {
  breakFastHour: number; // e.g. 15 for 3:00 PM (9:00 local Ethiopian time)
  breakFastMinute: number;
  fastingReminderEnabled: boolean;
  customRules: string[];
  personalVowNote: string;
  customFastPlans: CustomFastPlan[];
}

export interface PenanceItem {
  id: string;
  title: string;
  targetCount?: number;
  currentCount?: number;
  frequency: "daily" | "weekly" | "until_confession";
  completed: boolean;
}

export interface SpiritualFatherProfile {
  name: string;
  church: string;
  phone: string;
  notes: string;
  nextConfessionDate?: string;
  penanceItems: PenanceItem[];
}

export interface ReadingProgress {
  completedIds: string[];
  reflections: Record<string, string>;
  favoriteIds: string[];
}

export interface JournalNote {
  id: string;
  title: string;
  body: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  sensitive: boolean;
}

export interface ConfessionSession {
  id: string;
  preparationDate: string;
  selectedPromptIds: string[];
  notes: string;
  questionsForPriest: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Intercession {
  id: string;
  name: string;
  intention: string;
  createdAt: string;
  updatedAt: string;
  prayedDates: string[];
  archived: boolean;
}

export interface AppStateData {
  preferences: UserPreferences;
  prayers: PrayerRoutine[];
  readingPlans?: CustomReadingPlan[];
  fastingPreferences?: FastingPreferences;
  spiritualFather?: SpiritualFatherProfile;
  readingProgress: ReadingProgress;
  dailyPracticeDates: string[];
  notes: JournalNote[];
  confessionSessions: ConfessionSession[];
  intercessions: Intercession[];
}

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}
