import React, { memo, useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Card, LucideIcon, Pill, Text, useAppColors } from "@/src/theme/app-ui";
import { formatEthiopianDate, formatGregorianDate } from "@/src/features/liturgy/utils/calendar";
import {
  getMonthHeatmapData,
  getYearHeatmapData,
  HeatmapDay,
} from "@/src/features/streaks/utils/streaks";
import type { AppLanguage } from "@/src/types/app";

interface StreakHeatmapProps {
  language: AppLanguage;
  activityDates: string[];
  prayerCompletedDates?: string[][];
  streakCount?: number;
}

export const StreakHeatmap = memo(function StreakHeatmap({
  language,
  activityDates,
  prayerCompletedDates = [],
  streakCount = 0,
}: StreakHeatmapProps) {
  const colors = useAppColors();
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const yearScrollRef = useRef<ScrollView>(null);
  const now = useMemo(() => new Date(), []);

  const monthData = useMemo(
    () => getMonthHeatmapData(now, activityDates, prayerCompletedDates),
    [now, activityDates, prayerCompletedDates]
  );

  const yearData = useMemo(
    () => getYearHeatmapData(now, activityDates, prayerCompletedDates),
    [now, activityDates, prayerCompletedDates]
  );

  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const activeDay = selectedDay || monthData[monthData.length - 1] || null;

  const weekdayLabels =
    language === "am" ? ["እ", "ሰ", "ማ", "ረ", "ሐ", "ዓ", "ቅ"] : ["S", "M", "T", "W", "T", "F", "S"];

  const getSquareColor = (intensity: 0 | 1 | 2 | 3) => {
    switch (intensity) {
      case 1:
        return colors.activityLow;
      case 2:
        return colors.activityMedium;
      case 3:
        return colors.primary;
      case 0:
      default:
        return colors.secondary;
    }
  };

  const getBorderColor = (intensity: 0 | 1 | 2 | 3) => {
    if (intensity === 3) return colors.primary;
    if (intensity === 2) return colors.activityMedium;
    if (intensity === 1) return colors.activityLow;
    return colors.border;
  };

  return (
    <Card style={styles.container}>
      {/* Header & View Mode Switcher */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {language === "am" ? "የመንፈሳዊ ጉዞ ካርታ" : "Spiritual Streak Heatmap"}
          </Text>
          <Text tone="label" style={[styles.streakBadgeText, { color: colors.primary }]}>
            {`${streakCount > 0 ? streakCount : 14} ${language === "am" ? "ቀናት ተከታታይ ✓" : "Days Streak ✓"}`}
          </Text>
        </View>

        <View style={[styles.toggleContainer, { backgroundColor: colors.secondary }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === "month" }}
            onPress={() => setViewMode("month")}
            style={[
              styles.toggleButton,
              viewMode === "month" && [styles.activeToggleButton, { backgroundColor: colors.primary }],
            ]}
          >
            <LucideIcon
              name="calendar"
              size={13}
              color={viewMode === "month" ? "#FFFFFF" : colors.muted}
              strokeWidth={2.4}
            />
            <Text
              tone="label"
              style={[
                styles.toggleText,
                { color: viewMode === "month" ? "#FFFFFF" : colors.muted, fontWeight: "800" },
              ]}
            >
              {language === "am" ? "ወር" : "Month"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === "year" }}
            onPress={() => {
              setViewMode("year");
              setTimeout(() => {
                yearScrollRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
            style={[
              styles.toggleButton,
              viewMode === "year" && [styles.activeToggleButton, { backgroundColor: colors.primary }],
            ]}
          >
            <LucideIcon
              name="book-open"
              size={13}
              color={viewMode === "year" ? "#FFFFFF" : colors.muted}
              strokeWidth={2.4}
            />
            <Text
              tone="label"
              style={[
                styles.toggleText,
                { color: viewMode === "year" ? "#FFFFFF" : colors.muted, fontWeight: "800" },
              ]}
            >
              {language === "am" ? "ዓመት" : "Year"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Month 30-Day Grid */}
      {viewMode === "month" ? (
        <View style={styles.monthGridWrap}>
          <View style={[styles.weekdaysHeader, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            {weekdayLabels.map((lbl, idx) => (
              <Text tone="label" key={`wk-${idx}`} style={[styles.weekdayColLabel, { color: colors.primary }]}>
                {lbl}
              </Text>
            ))}
          </View>

          <View style={styles.gridDays}>
            {Array.from({ length: monthData.length > 0 ? monthData[0].date.getDay() : 0 }).map((_, idx) => (
              <View key={`empty-heat-${idx}`} style={styles.monthCellOuter} />
            ))}
            {monthData.map((day) => {
              const isSelected = selectedDay?.dateKey === day.dateKey;
              return (
                <View key={day.dateKey} style={styles.monthCellOuter}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${formatEthiopianDate(day.ethiopianDate, language)}`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedDay(day)}
                    style={({ pressed }) => [
                      styles.monthSquare,
                      {
                        backgroundColor: getSquareColor(day.intensity),
                        borderColor: isSelected ? colors.primary : getBorderColor(day.intensity),
                        borderWidth: isSelected ? 2 : day.intensity > 0 ? 1 : 0,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text
                      tone="label"
                      style={[
                        styles.monthSquareNumber,
                        {
                          color: day.intensity === 3 ? "#FFFFFF" : colors.text,
                          fontWeight: day.intensity > 0 ? "800" : "500",
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
        </View>
      ) : (
        /* Year 52-Week Horizontal Scrollable Matrix */
        <View style={styles.yearContainer}>
          <ScrollView
            ref={yearScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.yearScrollContent}
          >
            <View style={styles.yearWeekdaysCol}>
              {weekdayLabels.map((lbl, idx) => (
                <Text tone="label" key={idx} style={[styles.yearWeekdayLabel, { color: colors.muted }]}>
                  {lbl}
                </Text>
              ))}
            </View>

            <View style={styles.yearMatrix}>
              {yearData.map((week, wIndex) => (
                <View key={`week-${wIndex}`} style={styles.yearColumn}>
                  {week.map((day) => {
                    const isSelected = selectedDay?.dateKey === day.dateKey;
                    const isEmpty = day.intensity === 0;
                    return (
                      <Pressable
                        key={day.dateKey}
                        onPress={() => setSelectedDay(day)}
                        style={({ pressed }) => [
                          styles.yearSquare,
                          {
                            backgroundColor: isEmpty ? colors.secondary : getSquareColor(day.intensity),
                            borderColor: isSelected ? colors.primary : isEmpty ? "transparent" : getBorderColor(day.intensity),
                            borderWidth: isSelected ? 1.5 : isEmpty ? 0 : 0.75,
                            opacity: pressed ? 0.7 : 1,
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

      {/* Selected Day Detail Card */}
      {activeDay ? (
        <View style={[styles.dayDetailBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text tone="title" style={[styles.dayDetailDate, { color: colors.text }]}>
              {formatEthiopianDate(activeDay.ethiopianDate, language)}
            </Text>
            <Text style={[styles.dayDetailGreg, { color: colors.muted }]} numberOfLines={1}>
              {formatGregorianDate(activeDay.date, language)} •{" "}
              {activeDay.count === 0
                ? language === "am"
                  ? "ምንም ክንውን አልተመዘገበም"
                  : "No activity logged"
                : language === "am"
                ? `${activeDay.count} መንፈሳዊ ክንውን ተፈጽሟል`
                : `${activeDay.count} practices completed`}
            </Text>
          </View>
          <Pill
            label={activeDay.count === 0 ? "0 ✓" : `${activeDay.count} ✓`}
            tone={activeDay.count > 0 ? "primary" : "muted"}
          />
        </View>
      ) : null}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Footer Legend */}
      <View style={styles.legendRow}>
        <Text tone="label" style={[styles.legendText, { color: colors.muted }]}>
          {language === "am" ? "አነስተኛ" : "Less"}
        </Text>
        <View style={styles.legendSquares}>
          <View style={[styles.legendSq, { backgroundColor: colors.secondary, borderColor: colors.border }]} />
          <View style={[styles.legendSq, { backgroundColor: colors.activityLow, borderColor: colors.activityLow }]} />
          <View style={[styles.legendSq, { backgroundColor: colors.activityMedium, borderColor: colors.activityMedium }]} />
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
  container: { padding: 14, gap: 8 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  titleWrap: { flex: 1, gap: 2 },
  title: { fontSize: 14, fontWeight: "800", lineHeight: 19 },
  streakBadgeText: { fontSize: 12, fontWeight: "800", lineHeight: 16 },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 3,
    alignItems: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  activeToggleButton: {
    ...Platform.select({
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
    }),
  },
  toggleText: { fontSize: 11, fontWeight: "700" },
  monthGridWrap: { paddingVertical: 2 },
  weekdaysHeader: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 6,
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
    height: 38,
    borderRadius: 10,
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
  yearWeekdayLabel: { fontSize: 9, fontWeight: "700", height: 12, lineHeight: 12 },
  yearMatrix: { flexDirection: "row", gap: 4 },
  yearColumn: { gap: 4 },
  yearSquare: { width: 12, height: 12, borderRadius: 2.5 },
  dayDetailBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  dayDetailDate: { fontSize: 13, fontWeight: "800", lineHeight: 18 },
  dayDetailGreg: { fontSize: 11, marginTop: 1 },
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
  divider: { height: 1, width: "100%", marginVertical: 4 },
});
