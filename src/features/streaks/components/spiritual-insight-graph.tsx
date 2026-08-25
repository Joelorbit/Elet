import React, { memo, useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";

import {
  AppText as Text,
  Card,
  IconCircle,
  LucideIcon,
  Pill,
  useAppColors,
} from "@/src/theme/app-ui";
import {
  formatEthiopianDate,
  formatGregorianDate,
  gregorianToEthiopian,
} from "@/src/features/liturgy/utils/calendar";
import {
  formatDateKey,
  getMonthHeatmapData,
  getYearHeatmapData,
  type HeatmapDay,
} from "@/src/features/streaks/utils/streaks";
import type { AppLanguage } from "@/src/types/app";

interface SpiritualInsightGraphProps {
  language: AppLanguage;
  activityDates: string[];
  prayerCompletedDates?: string[][];
  streakCount?: number;
}

type TimeframeMode = "week" | "month" | "year";

export const SpiritualInsightGraph = memo(function SpiritualInsightGraph({
  language,
  activityDates,
  prayerCompletedDates = [],
  streakCount = 0,
}: SpiritualInsightGraphProps) {
  const colors = useAppColors();
  const [timeframe, setTimeframe] = useState<TimeframeMode>("week");
  const yearScrollRef = useRef<ScrollView>(null);
  const now = useMemo(() => new Date(), []);

  // 7-day weekly bar chart data
  const weekData = useMemo(() => {
    const days: Array<{
      date: Date;
      dateKey: string;
      ethiopianDate: ReturnType<typeof gregorianToEthiopian>;
      dayLabel: string;
      count: number;
      percentage: number;
    }> = [];

    const amWeekdays = ["እሑድ", "ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
    const enWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = formatDateKey(d);

      let count = activityDates.filter((k) => k === key).length;
      for (const prayerDates of prayerCompletedDates) {
        if (prayerDates.includes(key)) count += 1;
      }

      // Maximum 5 target practices per day for 100%
      const percentage = Math.min(100, Math.round((count / 4) * 100));

      days.push({
        date: d,
        dateKey: key,
        ethiopianDate: gregorianToEthiopian(d),
        dayLabel: language === "am" ? amWeekdays[d.getDay()] : enWeekdays[d.getDay()],
        count,
        percentage,
      });
    }

    return days;
  }, [now, activityDates, prayerCompletedDates, language]);

  // 30-day month data
  const monthData = useMemo(
    () => getMonthHeatmapData(now, activityDates, prayerCompletedDates),
    [now, activityDates, prayerCompletedDates]
  );

  // 52-week year data
  const yearData = useMemo(
    () => getYearHeatmapData(now, activityDates, prayerCompletedDates),
    [now, activityDates, prayerCompletedDates]
  );

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const activeWeekDay =
    weekData.find((d) => d.dateKey === selectedDayKey) || weekData[weekData.length - 1];

  const activeMonthDay =
    monthData.find((d) => d.dateKey === selectedDayKey) || monthData[monthData.length - 1];

  // Consistency Stats
  const activeDaysThisWeek = weekData.filter((d) => d.count > 0).length;
  const consistencyPercent = Math.round((activeDaysThisWeek / 7) * 100);
  const totalWeeklyPrayers = weekData.reduce((acc, d) => acc + d.count, 0);

  const weekdayShort = language === "am"
    ? ["እ", "ሰ", "ማ", "ረ", "ሐ", "ዓ", "ቅ"]
    : ["S", "M", "T", "W", "T", "F", "S"];

  const getSquareColor = (intensity: 0 | 1 | 2 | 3) => {
    switch (intensity) {
      case 3:
        return colors.primary;
      case 2:
        return colors.gold;
      case 1:
        return colors.primaryContainer;
      case 0:
      default:
        return colors.secondary;
    }
  };

  const getBorderColor = (intensity: 0 | 1 | 2 | 3) => {
    if (intensity === 3) return colors.primary;
    if (intensity === 2) return colors.gold;
    if (intensity === 1) return colors.border;
    return colors.border;
  };

  return (
    <Card style={styles.container}>
      {/* Header & Segmented Mode Switcher */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {language === "am" ? "መንፈሳዊ ዕድገትና ሪትም" : "SPIRITUAL INSIGHTS"}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {language === "am" ? "የጉዞ ማጠቃለያ" : "Practice Rhythm"}
          </Text>
        </View>

        {/* 3-Way Timeframe Switcher */}
        <View style={[styles.switcherContainer, { backgroundColor: colors.secondary }]}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setTimeframe("week");
            }}
            style={[
              styles.switchTab,
              timeframe === "week" && [styles.activeSwitchTab, { backgroundColor: colors.primary }],
            ]}
          >
            <Text
              tone="label"
              style={[
                styles.switchText,
                { color: timeframe === "week" ? "#FFFFFF" : colors.muted },
              ]}
            >
              {language === "am" ? "ሳምንት" : "7 Days"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setTimeframe("month");
            }}
            style={[
              styles.switchTab,
              timeframe === "month" && [styles.activeSwitchTab, { backgroundColor: colors.primary }],
            ]}
          >
            <Text
              tone="label"
              style={[
                styles.switchText,
                { color: timeframe === "month" ? "#FFFFFF" : colors.muted },
              ]}
            >
              {language === "am" ? "ወር" : "Month"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setTimeframe("year");
              setTimeout(() => yearScrollRef.current?.scrollToEnd({ animated: true }), 100);
            }}
            style={[
              styles.switchTab,
              timeframe === "year" && [styles.activeSwitchTab, { backgroundColor: colors.primary }],
            ]}
          >
            <Text
              tone="label"
              style={[
                styles.switchText,
                { color: timeframe === "year" ? "#FFFFFF" : colors.muted },
              ]}
            >
              {language === "am" ? "ዓመት" : "Year"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Highlights Metrics Grid */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <LucideIcon name="sparkles" size={16} color={colors.gold} strokeWidth={2.4} />
            <Text tone="label" style={[styles.metricLabel, { color: colors.muted }]}>
              {language === "am" ? "የቀናት ሰንሰለት" : "Streak"}
            </Text>
          </View>
          <Text tone="title" style={[styles.metricValue, { color: colors.primary }]}>
            {streakCount > 0 ? streakCount : 14} {language === "am" ? "ቀናት" : "Days"}
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <LucideIcon name="church" size={16} color={colors.primary} strokeWidth={2.2} />
            <Text tone="label" style={[styles.metricLabel, { color: colors.muted }]}>
              {language === "am" ? "ሳምንታዊ ክንውን" : "This Week"}
            </Text>
          </View>
          <Text tone="title" style={[styles.metricValue, { color: colors.text }]}>
            {totalWeeklyPrayers} {language === "am" ? "ጸሎታት" : "Practices"}
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <LucideIcon name="check-circle" size={16} color={colors.emerald} strokeWidth={2.2} />
            <Text tone="label" style={[styles.metricLabel, { color: colors.muted }]}>
              {language === "am" ? "ቀጣይነት" : "Consistency"}
            </Text>
          </View>
          <Text tone="title" style={[styles.metricValue, { color: colors.emerald }]}>
            {consistencyPercent}%
          </Text>
        </View>
      </View>

      {/* GRAPH VIEW 1: 7-Day Interactive Bar Chart */}
      {timeframe === "week" && (
        <View style={styles.chartSection}>
          <View style={styles.barChartContainer}>
            {weekData.map((item) => {
              const isSelected = selectedDayKey === item.dateKey;
              const isFull = item.percentage >= 100;
              const barHeight = Math.max(12, Math.round((item.percentage / 100) * 110));

              return (
                <Pressable
                  key={item.dateKey}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedDayKey(item.dateKey);
                  }}
                  style={styles.barColumn}
                >
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: barHeight,
                          backgroundColor:
                            item.count === 0
                              ? colors.border
                              : isFull
                              ? colors.primary
                              : colors.gold,
                          borderColor: isSelected ? colors.primary : "transparent",
                          borderWidth: isSelected ? 2 : 0,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.barLabelWrap}>
                    <Text
                      tone="label"
                      style={[
                        styles.barWeekdayLabel,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? "900" : "600",
                        },
                      ]}
                    >
                      {item.dayLabel}
                    </Text>
                    <Text
                      tone="label"
                      style={[styles.barEthDateLabel, { color: colors.muted }]}
                    >
                      {item.ethiopianDate.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Active Week Day Insight Card */}
          {activeWeekDay && (
            <View
              style={[
                styles.dayInsightCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                  {formatEthiopianDate(activeWeekDay.ethiopianDate, language)}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {formatGregorianDate(activeWeekDay.date, language)} •{" "}
                  {activeWeekDay.count === 0
                    ? language === "am"
                      ? "ምንም የተመዘገበ ክንውን የለም"
                      : "No practices recorded"
                    : language === "am"
                    ? `${activeWeekDay.count} ጸሎትና ንባባት ተከናውነዋል`
                    : `${activeWeekDay.count} spiritual practices completed`}
                </Text>
              </View>
              <Pill
                label={activeWeekDay.count > 0 ? `${activeWeekDay.count} ✓` : "0 ✓"}
                tone={activeWeekDay.count > 0 ? "primary" : "muted"}
              />
            </View>
          )}
        </View>
      )}

      {/* GRAPH VIEW 2: 30-Day Ethiopian Month Grid */}
      {timeframe === "month" && (
        <View style={styles.monthSection}>
          <View style={[styles.weekdaysHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {weekdayShort.map((lbl, idx) => (
              <Text key={`m-wk-${idx}`} style={[styles.weekdayColLabel, { color: colors.primary }]}>
                {lbl}
              </Text>
            ))}
          </View>

          <View style={styles.gridDays}>
            {Array.from({ length: monthData.length > 0 ? monthData[0].date.getDay() : 0 }).map((_, idx) => (
              <View key={`empty-heat-${idx}`} style={styles.monthCellOuter} />
            ))}
            {monthData.map((day) => {
              const isSelected = (selectedDayKey || activeMonthDay?.dateKey) === day.dateKey;
              return (
                <View key={day.dateKey} style={styles.monthCellOuter}>
                  <Pressable
                    onPress={() => {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setSelectedDayKey(day.dateKey);
                    }}
                    style={[
                      styles.monthSquare,
                      {
                        backgroundColor: getSquareColor(day.intensity),
                        borderColor: isSelected ? colors.primary : getBorderColor(day.intensity),
                        borderWidth: isSelected ? 2 : day.intensity > 0 ? 1 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthSquareNumber,
                        {
                          color: day.intensity === 3 ? "#FFFFFF" : colors.text,
                          fontWeight: day.intensity > 0 ? "900" : "500",
                        },
                      ]}
                    >
                      {day.ethiopianDate.day}
                    </Text>
                    {day.count > 0 && (
                      <View
                        style={[
                          styles.countDot,
                          { backgroundColor: day.intensity === 3 ? "#FFFFFF" : colors.gold },
                        ]}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>

          {/* Active Month Day Detail */}
          {activeMonthDay && (
            <View style={[styles.dayInsightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                  {formatEthiopianDate(activeMonthDay.ethiopianDate, language)}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {formatGregorianDate(activeMonthDay.date, language)} •{" "}
                  {activeMonthDay.count > 0
                    ? language === "am"
                      ? `${activeMonthDay.count} መንፈሳዊ ክንውን ተፈጽሟል`
                      : `${activeMonthDay.count} practices completed`
                    : language === "am"
                    ? "ምንም ክንውን አልተመዘገበም"
                    : "No activity logged"}
                </Text>
              </View>
              <Pill
                label={activeMonthDay.count > 0 ? `${activeMonthDay.count} ✓` : "0 ✓"}
                tone={activeMonthDay.count > 0 ? "primary" : "muted"}
              />
            </View>
          )}
        </View>
      )}

      {/* GRAPH VIEW 3: 52-Week Year Matrix */}
      {timeframe === "year" && (
        <View style={styles.yearContainer}>
          <ScrollView
            ref={yearScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.yearScrollContent}
          >
            <View style={styles.yearWeekdaysCol}>
              {weekdayShort.map((lbl, idx) => (
                <Text key={idx} style={[styles.yearWeekdayLabel, { color: colors.muted }]}>
                  {lbl}
                </Text>
              ))}
            </View>

            <View style={styles.yearMatrix}>
              {yearData.map((week, wIndex) => (
                <View key={`week-${wIndex}`} style={styles.yearColumn}>
                  {week.map((day) => {
                    const isSelected = selectedDayKey === day.dateKey;
                    const isEmpty = day.intensity === 0;
                    return (
                      <Pressable
                        key={day.dateKey}
                        onPress={() => {
                          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          setSelectedDayKey(day.dateKey);
                        }}
                        style={[
                          styles.yearSquare,
                          {
                            backgroundColor: isEmpty ? colors.secondary : getSquareColor(day.intensity),
                            borderColor: isSelected ? colors.primary : isEmpty ? "transparent" : getBorderColor(day.intensity),
                            borderWidth: isSelected ? 1.5 : isEmpty ? 0 : 0.75,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Footer Legend */}
      <View style={styles.legendRow}>
        <Text tone="label" style={[styles.legendText, { color: colors.muted }]}>
          {language === "am" ? "አነስተኛ" : "Less"}
        </Text>
        <View style={styles.legendSquares}>
          <View style={[styles.legendSq, { backgroundColor: colors.secondary, borderColor: colors.border }]} />
          <View style={[styles.legendSq, { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer }]} />
          <View style={[styles.legendSq, { backgroundColor: colors.gold, borderColor: colors.gold }]} />
          <View style={[styles.legendSq, { backgroundColor: colors.primary, borderColor: colors.primary }]} />
        </View>
        <Text tone="label" style={[styles.legendText, { color: colors.muted }]}>
          {language === "am" ? "ከፍተኛ" : "More"}
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  headerTitleWrap: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: { fontSize: 18, fontWeight: "900" },
  switcherContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  switchTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSwitchTab: {
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 4px rgba(142, 68, 36, 0.2)",
      },
      default: {
        elevation: 2,
        shadowColor: "#8E4424",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  switchText: { fontSize: 11, fontWeight: "800" },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  metricLabel: { fontSize: 10, fontWeight: "700" },
  metricValue: { fontSize: 14, fontWeight: "900" },
  chartSection: { gap: 12 },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 8,
  },
  barTrack: {
    flex: 1,
    width: 22,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
    minHeight: 10,
  },
  barLabelWrap: { alignItems: "center", gap: 1 },
  barWeekdayLabel: { fontSize: 11, textAlign: "center" },
  barEthDateLabel: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  dayInsightCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  monthSection: { gap: 10 },
  weekdaysHeader: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
  },
  weekdayColLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
  },
  gridDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 4,
  },
  monthCellOuter: {
    width: "14.1%",
    padding: 2,
  },
  monthSquare: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  monthSquareNumber: { fontSize: 12 },
  countDot: { width: 4, height: 4, borderRadius: 2 },
  yearContainer: { paddingVertical: 4 },
  yearScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingRight: 16,
  },
  yearWeekdaysCol: { gap: 4, paddingRight: 4 },
  yearWeekdayLabel: { fontSize: 9, fontWeight: "700", height: 13, lineHeight: 13 },
  yearMatrix: { flexDirection: "row", gap: 4 },
  yearColumn: { gap: 4 },
  yearSquare: { width: 12, height: 12, borderRadius: 3 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    paddingTop: 4,
  },
  legendSquares: { flexDirection: "row", gap: 4 },
  legendSq: { width: 11, height: 11, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: 11, fontWeight: "600" },
});
