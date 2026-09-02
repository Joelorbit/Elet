import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import {
  AppLogo,
  AppScreen,
  AppText as Text,
  Card,
  IconCircle,
  LucideIcon,
  Pill,
  PrimaryButton,
  SectionHeader,
  TerracottaSurface,
  useAppColors,
} from "@/src/theme/app-ui";
import {
  DailyCommemorationWidget,
  FastingTimerWidget,
  SpiritualProgressWidget,
} from "@/src/features/liturgy/components/orthodox-widgets";
import { StreakHeatmap } from "@/src/features/streaks/components/streak-heatmap";
import { useAppStore, useTodayKey } from "@/src/features/settings/store/app-store";
import {
  formatEthiopianDate,
  formatGregorianDate,
  gregorianToEthiopian,
} from "@/src/features/liturgy/utils/calendar";
import { getDailyReading } from "@/src/features/bible/utils/content";
import { getDailyBibleReference } from "@/src/features/bible/utils/daily-bible";
import { translate } from "@/src/shared/utils/i18n";

function getPrayerIcon(prayerId?: string): "sun" | "moon" | "church" {
  if (!prayerId) return "church";
  if (prayerId.includes("morning") || prayerId.includes("3rd") || prayerId.includes("noon")) {
    return "sun";
  }
  if (prayerId.includes("evening") || prayerId.includes("bedtime") || prayerId.includes("midnight")) {
    return "moon";
  }
  return "church";
}

export default function TodayScreen() {
  const {
    preferences,
    prayers,
    readingProgress,
    dailyPracticeDates,
    fastingPreferences,
    spiritualFather,
    togglePrayerCompletion,
    togglePenanceItem,
  } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const now = new Date();
  const todayKey = useTodayKey();
  const date = gregorianToEthiopian(now);
  const completedPrayers = prayers.filter((prayer) => prayer.completedDates.includes(todayKey)).length;
  const nextPrayer = prayers.find((prayer) => !prayer.completedDates.includes(todayKey)) || prayers[0];
  const nextReading = getDailyReading(date.day);
  const dailyBible = getDailyBibleReference(now, language);

  return (
    <AppScreen scroll>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text tone="label" style={[styles.appName, { color: colors.primary }]}>
            ELET • ዕለት
          </Text>
          <Text tone="display" style={[styles.greeting, { color: colors.text }]}>
            {language === "am" ? "ዛሬ (Today)" : "Today (ዛሬ)"}
          </Text>
        </View>
        <AppLogo size={48} />
      </View>

      {/* Hero Ethiopian Date Card */}
      <TerracottaSurface style={styles.heroDateCard}>
        <Text tone="label" style={styles.dateLabel}>
          {language === "am" ? "የኢትዮጵያ ቀን መቁጠሪያ" : "Ethiopian Liturgical Date"}
        </Text>
        <Text tone="display" style={styles.ethiopianDate}>
          {formatEthiopianDate(date, language)}
        </Text>
        <Text style={styles.gregorianDate}>{formatGregorianDate(now, language)}</Text>
        <Text style={styles.crossWatermark}>✞</Text>
      </TerracottaSurface>

      {/* Widget 1: Daily Commemoration & Saint / Feast */}
      <DailyCommemorationWidget language={language} date={now} />

      {/* Widget 2: Live Fasting Status & Countdown Clock */}
      <FastingTimerWidget
        language={language}
        breakFastHour={fastingPreferences?.breakFastHour ?? 15}
        breakFastMinute={fastingPreferences?.breakFastMinute ?? 0}
        hasFastingTargetSet={fastingPreferences?.hasFastingTargetSet ?? false}
        date={now}
      />

      {/* Daily Scripture Card */}
      <Pressable
        onPress={() => router.push("/daily-scripture" as never)}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 10 }}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <IconCircle icon="book-open" color="gold" size={46} />
              <View style={{ flex: 1 }}>
                <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
                  {language === "am" ? "የዕለቱ ቅዱስ ወንጌል" : "DAILY HOLY SCRIPTURE"}
                </Text>
                <Text tone="title" style={[styles.remembranceTitle, { color: colors.text }]}>
                  {dailyBible.referenceText}
                </Text>
              </View>
            </View>
            <View style={[styles.cardArrow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <LucideIcon name="chevron-right" size={18} color={colors.primary} strokeWidth={2.4} />
            </View>
          </View>
          <Text style={[styles.scriptureExcerpt, { color: colors.text }]} numberOfLines={2}>
            «{dailyBible.verseText}»
          </Text>
          <View style={styles.inlineActionRow}>
            <Pill label="81-Canon • Offline" tone="muted" />
            <View style={styles.inlineAction}>
              <Text tone="label" style={[styles.inlineActionText, { color: colors.primary }]} numberOfLines={1}>
                {language === "am" ? "ጥቅሱን ያንብቡ" : "Read full verse"}
              </Text>
              <LucideIcon name="arrow-right" size={14} color={colors.primary} strokeWidth={2.4} />
            </View>
          </View>
        </Card>
      </Pressable>

      {/* Widget 3: Spiritual Progress & Penance */}
      <SpiritualProgressWidget
        language={language}
        prayers={prayers}
        dailyPracticeDates={dailyPracticeDates}
        todayKey={todayKey}
        penanceItems={spiritualFather?.penanceItems ?? []}
        onTogglePrayer={togglePrayerCompletion}
        onTogglePenance={togglePenanceItem}
      />

      {/* Daily Practice Section */}
      <SectionHeader title={t("dailyPractice")} />

      {/* Prayer Routine Card */}
      <Card style={{ gap: 12 }}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <IconCircle
              icon={completedPrayers === prayers.length ? "church" : getPrayerIcon(nextPrayer?.id)}
              color="primary"
              size={48}
            />
            <View style={{ flex: 1 }}>
              <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>{t("prayer")}</Text>
              <Text style={[styles.cardDetail, { color: colors.muted }]}>{`${completedPrayers}/${prayers.length} ${t(
                "completed"
              ).toLowerCase()}`}</Text>
            </View>
          </View>
          <Pill
            label={completedPrayers === prayers.length ? t("completed") : `${completedPrayers}/${prayers.length}`}
            tone={completedPrayers === prayers.length ? "primary" : "muted"}
          />
        </View>
        {nextPrayer ? (
          <PrimaryButton
            label={
              completedPrayers === prayers.length
                ? t("open")
                : `${t("complete")}: ${nextPrayer.title[language] || nextPrayer.title.en}`
            }
            icon={completedPrayers === prayers.length ? "arrow-right" : "check-circle"}
            onPress={() =>
              completedPrayers === prayers.length
                ? router.push("/practice/prayer" as never)
                : togglePrayerCompletion(nextPrayer.id)
            }
          />
        ) : null}
      </Card>

      {/* Daily Readings Card */}
      <Pressable
        onPress={() => router.push("/practice/readings" as never)}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <Card style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <IconCircle icon="book-open" color="gold" size={48} />
              <View style={{ flex: 1 }}>
                <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>{t("readings")}</Text>
                <Text style={[styles.cardDetail, { color: colors.muted }]}>{nextReading.reference}</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Pill
                label={readingProgress.completedIds.includes(nextReading.id) ? t("completed") : t("open")}
                tone={readingProgress.completedIds.includes(nextReading.id) ? "primary" : "gold"}
              />
              <View style={[styles.cardArrow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <LucideIcon name="chevron-right" size={18} color={colors.primary} strokeWidth={2.4} />
              </View>
            </View>
          </View>
        </Card>
      </Pressable>

      {/* Upcoming Calendar Card */}
      <SectionHeader title={t("upcoming")} />
      <Pressable
        onPress={() => router.push("/(tabs)/calendar" as never)}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <Card style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <IconCircle icon="bell" color="muted" size={48} />
              <View style={{ flex: 1 }}>
                <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>{t("dailyReminder")}</Text>
                <Text style={[styles.cardDetail, { color: colors.muted }]}>
                  {preferences.dailyReminderEnabled
                    ? `${String(preferences.reminderHour).padStart(2, "0")}:${String(
                        preferences.reminderMinute ?? 0
                      ).padStart(2, "0")}`
                    : t("optional")}
                </Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text tone="label" style={[styles.inlineActionText, { color: colors.primary }]} numberOfLines={1}>
                {t("calendar")}
              </Text>
              <View style={[styles.cardArrow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <LucideIcon name="calendar" size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  appName: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  greeting: { fontSize: 24, fontWeight: "900", marginTop: 1 },
  heroDateCard: { padding: 20 },
  dateLabel: { fontSize: 11, fontWeight: "700", color: "rgba(255, 255, 255, 0.85)", letterSpacing: 0.4 },
  ethiopianDate: { fontSize: 24, fontWeight: "900", color: "#FFFFFF", marginTop: 3 },
  gregorianDate: { fontSize: 13, color: "rgba(255, 255, 255, 0.9)", marginTop: 4 },
  crossWatermark: {
    position: "absolute",
    right: 12,
    bottom: -10,
    fontSize: 56,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.12)",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, width: "100%" },
  row: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, minWidth: 0 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  cardTitle: { fontSize: 16, fontWeight: "800", lineHeight: 21 },
  cardDetail: { fontSize: 13, lineHeight: 18, marginTop: 1 },
  remembranceTitle: { fontSize: 16, fontWeight: "800", marginTop: 1 },
  scriptureExcerpt: { fontSize: 14, lineHeight: 21, fontStyle: "italic" },
  cardArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  inlineActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  inlineAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  inlineActionText: { fontSize: 13, fontWeight: "800" },
});
