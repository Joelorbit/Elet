import { Platform } from "react-native";
import type * as NotificationsModule from "expo-notifications";
import type { useAppStore } from "@/src/features/settings/store/app-store";
import { getMonthlyCommemoration, getAnnualFeast } from "@/src/features/liturgy/utils/monthly-commemorations";
import { gregorianToEthiopian } from "@/src/features/liturgy/utils/calendar";
import { getDailyBibleReference } from "@/src/features/bible/utils/daily-bible";

let notificationsApi: typeof NotificationsModule | null = null;

async function getNotificationsApi() {
  if (Platform.OS === "web") return null;
  if (!notificationsApi) {
    try {
      notificationsApi = await import("expo-notifications");
      notificationsApi.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      return null;
    }
  }
  return notificationsApi;
}

const DAILY_CHANNEL = "daily-practice";
const PRAYER_CHANNEL = "prayer-routine";
const FEAST_CHANNEL = "orthodox-feasts";
const FASTING_CHANNEL = "fasting-alerts";
const SCRIPTURE_CHANNEL = "daily-scripture";

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotificationsApi();
  if (!Notifications) return false;

  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }
    const request = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return (
      request.granted ||
      request.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      false
    );
  } catch {
    return false;
  }
}

export async function setupNotificationChannels(): Promise<void> {
  const Notifications = await getNotificationsApi();
  if (!Notifications || Platform.OS !== "android") return;

  try {
    await Notifications.setNotificationChannelAsync(DAILY_CHANNEL, {
      name: "Daily Practice & Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#8E4424",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL, {
      name: "Seven Prayer Hours (ሰዓታት)",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 300, 200, 300],
      lightColor: "#C89D42",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync(FEAST_CHANNEL, {
      name: "Daily Tabot & Feasts",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#2D6A4F",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync(FASTING_CHANNEL, {
      name: "Fasting Alarms & Break Times",
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#C89D42",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync(SCRIPTURE_CHANNEL, {
      name: "Daily Holy Scripture",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#8E4424",
      sound: "default",
    });
  } catch {
    // Ignore channel creation errors
  }
}

function dailyTrigger(
  Notifications: typeof NotificationsModule,
  hour: number,
  minute: number,
  channelId: string
): NotificationsModule.NotificationTriggerInput {
  if (Platform.OS === "android") {
    return {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId,
    };
  }
  return {
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
    hour,
    minute,
    repeats: true,
  };
}

export interface ReminderSyncPayload {
  preferences: import("@/src/types/app").UserPreferences;
  prayers: import("@/src/types/app").PrayerRoutine[];
  readingPlans?: import("@/src/types/app").CustomReadingPlan[];
  fastingPreferences?: import("@/src/types/app").FastingPreferences;
}

export async function syncAllAppReminders(store: ReminderSyncPayload): Promise<void> {
  const Notifications = await getNotificationsApi();
  if (!Notifications) return;

  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;

    await setupNotificationChannels();
    await Notifications.cancelAllScheduledNotificationsAsync();

    const { preferences, prayers, readingPlans, fastingPreferences } = store;
    const language = preferences.language;
    const now = new Date();
    const ethDate = gregorianToEthiopian(now);
    const commemoration = getMonthlyCommemoration(ethDate.day);
    const annualFeast = getAnnualFeast(ethDate.month, ethDate.day);
    const dailyBible = getDailyBibleReference(now, language);

    // 1. Daily Morning Reminder
    if (preferences.dailyReminderEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "ዕለት — የጠዋት ጸሎትና ንባብ" : "Elet — Morning Devotion",
          body:
            language === "am"
              ? "ቀንዎን በእግዚአብሔር ቃልና በጸሎት ይጀምሩ።"
              : "Begin your day with prayer, scripture, and canonical reflection.",
          sound: "default",
          color: "#8E4424",
        },
        trigger: dailyTrigger(
          Notifications,
          preferences.reminderHour ?? 7,
          preferences.reminderMinute ?? 30,
          DAILY_CHANNEL
        ),
      });
    }

    // 2. Daily Saint, Tabot & Bale Wold Commemoration (7:30 AM)
    if (preferences.feastReminderEnabled !== false) {
      const feastTitle = annualFeast
        ? annualFeast.title[language] || annualFeast.title.en
        : commemoration
        ? commemoration.title[language] || commemoration.title.en
        : language === "am"
        ? "የዕለቱ ቅዱስ መታሰቢያ"
        : "Daily Saint Commemoration";

      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? `🔔 የዕለቱ ታቦት፡ ${feastTitle}` : `🔔 Today's Saint: ${feastTitle}`,
          body:
            language === "am"
              ? `${ethDate.day} ቀን — ${commemoration?.description?.[language] || "የቅዱሳን በረከት ይደርብን።"}`
              : `Blessed commemoration of ${feastTitle}.`,
          sound: "default",
          color: "#2D6A4F",
        },
        trigger: dailyTrigger(Notifications, preferences.feastReminderHour ?? 7, 30, FEAST_CHANNEL),
      });
    }

    // 3. Daily Scripture Verse Alert (12:00 PM Noon)
    if (preferences.dailyVerseReminderEnabled !== false) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? `📖 የዕለቱ ቅዱስ ቃል (${dailyBible.reference[language]})` : `📖 Daily Scripture (${dailyBible.reference.en})`,
          body: `«${dailyBible.verseText}»`,
          sound: "default",
          color: "#8E4424",
        },
        trigger: dailyTrigger(Notifications, 12, 0, SCRIPTURE_CHANNEL),
      });
    }

    // 4. Streak Protection Reminder (8:30 PM)
    if (preferences.streakProtectionReminderEnabled !== false) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "🔥 የጸሎት ጉዞዎ እንዳይቋረጥ!" : "🔥 Protect Your Spiritual Streak!",
          body:
            language === "am"
              ? "የዛሬውን የሠርክ ወይም የንዋም ጸሎት ለመፈጸም ጥቂት ደቂቃዎችን ይውሰዱ።"
              : "Take 5 minutes for your evening or compline prayer before the day concludes.",
          sound: "default",
          color: "#C89D42",
        },
        trigger: dailyTrigger(Notifications, 20, 30, DAILY_CHANNEL),
      });
    }

    // 5. Canonical & Custom Prayer Routine Bells (ሰዓታት)
    if (preferences.prayerRemindersEnabled !== false) {
      for (const prayer of prayers) {
        if (prayer.reminderEnabled !== false && prayer.reminderHour !== undefined) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: language === "am" ? `⛪ ${prayer.title.am}` : `⛪ ${prayer.title.en}`,
              body:
                language === "am"
                  ? `የ${prayer.timeLabel.am} የጸሎት ሰዓት ደርሷል — በጸሎት ወደ ፈጣሪዎ ይቅረቡ።`
                  : `Canonical prayer hour: ${prayer.title.en}.`,
              sound: "default",
              color: "#C89D42",
            },
            trigger: dailyTrigger(
              Notifications,
              prayer.reminderHour,
              prayer.reminderMinute ?? 0,
              PRAYER_CHANNEL
            ),
          });
        }
      }
    }

    // 6. Custom Reading Plan Alarms
    if (preferences.readingRemindersEnabled !== false && readingPlans) {
      for (const reading of readingPlans) {
        if (reading.reminderEnabled !== false && reading.reminderHour !== undefined) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: language === "am" ? `📖 ${reading.title.am}` : `📖 ${reading.title.en}`,
              body:
                language === "am"
                  ? `የዕለቱ የመጽሐፍ ቅዱስ ንባብ ሰዓት ደርሷል (${reading.reference})።`
                  : `Scripture reading reminder: ${reading.reference}.`,
              sound: "default",
              color: "#8E4424",
            },
            trigger: dailyTrigger(
              Notifications,
              reading.reminderHour,
              reading.reminderMinute ?? 0,
              SCRIPTURE_CHANNEL
            ),
          });
        }
      }
    }

    // 7. Fasting Break Alarm (3:00 PM / Target Hour)
    if (preferences.fastingRemindersEnabled !== false && fastingPreferences) {
      const bHour = fastingPreferences.breakFastHour ?? 15;
      const bMinute = fastingPreferences.breakFastMinute ?? 0;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "🍽️ የጾም ሰዓት ተፈጽሟል" : "🍽️ Fasting Target Completed",
          body:
            language === "am"
              ? "የዛሬው የጾም ሰዓት ተፈጽሟል፤ በምስጋና ይፍቱ። በረከቱ ይደርብን።"
              : "Today's fasting hours completed. Break fast with prayer and thanksgiving.",
          sound: "default",
          color: "#C89D42",
        },
        trigger: dailyTrigger(Notifications, bHour, bMinute, FASTING_CHANNEL),
      });
    }
  } catch {
    // Gracefully handle background schedule failure
  }
}
