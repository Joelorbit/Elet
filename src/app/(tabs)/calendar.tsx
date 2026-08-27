import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppScreen,
  AppText as Text,
  Card,
  IconButton,
  IconCircle,
  LucideIcon,
  Pill,
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppLanguage } from "@/src/features/settings/store/app-store";
import {
  daysInEthiopianMonth,
  ethiopianToGregorian,
  formatEthiopianDate,
  formatGregorianDate,
  getDayObservance,
  getEthiopianFastForDate,
  getEthiopianMonths,
  getMovableFeastForDate,
  gregorianToEthiopian,
  isFastingDay,
} from "@/src/features/liturgy/utils/calendar";
import { translate } from "@/src/shared/utils/i18n";
import {
  dailyReflection,
  getAnnualFeast,
  getMonthlyCommemoration,
  localizedAnnualFeastSignificance,
  localizedAnnualFeastTitle,
  localizedCommemorationTitle,
} from "@/src/features/liturgy/utils/monthly-commemorations";
import type { EthiopianDate } from "@/src/types/app";

export default function CalendarScreen() {
  const language = useAppLanguage();
  const colors = useAppColors();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const today = gregorianToEthiopian(new Date());
  const [view, setView] = useState<EthiopianDate>(today);
  const [selectedDay, setSelectedDay] = useState(today.day);
  const months = getEthiopianMonths(language);
  const days = Array.from({ length: daysInEthiopianMonth(view.year, view.month) }, (_, index) => index + 1);
  const firstGregorian = ethiopianToGregorian({ year: view.year, month: view.month, day: 1 });
  const leadingEmpty = firstGregorian.getDay();
  const selected = { ...view, day: selectedDay };
  const selectedGregorian = ethiopianToGregorian(selected);
  const commemoration = getMonthlyCommemoration(selected.day);
  const annualFeast = getAnnualFeast(selected.month, selected.day, selected.year);
  const movableFeast = getMovableFeastForDate(selected);
  const seasonalFast = getEthiopianFastForDate(selected);
  const fastingCheck = isFastingDay(selectedGregorian);

  const goMonth = (delta: number) => {
    const nextMonth = view.month + delta;
    if (nextMonth < 1) setView({ year: view.year - 1, month: 13, day: 1 });
    else if (nextMonth > 13) setView({ year: view.year + 1, month: 1, day: 1 });
    else setView({ ...view, month: nextMonth, day: 1 });
    setSelectedDay(1);
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <View>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {t("calendar")}
          </Text>
          <Text tone="display" style={[styles.title, { color: colors.text }]}>
            {months[view.month - 1]} {view.year}
          </Text>
        </View>
        <IconButton
          icon="calendar"
          accessibilityLabel={language === "am" ? "ወደ ዛሬ ተመለስ" : "Return to today"}
          color={colors.gold}
          backgroundColor={colors.goldContainer}
          onPress={() => {
            setView(today);
            setSelectedDay(today.day);
          }}
        />
      </View>

      <Card style={{ padding: 12, gap: 10 }}>
        {/* Month Navigation Controls */}
        <View style={styles.monthControls}>
          <IconButton
            icon="chevron-left"
            accessibilityLabel={language === "am" ? "ያለፈው ወር" : "Previous month"}
            color={colors.primary}
            backgroundColor={colors.secondary}
            size={42}
            onPress={() => goMonth(-1)}
          />
          <View style={styles.monthTitleWrap}>
            <Text tone="title" style={[styles.monthTitle, { color: colors.text }]}>
              {months[view.month - 1]}
            </Text>
            <Text tone="label" style={[styles.yearSubtitle, { color: colors.primary }]}>
              {view.year} {language === "am" ? "ዓ.ም" : "E.C."} • {selectedGregorian.getFullYear()}
            </Text>
          </View>
          <IconButton
            icon="chevron-right"
            accessibilityLabel={language === "am" ? "የሚቀጥለው ወር" : "Next month"}
            color={colors.primary}
            backgroundColor={colors.secondary}
            size={42}
            onPress={() => goMonth(1)}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Weekday Headers */}
        <View style={[styles.weekdays, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          {(language === "am" ? ["እ", "ሰ", "ማ", "ረ", "ሐ", "ዓ", "ቅ"] : ["S", "M", "T", "W", "T", "F", "S"]).map(
            (day, index) => (
              <Text tone="label" key={`${day}-${index}`} style={[styles.weekday, { color: colors.primary }]}>
                {day}
              </Text>
            )
          )}
        </View>

        {/* Calendar Day Grid */}
        <View style={styles.grid}>
          {Array.from({ length: leadingEmpty }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayCellOuter} />
          ))}
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = today.year === view.year && today.month === view.month && today.day === day;
            const dateForDay = ethiopianToGregorian({ ...view, day });
            const ethDateForDay = { ...view, day };
            const dayFast = isFastingDay(dateForDay).isFast;
            const dayAnnualFeast = getAnnualFeast(view.month, day, view.year);
            const dayMovableFeast = getMovableFeastForDate(ethDateForDay);

            let cellBg = colors.secondary;
            let cellBorder = colors.border;
            let dayTextColor = colors.text;
            let cellBorderWidth = 0;

            if (isSelected && isToday) {
              cellBg = colors.primary;
              cellBorder = colors.gold;
              dayTextColor = "#FFFFFF";
              cellBorderWidth = 2.5;
            } else if (isSelected) {
              cellBg = colors.primaryContainer;
              cellBorder = colors.primary;
              dayTextColor = colors.primary;
              cellBorderWidth = 2;
            } else if (isToday) {
              cellBorder = colors.primary;
              cellBg = colors.primaryContainer;
              dayTextColor = colors.primary;
              cellBorderWidth = 2;
            } else if (dayFast) {
              cellBorder = colors.border;
              cellBg = colors.secondary;
              dayTextColor = colors.text;
              cellBorderWidth = 1;
            }

            return (
              <View key={day} style={styles.dayCellOuter}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${day}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedDay(day)}
                  style={({ pressed }) => [
                    styles.daySquare,
                    {
                      backgroundColor: cellBg,
                      borderColor: cellBorder,
                      borderWidth: cellBorderWidth,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  {isToday && !isSelected && (
                    <View
                      style={{
                        position: "absolute",
                        top: 3,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                  <Text
                    tone="label"
                    style={[
                      styles.dayNumberText,
                      {
                        color: dayTextColor,
                        fontWeight: isSelected || isToday ? "800" : "600",
                      },
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.dotRow}>
                    {(dayAnnualFeast || dayMovableFeast) && (
                      <View style={[styles.dot, { backgroundColor: isSelected && isToday ? "#FFFFFF" : colors.primary }]} />
                    )}
                    {dayFast && <View style={[styles.dot, { backgroundColor: isSelected && isToday ? colors.gold : colors.gold }]} />}
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Selected Day Details Card */}
      <SectionHeader title={t("selectedDay")} />
      <Card style={{ gap: 12 }}>
        <View style={styles.selectedHeaderRow}>
          <IconCircle
            icon={annualFeast || movableFeast ? "sparkles" : fastingCheck.isFast ? "church" : "calendar"}
            size={48}
            color={annualFeast || movableFeast ? "gold" : fastingCheck.isFast ? "primary" : "primary"}
          />
          <View style={styles.selectedDayInfo}>
            <Text tone="title" style={[styles.selectedTitle, { color: colors.text }]}>
              {formatEthiopianDate(selected, language)}
            </Text>
            <Text style={[styles.selectedDetail, { color: colors.muted }]}>
              {formatGregorianDate(selectedGregorian, language)}
            </Text>
          </View>
        </View>

        {/* Status Badges Row */}
        <View style={styles.statusChipsRow}>
          <Pill
            label={fastingCheck.isFast ? seasonalFast?.name[language] || t("fastingToday") : t("notFasting")}
            tone={fastingCheck.isFast ? "gold" : "muted"}
          />
          {annualFeast && <Pill label={language === "am" ? "ዓመታዊ ንግሥ" : "Annual Feast"} tone="primary" />}
          {movableFeast && <Pill label={language === "am" ? "ተንቀሳቃሽ በዓል" : "Canonical Feast"} tone="gold" />}
        </View>

        {/* Commemorations List */}
        {(movableFeast || annualFeast || commemoration) && (
          <View style={{ gap: 12, marginTop: 2, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
            {movableFeast && (
              <View style={styles.sleekRow}>
                <IconCircle icon="sparkles" color="gold" size={46} />
                <View style={styles.sleekCopy}>
                  <Text tone="label" style={[styles.sleekLabel, { color: colors.gold }]}>
                    {language === "am" ? "ተንቀሳቃሽ በዓል" : "CANONICAL FEAST"}
                  </Text>
                  <Text tone="title" style={[styles.sleekTitle, { color: colors.text }]}>
                    {movableFeast.name[language]}
                  </Text>
                  <Text style={[styles.sleekDetail, { color: colors.muted }]}>{movableFeast.description[language]}</Text>
                </View>
              </View>
            )}

            {annualFeast && (
              <>
                {movableFeast && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.sleekRow}>
                  <IconCircle icon="sparkles" color="primary" size={46} />
                  <View style={styles.sleekCopy}>
                    <Text tone="label" style={[styles.sleekLabel, { color: colors.primary }]}>
                      {language === "am" ? "ዓመታዊ የንግሥ በዓል" : "ANNUAL TABOT FEAST"}
                    </Text>
                    <Text tone="title" style={[styles.sleekTitle, { color: colors.text }]}>
                      {localizedAnnualFeastTitle(annualFeast, language)}
                    </Text>
                    <Text style={[styles.sleekDetail, { color: colors.muted }]}>
                      {localizedAnnualFeastSignificance(annualFeast, language)}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {commemoration && (
              <>
                {(movableFeast || annualFeast) && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.sleekRow}>
                  <IconCircle icon="church" color="gold" size={46} />
                  <View style={styles.sleekCopy}>
                    <Text tone="label" style={[styles.sleekLabel, { color: colors.gold }]}>
                      {language === "am" ? "የወር መታሰቢያ (ታቦት)" : "MONTHLY TABOT"}
                    </Text>
                    <Text tone="title" style={[styles.sleekTitle, { color: colors.text }]}>
                      {localizedCommemorationTitle(commemoration, language)}
                    </Text>
                    <Text style={[styles.sleekDetail, { color: colors.muted }]}>
                      {commemoration.description?.[language] || dailyReflection[language]}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        <Text style={[styles.notice, { color: colors.muted }]}>{getDayObservance(selectedGregorian)[language]}</Text>
        <Text tone="label" style={[styles.source, { color: colors.muted }]}>{t("sourceNotice")}</Text>
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "900", marginTop: 2 },
  monthControls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 },
  monthTitleWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  monthTitle: { textAlign: "center", fontSize: 18, fontWeight: "800" },
  yearSubtitle: { textAlign: "center", fontSize: 12, fontWeight: "700" },
  weekdays: { flexDirection: "row", borderRadius: 10, borderWidth: 1, paddingVertical: 6, marginTop: 4 },
  weekday: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 5, marginTop: 4 },
  dayCellOuter: {
    width: "14.1%",
    height: 46,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  daySquare: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayNumberText: { fontSize: 13, textAlign: "center" },
  dotRow: { flexDirection: "row", gap: 3, alignItems: "center", justifyContent: "center", height: 4 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  selectedHeaderRow: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%" },
  selectedDayInfo: { flex: 1, minWidth: 0, gap: 2 },
  selectedTitle: { fontSize: 18, fontWeight: "800" },
  selectedDetail: { fontSize: 13 },
  statusChipsRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  notice: { fontSize: 13, lineHeight: 19 },
  source: { fontSize: 11, marginTop: 2 },
  sleekRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, width: "100%" },
  sleekCopy: { flex: 1, minWidth: 0, gap: 2 },
  sleekLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 2 },
  sleekTitle: { fontSize: 15, fontWeight: "800" },
  sleekDetail: { fontSize: 13, lineHeight: 18 },
  divider: { height: 1, width: "100%", marginVertical: 4 },
});
