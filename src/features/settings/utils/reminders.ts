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
    let isGranted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    
    if (!isGranted) {
      const request = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      isGranted = request.granted || request.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL || false;
    }

    return isGranted;
  } catch {
    return false;
  }
}

export async function openOverlaySettings() {
  if (Platform.OS === "android") {
    try {
      const IntentLauncher = await import("expo-intent-launcher");
      await IntentLauncher.startActivityAsync("android.settings.action.MANAGE_OVERLAY_PERMISSION", {
        data: "package:me.eyuel.elet"
      });
    } catch {}
  }
}

export async function openAlarmSettings() {
  if (Platform.OS === "android") {
    try {
      // expo-intent-launcher doesn't have REQUEST_SCHEDULE_EXACT_ALARM typed directly, so we use string
      const IntentLauncher = await import("expo-intent-launcher");
      await IntentLauncher.startActivityAsync("android.settings.REQUEST_SCHEDULE_EXACT_ALARM");
    } catch {
      try {
        const IntentLauncher = await import("expo-intent-launcher");
        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
          data: "package:me.eyuel.elet"
        });
      } catch {}
    }
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
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL, {
      name: "Seven Prayer Hours (ሰዓታት)",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 300, 200, 300],
      lightColor: "#C89D42",
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(FEAST_CHANNEL, {
      name: "Daily Tabot & Feasts",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#2D6A4F",
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(FASTING_CHANNEL, {
      name: "Fasting Alarms & Break Times",
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#C89D42",
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(SCRIPTURE_CHANNEL, {
      name: "Daily Holy Scripture",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#8E4424",
      enableVibrate: true,
      enableLights: true,
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
          title: language === "am" ? "ዕለት • የጠዋት ጸሎትና ንባብ" : "Elet • Morning Devotion",
          body:
            language === "am"
              ? "ቀንዎን በእግዚአብሔር ቃልና በጸሎት ይጀምሩ።"
              : "Begin your day with prayer, holy scripture, and canonical reflection.",
          sound: true,
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
          title: language === "am" ? `የዕለቱ ቅዱስ ታቦት • ${feastTitle}` : `Daily Commemoration • ${feastTitle}`,
          body:
            language === "am"
              ? `${ethDate.day} ቀን — ${commemoration?.description?.[language] || "የቅዱሳን በረከት ይደርብን።"}`
              : `Blessed commemoration of ${feastTitle}.`,
          sound: true,
          color: "#2D6A4F",
        },
        trigger: dailyTrigger(Notifications, preferences.feastReminderHour ?? 7, 30, FEAST_CHANNEL),
      });
    }

    // 3. Daily Scripture Verse Alert (12:00 PM Noon)
    if (preferences.dailyVerseReminderEnabled !== false) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? `የዕለቱ ቅዱስ ቃል • ${dailyBible.reference[language]}` : `Daily Holy Scripture • ${dailyBible.reference.en}`,
          body: `«${dailyBible.verseText}»`,
          sound: true,
          color: "#8E4424",
        },
        trigger: dailyTrigger(Notifications, 12, 0, SCRIPTURE_CHANNEL),
      });
    }

    // 4. Streak Protection Reminder (8:30 PM)
    if (preferences.streakProtectionReminderEnabled !== false) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: language === "am" ? "ዕለት • የጸሎት ጽናት ማሳሰቢያ" : "Elet • Daily Devotion Reminder",
          body:
            language === "am"
              ? "የዛሬውን የሠርክ ወይም የንዋም ጸሎት ለመፈጸም ጥቂት ደቂቃዎችን ይውሰዱ።"
              : "Take a few moments for your evening or compline prayer before the day concludes.",
          sound: true,
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
              title: language === "am" ? `የሰዓታት ጸሎት • ${prayer.title.am}` : `Canonical Prayer • ${prayer.title.en}`,
              body:
                language === "am"
                  ? `የ${prayer.timeLabel.am} የጸሎት ሰዓት ደርሷል — በጸሎትና በምስጋና ወደ ፈጣሪዎ ይቅረቡ።`
                  : `Canonical prayer hour: ${prayer.title.en}. Lift your heart in prayer.`,
              sound: true,
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
              title: language === "am" ? `የመጽሐፍ ቅዱስ ንባብ • ${reading.title.am}` : `Scripture Reading • ${reading.title.en}`,
              body:
                language === "am"
                  ? `የዕለቱ የመጽሐፍ ቅዱስ ንባብ ሰዓት ደርሷል (${reading.reference})።`
                  : `Scripture reading reminder: ${reading.reference}.`,
              sound: true,
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
          title: language === "am" ? "የጾም ፍጻሜ • መፍቻ ሰዓት ደርሷል" : "Fasting Completed • Break Fast Hour",
          body:
            language === "am"
              ? "የዛሬው የጾም ሰዓት ተፈጽሟል፤ በጸሎትና በምስጋና ይፍቱ። በረከቱ ይደርብን።"
              : "Today's canonical fasting hours are completed. Break fast with thanksgiving and prayer.",
          sound: true,
          color: "#C89D42",
        },
        trigger: dailyTrigger(Notifications, bHour, bMinute, FASTING_CHANNEL),
      });
    }
  } catch {
    // Gracefully handle background schedule failure
  }
}

export async function sendTestNotificationNow(language: "am" | "en" = "am"): Promise<boolean> {
  const Notifications = await getNotificationsApi();
  if (!Notifications) return false;

  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return false;

    await setupNotificationChannels();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: language === "am" ? "ዕለት • የጸሎት ደወልና ማሳወቂያ" : "Elet • Canonical Bell & Notification",
        body:
          language === "am"
            ? "የሰዓታት ጸሎት፣ የአጽዋማትና የበዓላት ማሳወቂያ ሥርዓት በተሟላ ሁኔታ እየሠራ ነው።"
            : "Canonical prayer bells, fasting alerts, and liturgical notifications are active and working flawlessly.",
        sound: true,
        color: "#8E4424",
      },
      trigger: null, // deliver immediately
    });
    return true;
  } catch {
    return false;
  }
}
