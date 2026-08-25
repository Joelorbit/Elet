import Constants from "expo-constants";
import { Platform } from "react-native";
import type * as NotificationsModule from "expo-notifications";

import type { AppLanguage, AppStateData } from "@/src/types/app";

type NotificationsApi = typeof NotificationsModule;
let notificationsApi: NotificationsApi | null = null;
let handlerConfigured = false;

async function getNotifications(): Promise<NotificationsApi | null> {
  // Gracefully avoid loading notifications on web or environments without native notification service
  if (Platform.OS === "web" || Constants.appOwnership === "expo") return null;
  try {
    notificationsApi ??= await import("expo-notifications");
    if (!handlerConfigured) {
      notificationsApi.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      handlerConfigured = true;
    }
    return notificationsApi;
  } catch {
    return null;
  }
}

const REMINDER_CHANNEL = "daily-practice";
const PRAYER_CHANNEL = "prayer-routine";
const FEAST_CHANNEL = "orthodox-feasts";

export async function ensureNotificationChannels(language: AppLanguage) {
  if (Platform.OS !== "android") return;
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
    name: language === "am" ? "የዕለት ማሳሰቢያ" : "Daily reminder",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: "#8E4424",
  });
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL, {
    name: language === "am" ? "የጸሎት ሰዓት ማሳሰቢያ" : "Prayer routine alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 150, 250],
    lightColor: "#C58936",
  });
  await Notifications.setNotificationChannelAsync(FEAST_CHANNEL, {
    name: language === "am" ? "የዕለቱ በዓልና ታቦት ማሳሰቢያ" : "Daily feast and saints alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: "#8E4424",
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === "granted") return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === "granted";
  } catch {
    return false;
  }
}

function dailyTrigger(Notifications: NotificationsApi, hour: number, minute: number, channelId: string) {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
    channelId,
  } satisfies NotificationsModule.DailyTriggerInput;
}

function practiceContent(language: AppLanguage) {
  return {
    title: language === "am" ? "ዕለት — የዕለት ማሳሰቢያ" : "Elet — Daily Reminder",
    body: language === "am" ? "ለአጭር ጸሎት ወይም ንባብ ጸጥ ያለ ጊዜ ይውሰዱ።" : "Take a quiet moment for prayer or reading.",
    data: { route: "/(tabs)/practice" },
  };
}

export async function configureDailyReminder(language: AppLanguage, hour: number, minute = 0): Promise<boolean> {
  if (Platform.OS === "web") return true;
  try {
    const Notifications = await getNotifications();
    if (!Notifications) return false;
    await ensureNotificationChannels(language);
    if (!(await requestNotificationPermission())) return false;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: practiceContent(language),
      trigger: dailyTrigger(Notifications, hour, minute, REMINDER_CHANNEL),
    });
    return true;
  } catch {
    return false;
  }
}

export async function syncAllAppReminders(state: AppStateData): Promise<boolean> {
  if (Platform.OS === "web") return true;
  try {
    const Notifications = await getNotifications();
    if (!Notifications) return false;
    const { preferences, prayers, fastingPreferences } = state;
    const language = preferences.language;
    await ensureNotificationChannels(language);
    if (!(await requestNotificationPermission())) return false;
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (preferences.dailyReminderEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: practiceContent(language),
        trigger: dailyTrigger(Notifications, preferences.reminderHour ?? 7, preferences.reminderMinute ?? 0, REMINDER_CHANNEL),
      });
    }

    if (preferences.prayerRemindersEnabled !== false) {
      for (const prayer of prayers) {
        if (!prayer.reminderEnabled || prayer.reminderHour === undefined) continue;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: prayer.title[language] || prayer.title.en,
            body: language === "am" ? "የጸሎት ሰዓት ደርሷል — በጸጥታ ወደ እግዚአብሔር እናቅርብ።" : "Time for prayer devotion — take a peaceful moment.",
            data: { route: "/practice/prayer" },
          },
          trigger: dailyTrigger(Notifications, prayer.reminderHour, prayer.reminderMinute ?? 0, PRAYER_CHANNEL),
        });
      }
    }

    if (preferences.feastReminderEnabled !== false) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "የዕለቱ በዓልና መታሰቢያ" : "Daily Orthodox Feast & Commemoration",
          body: language === "am" ? "የዕለቱን ታቦትና በዓል በካሌንደርዎ ይመልከቱ።" : "Check today's Saint commemoration and liturgical feast.",
          data: { route: "/(tabs)/calendar" },
        },
        trigger: dailyTrigger(Notifications, preferences.feastReminderHour ?? 7, 30, FEAST_CHANNEL),
      });
    }

    if (fastingPreferences?.fastingReminderEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "የጾም ሰዓት ተፈጽሟል" : "Fasting Break Time",
          body: language === "am" ? "ጾማችንንና ጸሎታችንን ይቀበልልን። በረከቱ ይደርብን።" : "Fasting target reached. May your prayers and fast be blessed.",
          data: { route: "/practice/fasting" },
        },
        trigger: dailyTrigger(Notifications, fastingPreferences.breakFastHour ?? 15, fastingPreferences.breakFastMinute ?? 0, REMINDER_CHANNEL),
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function sendImmediateTestNotification(language: AppLanguage): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const Notifications = await getNotifications();
    if (!Notifications) return false;
    await ensureNotificationChannels(language);
    if (!(await requestNotificationPermission())) return false;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: language === "am" ? "ዕለት — ማሳሰቢያ" : "Elet — Spiritual Reminder",
        body: language === "am" ? "የጸሎትና የበዓላት ማሳሰቢያ ደወሎች በትክክል ተዋቅረዋል ✓" : "Prayer and feast alarms are now active on your device ✓",
        data: { route: "/(tabs)" },
      },
      trigger: null,
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyReminder() {
  if (Platform.OS === "web") return;
  try {
    const Notifications = await getNotifications();
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Graceful fallback
  }
}
