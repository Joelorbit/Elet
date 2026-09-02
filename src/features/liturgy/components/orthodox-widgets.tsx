import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { IconCircle, LucideIcon, Pill, ProgressRing, Text, useAppColors } from "@/src/theme/app-ui";
import { Card } from "@/src/theme/app-ui";
import {
  formatEthiopianDate,
  formatGregorianDate,
  getEthiopianFastForDate,
  getMovableFeastForDate,
  gregorianToEthiopian,
  isFastingDay,
} from "@/src/features/liturgy/utils/calendar";
import {
  dailyReflection,
  getAnnualFeast,
  getMonthlyCommemoration,
  localizedAnnualFeastSignificance,
  localizedAnnualFeastTitle,
  localizedCommemorationTitle,
} from "@/src/features/liturgy/utils/monthly-commemorations";
import { calculatePracticeStreak, dailyPracticeProgress } from "@/src/features/streaks/utils/streaks";
import type { AppLanguage, PenanceItem, PrayerRoutine } from "@/src/types/app";

interface DailyCommemorationWidgetProps {
  language: AppLanguage;
  date?: Date;
}

/**
 * Widget 1: Interactive Daily Saint, Tabot & Feast Commemoration Widget
 */
export function DailyCommemorationWidget({ language, date = new Date() }: DailyCommemorationWidgetProps) {
  const colors = useAppColors();
  const ethDate = gregorianToEthiopian(date);
  const commemoration = getMonthlyCommemoration(ethDate.day);
  const annualFeast = getAnnualFeast(ethDate.month, ethDate.day, ethDate.year);
  const movableFeast = getMovableFeastForDate(ethDate);

  const feastTitle = movableFeast
    ? movableFeast.name[language]
    : annualFeast
    ? localizedAnnualFeastTitle(annualFeast, language)
    : commemoration
    ? localizedCommemorationTitle(commemoration, language)
    : "";

  const feastDetail = movableFeast
    ? movableFeast.description[language]
    : annualFeast
    ? localizedAnnualFeastSignificance(annualFeast, language)
    : commemoration?.description?.[language] || dailyReflection[language];

  return (
    <Pressable
      onPress={() => router.push("/(tabs)/calendar" as never)}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <Card style={[styles.commemorationCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
        <View style={styles.topHeader}>
          <View style={[styles.badge, { backgroundColor: colors.goldContainer, borderColor: colors.gold }]}>
            <LucideIcon name="book-open" size={15} color={colors.gold} strokeWidth={2.4} />
            <Text tone="label" style={[styles.badgeText, { color: colors.gold }]}>
              {annualFeast || movableFeast
                ? language === "am"
                  ? "ታላቅ በዓል"
                  : "HOLY FEAST"
                : language === "am"
                ? "የዕለቱ ታቦት"
                : "DAILY TABOT • ታቦት"}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.muted }]}>{formatEthiopianDate(ethDate, language)}</Text>
        </View>

        <View style={styles.contentRow}>
          <IconCircle icon={annualFeast || movableFeast ? "sparkles" : "church"} color="gold" size={50} />
          <View style={{ flex: 1 }}>
            <Text tone="title" style={[styles.saintTitle, { color: colors.text }]}>
              {feastTitle}
            </Text>
            <Text style={[styles.saintBio, { color: colors.muted }]}>{feastDetail}</Text>
          </View>
          <View style={[styles.chevronSlot, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <LucideIcon name="chevron-right" size={18} color={colors.primary} strokeWidth={2.4} />
          </View>
        </View>

        <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.gregDate, { color: colors.muted }]}>{formatGregorianDate(date, language)}</Text>
          <View style={styles.tapHintContainer}>
            <Text style={[styles.tapHint, { color: colors.primary }]}>
              {language === "am" ? "ሙሉውን ቀን መቁጠሪያ ክፈት" : "View full calendar"}
            </Text>
            <LucideIcon name="arrow-right" size={14} color={colors.primary} strokeWidth={2.4} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

interface FastingTimerWidgetProps {
  language: AppLanguage;
  breakFastHour?: number;
  breakFastMinute?: number;
  hasFastingTargetSet?: boolean;
  date?: Date;
}

/**
 * Widget 2: Interactive Fasting Status & Countdown Clock Widget
 */
export function FastingTimerWidget({
  language,
  breakFastHour = 15,
  breakFastMinute = 0,
  hasFastingTargetSet = false,
  date = new Date(),
}: FastingTimerWidgetProps) {
  const colors = useAppColors();
  const [currentTime, setCurrentTime] = useState(date);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const ethDate = gregorianToEthiopian(currentTime);
  const fastingStatus = isFastingDay(currentTime);
  const seasonalFast = getEthiopianFastForDate(ethDate);

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const targetMinutes = breakFastHour * 60 + breakFastMinute;
  const diffMinutes = Math.max(0, targetMinutes - nowMinutes);
  const hoursLeft = Math.floor(diffMinutes / 60);
  const minsLeft = diffMinutes % 60;
  const isCompleted = diffMinutes === 0;

  return (
    <Pressable
      onPress={() => router.push("/practice/fasting" as never)}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <Card style={[styles.fastingWidgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.topHeader}>
          <View
            style={[
              styles.badge,
              { backgroundColor: fastingStatus.isFast ? colors.goldContainer : colors.secondary },
            ]}
          >
            <LucideIcon name="utensils" size={15} color={fastingStatus.isFast ? colors.gold : colors.primary} strokeWidth={2.4} />
            <Text tone="label" style={[styles.badgeText, { color: fastingStatus.isFast ? colors.gold : colors.primary }]}>
              {fastingStatus.isFast
                ? seasonalFast?.name[language] || (language === "am" ? "የጾም ቀን" : "FAST DAY")
                : language === "am"
                ? "የፍስክ ቀን"
                : "NON-FASTING"}
            </Text>
          </View>
          <Pill
            label={
              fastingStatus.isFast && hasFastingTargetSet
                ? `${breakFastHour > 12 ? breakFastHour - 12 : breakFastHour}:${String(breakFastMinute).padStart(2, "0")} ${breakFastHour >= 12 ? "PM" : "AM"}`
                : fastingStatus.isFast
                ? (language === "am" ? "መፍቻ አልተወሰነም" : "Not set")
                : language === "am"
                ? "ፍስክ"
                : "Free"
            }
            tone={fastingStatus.isFast && hasFastingTargetSet ? "gold" : "muted"}
          />
        </View>

        {fastingStatus.isFast ? (
          <View style={styles.timerRow}>
            <View style={styles.countdownBox}>
              {!hasFastingTargetSet ? (
                <View style={styles.setTargetCta}>
                  <LucideIcon name="clock" size={18} color={colors.primary} />
                  <Text style={[styles.setTargetCtaText, { color: colors.primary }]}>
                    {language === "am" ? "የጾም መፍቻ ሰዓት አልተቀመጠም — ይምረጡ" : "No fasting target set — tap to set"}
                  </Text>
                </View>
              ) : isCompleted ? (
                <View style={styles.completedBox}>
                  <LucideIcon name="check-circle" size={22} color={colors.primary} strokeWidth={2.4} />
                  <Text style={[styles.completedText, { color: colors.primary }]}>
                    {language === "am" ? "የጾም ሰዓት ተፈጽሟል — በረከቱ ይደርብን" : "Fasting Target Completed ✓"}
                  </Text>
                </View>
              ) : (
                <View style={styles.countdownInline}>
                  <Text tone="display" style={[styles.timeNumbers, { color: colors.text }]}>
                    {hoursLeft}
                    <Text style={[styles.timeUnit, { color: colors.muted }]}>h </Text>
                    {minsLeft}
                    <Text style={[styles.timeUnit, { color: colors.muted }]}>m</Text>
                  </Text>
                  <Text style={[styles.remainingLabel, { color: colors.muted }]}>
                    {language === "am" ? "እስከ መፍቻ ሰዓት ቀሪ" : "remaining until break"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <Text style={[styles.nonFastNotice, { color: colors.muted }]}>
            {language === "am"
              ? "ዛሬ የፍስክ ቀን ነው። በጸሎትና በምስጋና ይዋሉ።"
              : "Today is a non-fasting day. Spend your day in prayer and thanksgiving."}
          </Text>
        )}
      </Card>
    </Pressable>
  );
}

interface SpiritualProgressWidgetProps {
  language: AppLanguage;
  prayers: PrayerRoutine[];
  dailyPracticeDates: string[];
  todayKey: string;
  penanceItems?: PenanceItem[];
  onTogglePrayer?: (prayerId: string) => void;
  onTogglePenance?: (itemId: string) => void;
}

/**
 * Widget 3: Interactive Spiritual Progress, Next Prayer Action & Penance Checklist Widget
 */
export function SpiritualProgressWidget({
  language,
  prayers,
  dailyPracticeDates,
  todayKey,
  penanceItems = [],
  onTogglePrayer,
  onTogglePenance,
}: SpiritualProgressWidgetProps) {
  const colors = useAppColors();
  const completedPrayers = prayers.filter((p) => p.completedDates.includes(todayKey)).length;
  const streak = calculatePracticeStreak(dailyPracticeDates, new Date());
  const practiceProgress = dailyPracticeProgress(completedPrayers, prayers.length);
  const nextIncompletePrayer = prayers.find((p) => !p.completedDates.includes(todayKey));

  return (
    <Card style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.streakRow}>
        <ProgressRing
          progress={practiceProgress}
          label={`${completedPrayers}/${prayers.length}`}
          caption={language === "am" ? "ጸሎት" : "PRAYER"}
        />
        <View style={{ flex: 1 }}>
          <Text tone="label" style={[styles.badgeText, { color: colors.primary }]}>
            {language === "am" ? "ዕለታዊ ጉዞ" : "DAILY SPIRITUAL RHYTHM"}
          </Text>
          <Text tone="title" style={[styles.streakTitle, { color: colors.text }]}>
            {language === "am" ? `${streak} ቀን ተከታታይ` : `${streak}-day streak`}
          </Text>
          <Text style={[styles.penanceSummary, { color: colors.muted }]}>
            {completedPrayers === prayers.length
              ? language === "am"
                ? "የዛሬ ጸሎት ተፈጽሟል ✓"
                : "All prayers completed today ✓"
              : language === "am"
              ? `${prayers.length - completedPrayers} ቀሪ ጸሎት አለ`
              : `${prayers.length - completedPrayers} prayers remaining`}
          </Text>
        </View>
      </View>

      {nextIncompletePrayer && onTogglePrayer && (
        <View style={[styles.widgetActionBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <LucideIcon
                name={
                  nextIncompletePrayer.id.includes("morning") ||
                  nextIncompletePrayer.id.includes("3rd") ||
                  nextIncompletePrayer.id.includes("noon")
                    ? "sun"
                    : nextIncompletePrayer.id.includes("evening") ||
                      nextIncompletePrayer.id.includes("bedtime") ||
                      nextIncompletePrayer.id.includes("midnight")
                    ? "moon"
                    : "church"
                }
                size={14}
                color={colors.primary}
                strokeWidth={2.4}
              />
              <Text tone="label" style={[styles.nextActionLabel, { color: colors.muted }]}>
                {language === "am" ? "ቀጣይ ጸሎት" : "Next Prayer"}
              </Text>
            </View>
            <Text tone="title" style={[styles.nextActionTitle, { color: colors.text }]}>
              {nextIncompletePrayer.title[language] || nextIncompletePrayer.title.en}
            </Text>
          </View>
          <Pressable
            onPress={() => onTogglePrayer(nextIncompletePrayer.id)}
            style={({ pressed }) => [
              styles.quickCheckButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <LucideIcon name="check-circle" size={16} color="#FFFFFF" strokeWidth={2.4} />
            <Text tone="label" style={styles.quickCheckText}>
              {language === "am" ? "ፈጽም" : "Done"}
            </Text>
          </Pressable>
        </View>
      )}

      {penanceItems.length > 0 && onTogglePenance && (
        <View style={styles.penanceList}>
          {penanceItems.slice(0, 2).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onTogglePenance(item.id)}
              style={({ pressed }) => [
                styles.penanceRow,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View
                style={[
                  styles.penanceCheck,
                  {
                    borderColor: item.completed ? colors.primary : colors.muted,
                    backgroundColor: item.completed ? colors.primary : "transparent",
                  },
                ]}
              >
                {item.completed && <LucideIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text
                style={[
                  styles.penanceText,
                  {
                    color: item.completed ? colors.muted : colors.text,
                    textDecorationLine: item.completed ? "line-through" : "none",
                  },
                ]}
                numberOfLines={1}
              >
                {item.title} {item.targetCount ? `(${item.targetCount}x)` : ""}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  commemorationCard: { padding: 16, gap: 10, borderWidth: 1.5 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  dateText: { fontSize: 12, fontWeight: "700" },
  contentRow: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%" },
  saintTitle: { fontSize: 16, fontWeight: "800", lineHeight: 21 },
  saintBio: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 1, width: "100%" },
  gregDate: { fontSize: 12, fontWeight: "600", flexShrink: 1 },
  tapHintContainer: { flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 0 },
  tapHint: { fontSize: 12, fontWeight: "700" },
  chevronSlot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1, flexShrink: 0 },
  fastingWidgetCard: { padding: 16, gap: 8 },
  timerRow: { paddingVertical: 4 },
  countdownBox: { alignItems: "flex-start" },
  countdownInline: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  timeNumbers: { fontSize: 24, fontWeight: "800", lineHeight: 30 },
  timeUnit: { fontSize: 14, fontWeight: "700" },
  remainingLabel: { fontSize: 12 },
  completedBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  completedText: { fontSize: 14, fontWeight: "800" },
  nonFastNotice: { fontSize: 13, lineHeight: 18, paddingVertical: 4 },
  progressCard: { padding: 16, gap: 12 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  streakTitle: { fontSize: 17, lineHeight: 22, fontWeight: "800", marginTop: 1 },
  penanceSummary: { fontSize: 13, lineHeight: 17, marginTop: 2 },
  widgetActionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  nextActionLabel: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  nextActionTitle: { fontSize: 13, fontWeight: "800", marginTop: 1 },
  quickCheckButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickCheckText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  penanceList: { gap: 6 },
  penanceRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8, borderRadius: 10 },
  penanceCheck: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  penanceText: { fontSize: 12, fontWeight: "600", flex: 1 },
});
