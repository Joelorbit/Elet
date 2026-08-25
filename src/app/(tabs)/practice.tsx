import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import {
  AppScreen,
  AppText as Text,
  Card,
  IconCircle,
  LucideIcon,
  Pill,
  useAppColors,
} from "@/src/theme/app-ui";
import { SpiritualInsightGraph } from "@/src/features/streaks/components/spiritual-insight-graph";
import { calculatePracticeStreak } from "@/src/features/streaks/utils/streaks";
import { useAppStore, useTodayKey } from "@/src/features/settings/store/app-store";
import { translate, type TranslationKey } from "@/src/shared/utils/i18n";

interface PracticeCardConfig {
  section: string;
  icon: "church" | "book-open" | "utensils" | "heart" | "shield-check";
  color: "primary" | "gold";
  title: TranslationKey;
  detail: TranslationKey;
}

const practiceCards: PracticeCardConfig[] = [
  {
    section: "prayer",
    icon: "church",
    color: "primary",
    title: "prayerRoutine",
    detail: "prayerDetail",
  },
  {
    section: "readings",
    icon: "book-open",
    color: "gold",
    title: "readingPlan",
    detail: "readingDetail",
  },
  {
    section: "fasting",
    icon: "utensils",
    color: "gold",
    title: "fastingPlanner",
    detail: "fastingPlannerDetail",
  },
  {
    section: "intercessions",
    icon: "heart",
    color: "primary",
    title: "intercessions",
    detail: "intercessionsDetail",
  },
  {
    section: "confession",
    icon: "shield-check",
    color: "primary",
    title: "confession",
    detail: "confessionDetail",
  },
];

export default function PracticeScreen() {
  const { preferences, prayers, readingProgress, dailyPracticeDates, confessionSessions, intercessions } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const todayKey = useTodayKey();

  const completedPrayerCount = prayers.reduce(
    (count, prayer) => count + (prayer.completedDates.includes(todayKey) ? 1 : 0),
    0
  );

  const streak = useMemo(() => {
    return calculatePracticeStreak(dailyPracticeDates, new Date());
  }, [dailyPracticeDates]);

  const getMeta = (section: string) => {
    if (section === "prayer") return `${completedPrayerCount}/${prayers.length}`;
    if (section === "readings") return `${readingProgress.completedIds.length}`;
    if (section === "intercessions") return `${intercessions.filter((item) => !item.archived).length}`;
    if (section === "confession") return confessionSessions.length ? t("saved") : t("sensitive");
    return t("fasting");
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <View>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {t("practice")}
          </Text>
          <Text tone="display" style={[styles.title, { color: colors.text }]}>
            {t("practiceHub")}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{t("practiceDetail")}</Text>
        </View>
        <IconCircle icon="church" color="gold" size={50} />
      </View>

      {/* Spiritual Activity & Insight Graph */}
      <SpiritualInsightGraph
        language={language}
        activityDates={dailyPracticeDates}
        prayerCompletedDates={prayers.map((p) => p.completedDates)}
        streakCount={streak}
      />

      {/* Practice Destinations */}
      <View style={styles.cards}>
        {practiceCards.map((card) => (
          <Pressable
            key={card.section}
            accessibilityRole="button"
            accessibilityLabel={`${t(card.title)}: ${t("open")}`}
            onPress={() =>
              router.push(
                (card.section === "intercessions"
                  ? "/intercessions"
                  : `/practice/${card.section}`) as never
              )
            }
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            <Card style={styles.practiceCard}>
              <View style={styles.row}>
                <IconCircle icon={card.icon} color={card.color} size={48} />
                <View style={styles.cardCopy}>
                  <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>
                    {t(card.title)}
                  </Text>
                  <Text style={[styles.cardDetail, { color: colors.muted }]}>{t(card.detail)}</Text>
                </View>
                <View style={[styles.chevronSlot, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <LucideIcon name="chevron-right" color={colors.primary} size={18} strokeWidth={2.4} />
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.cardFooter}>
                <Pill label={getMeta(card.section)} tone={card.section === "confession" ? "muted" : card.color} />
                <View style={[styles.openRow, { backgroundColor: colors.secondary }]}>
                  <Text tone="label" style={[styles.open, { color: colors.primary }]}>
                    {t("open")}
                  </Text>
                  <LucideIcon name="arrow-right" size={14} color={colors.primary} strokeWidth={2.4} />
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "900", marginTop: 2, maxWidth: 280 },
  detail: { fontSize: 13, lineHeight: 19, maxWidth: 290, marginTop: 4 },
  cards: { gap: 12, marginTop: 4 },
  practiceCard: { padding: 16, gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%" },
  cardCopy: { flex: 1, minWidth: 0, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardDetail: { fontSize: 13, lineHeight: 18 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingTop: 2 },
  openRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  chevronSlot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1, flexShrink: 0 },
  open: { fontSize: 12, fontWeight: "800" },
  divider: { height: 1, width: "100%", marginVertical: 2 },
});
