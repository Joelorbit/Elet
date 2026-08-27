import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import {
  AppScreen,
  AppText as Text,
  AppTextInput,
  Card,
  IconButton,
  IconCircle,
  LucideIcon,
  Pill,
  PrimaryButton,
  RollerTimePickerModal,
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore, useTodayKey } from "@/src/features/settings/store/app-store";
import { confessionPrompts } from "@/src/features/bible/utils/content";
import { translate } from "@/src/shared/utils/i18n";
import { FastingTimerWidget } from "@/src/features/liturgy/components/orthodox-widgets";
import { authenticateBiometrics } from "@/src/features/auth/hooks/use-app-lock";
import { formatDateKey } from "@/src/features/streaks/utils/streaks";

export default function PracticeSectionScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const {
    preferences,
    prayers,
    readingPlans,
    fastingPreferences,
    spiritualFather,
    togglePrayerCompletion,
    addCustomPrayer,
    deletePrayer,
    toggleReadingCompletion,
    addCustomReading,
    deleteReading,
    createCustomFastPlan,
    toggleCustomFastDate,
    deleteCustomFastPlan,
    togglePenanceItem,
    addPenanceItem,
    deletePenanceItem,
    saveConfessionSession,
  } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const todayKey = useTodayKey();

  // Custom Prayer Form State
  const [showAddPrayer, setShowAddPrayer] = useState(false);
  const [showPrayerTimePicker, setShowPrayerTimePicker] = useState(false);
  const [customPrayerTitleAm, setCustomPrayerTitleAm] = useState("");
  const [customPrayerTitleEn, setCustomPrayerTitleEn] = useState("");
  const [customPrayerTimeLabel, setCustomPrayerTimeLabel] = useState("6:00 AM");
  const [customPrayerHour, setCustomPrayerHour] = useState("6");
  const [customPrayerMinute, setCustomPrayerMinute] = useState("0");

  // Custom Reading Form State
  const [showAddReading, setShowAddReading] = useState(false);
  const [showReadingTimePicker, setShowReadingTimePicker] = useState(false);
  const [readingTitleAm, setReadingTitleAm] = useState("");
  const [readingTitleEn, setReadingTitleEn] = useState("");
  const [readingThemeAm, setReadingThemeAm] = useState("የግል ንባብ");
  const [readingThemeEn, setReadingThemeEn] = useState("Custom Reading");
  const [readingRef, setReadingRef] = useState("");
  const [readingHour, setReadingHour] = useState("8");
  const [readingMinute, setReadingMinute] = useState("0");

  // Custom Fast Form State
  const [showAddFast, setShowAddFast] = useState(false);
  const [showFastTimePicker, setShowFastTimePicker] = useState(false);
  const [fastTitle, setFastTitle] = useState("");
  const [fastDays, setFastDays] = useState("5");
  const [fastHour, setFastHour] = useState("15");
  const [fastMinute, setFastMinute] = useState("0");
  const [fastNotes, setFastNotes] = useState("");

  // Confession form state
  const isLockRequired = preferences.appLockMode === "confession" || preferences.appLockMode === "app";
  const [confessionLocked, setConfessionLocked] = useState(isLockRequired);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [confessionNotes, setConfessionNotes] = useState("");
  const [priestQuestions, setPriestQuestions] = useState("");
  const [confessionSaved, setConfessionSaved] = useState(false);

  // Penance item state
  const [showAddPenance, setShowAddPenance] = useState(false);
  const [newPenanceTitle, setNewPenanceTitle] = useState("");
  const [newPenanceCount, setNewPenanceCount] = useState("41");

  const handleAddCustomPrayer = () => {
    if (!customPrayerTitleAm.trim() && !customPrayerTitleEn.trim()) return;
    addCustomPrayer({
      titleAm: customPrayerTitleAm.trim() || customPrayerTitleEn.trim(),
      titleEn: customPrayerTitleEn.trim() || customPrayerTitleAm.trim(),
      timeLabel: customPrayerTimeLabel.trim() || "Daily",
      hour: parseInt(customPrayerHour, 10) || 7,
    });
    setCustomPrayerTitleAm("");
    setCustomPrayerTitleEn("");
    setShowAddPrayer(false);
  };

  const handleAddCustomReading = () => {
    if (!readingTitleAm.trim() && !readingTitleEn.trim() && !readingRef.trim()) return;
    addCustomReading({
      titleAm: readingTitleAm.trim() || readingTitleEn.trim() || readingRef.trim(),
      titleEn: readingTitleEn.trim() || readingTitleAm.trim() || readingRef.trim(),
      themeAm: readingThemeAm.trim() || "የግል ንባብ",
      themeEn: readingThemeEn.trim() || "Custom Reading",
      reference: readingRef.trim() || "Holy Scripture",
      hour: parseInt(readingHour, 10) || 8,
    });
    setReadingTitleAm("");
    setReadingTitleEn("");
    setReadingRef("");
    setShowAddReading(false);
  };

  const handleCreateFast = () => {
    if (!fastTitle.trim()) return;
    const targetDays = parseInt(fastDays, 10) || 5;
    const now = new Date();
    const endDate = new Date(now.getTime() + targetDays * 86400000);
    createCustomFastPlan({
      title: fastTitle.trim(),
      startDateKey: formatDateKey(now),
      endDateKey: formatDateKey(endDate),
      targetDays,
      breakFastHour: parseInt(fastHour, 10) || 15,
      breakFastMinute: 0,
      notes: fastNotes.trim() || undefined,
    });
    setFastTitle("");
    setFastNotes("");
    setShowAddFast(false);
  };

  const handleUnlockConfession = async () => {
    const success = await authenticateBiometrics({
      promptMessage:
        language === "am"
          ? "የንስሐ ዝግጅትዎን ለመክፈት የጣት አሻራዎን ይጠቀሙ"
          : "Unlock Confession Preparation",
      fallbackLabel: language === "am" ? "ይለፍ ቃል ተጠቀም" : "Use Passcode",
      cancelLabel: language === "am" ? "ሰርዝ" : "Cancel",
    });
    if (success) {
      setConfessionLocked(false);
    }
  };

  const togglePrompt = (id: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSaveConfession = () => {
    saveConfessionSession({
      preparationDate: todayKey,
      selectedPromptIds: selectedPrompts,
      notes: confessionNotes,
      questionsForPriest: priestQuestions,
      completed: false,
    });
    setConfessionSaved(true);
  };

  const handleAddPenance = () => {
    if (!newPenanceTitle.trim()) return;
    addPenanceItem(newPenanceTitle.trim(), parseInt(newPenanceCount, 10) || undefined);
    setNewPenanceTitle("");
    setShowAddPenance(false);
  };

  // Section 1: Prayer Hours (ሰዓታት) with Full CRUD (Delete any prayer & Add custom)
  if (section === "prayer") {
    return (
      <AppScreen scroll>
        <View style={styles.header}>
          <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
              {language === "am" ? "የጸሎት ሰዓታትና ልምምድ" : "PRAYER ROUTINES & HOURS"}
            </Text>
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {t("prayerRoutine")}
            </Text>
          </View>
        </View>

        {/* Add Custom Prayer Button */}
        <PrimaryButton
          label={showAddPrayer ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "+ አዲስ የጸሎት ሰዓት ጨምር" : "+ Add Custom Prayer Hour")}
          icon={showAddPrayer ? "x" : "plus"}
          tone={showAddPrayer ? "soft" : "primary"}
          onPress={() => setShowAddPrayer((prev) => !prev)}
        />

        {showAddPrayer && (
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
            <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "አዲስ የግል የጸሎት ሰዓት" : "New Custom Prayer Routine"}
            </Text>
            <AppTextInput
              value={customPrayerTitleAm}
              onChangeText={setCustomPrayerTitleAm}
              placeholder={language === "am" ? "የጸሎቱ ስም በአማርኛ (ለምሳሌ፡ የሠርክ ምስጋና)..." : "Prayer name (Amharic)..."}
            />
            <AppTextInput
              value={customPrayerTitleEn}
              onChangeText={setCustomPrayerTitleEn}
              placeholder={language === "am" ? "የጸሎቱ ስም በእንግሊዝኛ..." : "Prayer name in English..."}
            />
            <Pressable
              onPress={() => setShowPrayerTimePicker(true)}
              style={[
                styles.timePickerButton,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <LucideIcon name="bell" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text tone="label" style={{ fontSize: 11, color: colors.muted }}>
                  {language === "am" ? "የጸሎት ሰዓት ይምረጡ" : "Select Prayer Time"}
                </Text>
                <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                  {customPrayerTimeLabel}
                </Text>
              </View>
              <LucideIcon name="chevron-right" size={18} color={colors.primary} />
            </Pressable>

            <RollerTimePickerModal
              visible={showPrayerTimePicker}
              initialHour24={parseInt(customPrayerHour, 10) || 6}
              initialMinute={parseInt(customPrayerMinute, 10) || 0}
              language={language}
              title={language === "am" ? "የጸሎት ሰዓት ማስተካከያ" : "Set Prayer Time"}
              onSave={(val) => {
                const hour12 = val.hour24 % 12 === 0 ? 12 : val.hour24 % 12;
                const period = val.hour24 >= 12 ? "PM" : "AM";
                const label = `${hour12}:${String(val.minute).padStart(2, "0")} ${period}`;
                setCustomPrayerHour(String(val.hour24));
                setCustomPrayerMinute(String(val.minute));
                setCustomPrayerTimeLabel(label);
              }}
              onClose={() => setShowPrayerTimePicker(false)}
            />
            <PrimaryButton
              label={language === "am" ? "የጸሎት ሰዓቱን አስቀምጥ" : "Save Prayer Routine"}
              icon="check"
              onPress={handleAddCustomPrayer}
            />
          </Card>
        )}

        <SectionHeader title={language === "am" ? "የጸሎት ሰዓታት ዝርዝር" : "Configured Prayer Routines"} />

        <View style={styles.list}>
          {prayers.map((prayer) => {
            const isCompleted = prayer.completedDates.includes(todayKey);
            return (
              <Card key={prayer.id} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <IconCircle icon="church" color={isCompleted ? "primary" : "muted"} size={48} />
                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>
                        {prayer.title[language] || prayer.title.en}
                      </Text>
                      <Text style={[styles.cardDetail, { color: colors.muted }]}>
                        {prayer.timeLabel[language] || prayer.timeLabel.en}
                        {prayer.custom ? ` • ${language === "am" ? "የግል ጸሎት" : "Custom"}` : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <IconButton
                      icon="trash"
                      size={36}
                      color={colors.danger}
                      backgroundColor={colors.dangerContainer}
                      accessibilityLabel="Delete prayer"
                      onPress={() => deletePrayer(prayer.id)}
                    />
                    <Pressable
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        togglePrayerCompletion(prayer.id);
                      }}
                      style={[
                        styles.checkButton,
                        {
                          backgroundColor: isCompleted ? colors.primary : colors.secondary,
                          borderColor: isCompleted ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <LucideIcon name="check" size={18} color={isCompleted ? "#FFFFFF" : colors.muted} strokeWidth={2.6} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </AppScreen>
    );
  }

  // Section 2: Readings with Full Custom Reading Plans & Link to 81-Canon Reader
  if (section === "readings") {
    return (
      <AppScreen scroll>
        <View style={styles.header}>
          <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
              {language === "am" ? "የዕለቱ ንባባትና መጽሐፍ ቅዱስ" : "SCRIPTURE & READINGS"}
            </Text>
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {t("readingPlan")}
            </Text>
          </View>
        </View>

        {/* Add Custom Reading Plan Button */}
        <PrimaryButton
          label={showAddReading ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "+ አዲስ የመጽሐፍ ቅዱስ ንባብ ጨምር" : "+ Add Custom Reading Plan")}
          icon={showAddReading ? "x" : "plus"}
          tone={showAddReading ? "soft" : "primary"}
          onPress={() => setShowAddReading((prev) => !prev)}
        />

        {showAddReading && (
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.gold, gap: 10, borderWidth: 1.5 }}>
            <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "አዲስ የግል የንባብ መርሐ ግብር" : "New Custom Reading Plan"}
            </Text>
            <AppTextInput
              value={readingTitleAm}
              onChangeText={setReadingTitleAm}
              placeholder={language === "am" ? "የንባቡ ርዕስ (ለምሳሌ፡ የዮሐንስ ወንጌል ጥናት)..." : "Reading Title (e.g. Gospel of John Study)..."}
            />
            <AppTextInput
              value={readingRef}
              onChangeText={setReadingRef}
              placeholder={language === "am" ? "የመጽሐፍ ቅዱስ ክፍል (ለምሳሌ፡ ዮሐንስ 1-3)..." : "Scripture Reference (e.g. John 1–3)..."}
            />
            <AppTextInput
              value={readingThemeAm}
              onChangeText={setReadingThemeAm}
              placeholder={language === "am" ? "ጭብጥ (ለምሳሌ፡ ወንጌል / ጥበብ)..." : "Theme..."}
            />

            <Pressable
              onPress={() => setShowReadingTimePicker(true)}
              style={[
                styles.timePickerButton,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <LucideIcon name="bell" size={18} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text tone="label" style={{ fontSize: 11, color: colors.muted }}>
                  {language === "am" ? "የንባብ ማሳሰቢያ ሰዓት" : "Reading Reminder Time"}
                </Text>
                <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                  {`${parseInt(readingHour, 10) % 12 === 0 ? 12 : parseInt(readingHour, 10) % 12}:${String(readingMinute).padStart(2, "0")} ${parseInt(readingHour, 10) >= 12 ? "PM" : "AM"}`}
                </Text>
              </View>
              <LucideIcon name="chevron-right" size={18} color={colors.primary} />
            </Pressable>

            <RollerTimePickerModal
              visible={showReadingTimePicker}
              initialHour24={parseInt(readingHour, 10) || 8}
              initialMinute={parseInt(readingMinute, 10) || 0}
              language={language}
              title={language === "am" ? "የንባብ ሰዓት ማስተካከያ" : "Set Reading Reminder Time"}
              onSave={(val) => {
                setReadingHour(String(val.hour24));
                setReadingMinute(String(val.minute));
              }}
              onClose={() => setShowReadingTimePicker(false)}
            />

            <PrimaryButton
              label={language === "am" ? "የንባብ ዕቅዱን አስቀምጥ" : "Save Reading Plan"}
              icon="check"
              onPress={handleAddCustomReading}
            />
          </Card>
        )}

        <SectionHeader title={language === "am" ? "የንባብ መርሐ ግብሮች" : "Configured Reading Plans"} />

        <View style={styles.list}>
          {readingPlans.map((reading) => {
            const isCompleted = reading.completedDates.includes(todayKey);
            return (
              <Card key={reading.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 8 }}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text tone="label" style={[styles.themeLabel, { color: colors.gold }]}>
                      {reading.theme[language] || reading.theme.en}
                      {reading.reminderHour !== undefined ? ` • ${reading.reminderHour}:00` : ""}
                    </Text>
                    <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>
                      {reading.title[language] || reading.title.en}
                    </Text>
                    <Text style={[styles.refText, { color: colors.primary }]}>{reading.reference}</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <IconButton
                      icon="trash"
                      size={36}
                      color={colors.danger}
                      backgroundColor={colors.dangerContainer}
                      accessibilityLabel="Delete reading"
                      onPress={() => deleteReading(reading.id)}
                    />
                    <Pressable
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        toggleReadingCompletion(reading.id);
                      }}
                      style={[
                        styles.checkButton,
                        {
                          backgroundColor: isCompleted ? colors.primary : colors.secondary,
                          borderColor: isCompleted ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <LucideIcon name="check" size={18} color={isCompleted ? "#FFFFFF" : colors.muted} strokeWidth={2.6} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </AppScreen>
    );
  }

  // Section 3: Fasting (Live Timer + Custom Fasting Plans + 7 Canonical Fasts)
  if (section === "fasting") {
    const customPlans = fastingPreferences?.customFastPlans || [];

    return (
      <AppScreen scroll>
        <View style={styles.header}>
          <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
              {language === "am" ? "የጾም ሰዓትና ሥርዓት" : "FASTING & ABSTINENCE"}
            </Text>
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {t("fastingPlanner")}
            </Text>
          </View>
        </View>

        {/* Live Fasting Countdown Clock */}
        <FastingTimerWidget
          language={language}
          breakFastHour={fastingPreferences?.breakFastHour ?? 15}
          breakFastMinute={fastingPreferences?.breakFastMinute ?? 0}
        />

        {/* Add Custom Fasting Plan Button */}
        <PrimaryButton
          label={showAddFast ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "+ አዲስ የስእለት / የንስሐ ጾም ጨምር" : "+ Add Custom Fasting Plan")}
          icon={showAddFast ? "x" : "plus"}
          tone={showAddFast ? "soft" : "primary"}
          onPress={() => setShowAddFast((prev) => !prev)}
        />

        {showAddFast && (
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
            <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "አዲስ የግል / የንስሐ ጾም መርሐ ግብር" : "New Custom Fasting Plan"}
            </Text>
            <AppTextInput
              value={fastTitle}
              onChangeText={setFastTitle}
              placeholder={language === "am" ? "የጾሙ ስም (ለምሳሌ፡ የንስሐ አባት ያዘዙት የ5 ቀን ጾም)..." : "Fasting Title (e.g. 5-Day Penance Fast)..."}
            />
            <AppTextInput
              value={fastDays}
              onChangeText={setFastDays}
              placeholder={language === "am" ? "የቀናት ብዛት (5)..." : "Target Days (e.g. 5)..."}
            />

            <Pressable
              onPress={() => setShowFastTimePicker(true)}
              style={[
                styles.timePickerButton,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <LucideIcon name="utensils" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text tone="label" style={{ fontSize: 11, color: colors.muted }}>
                  {language === "am" ? "የጾም መፍቻ ሰዓት" : "Fast Break Time"}
                </Text>
                <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                  {`${parseInt(fastHour, 10) % 12 === 0 ? 12 : parseInt(fastHour, 10) % 12}:${String(fastMinute).padStart(2, "0")} ${parseInt(fastHour, 10) >= 12 ? "PM" : "AM"}`}
                </Text>
              </View>
              <LucideIcon name="chevron-right" size={18} color={colors.primary} />
            </Pressable>

            <RollerTimePickerModal
              visible={showFastTimePicker}
              initialHour24={parseInt(fastHour, 10) || 15}
              initialMinute={parseInt(fastMinute, 10) || 0}
              language={language}
              title={language === "am" ? "የጾም መፍቻ ሰዓት ማስተካከያ" : "Set Fast Break Time"}
              onSave={(val) => {
                setFastHour(String(val.hour24));
                setFastMinute(String(val.minute));
              }}
              onClose={() => setShowFastTimePicker(false)}
            />

            <AppTextInput
              value={fastNotes}
              onChangeText={setFastNotes}
              placeholder={language === "am" ? "የካህኑ ትዕዛዝ ወይም የግል ዓላማ ማስታወሻ..." : "Notes or instructions from spiritual father..."}
              multiline
            />
            <PrimaryButton
              label={language === "am" ? "የጾም መርሐ ግብሩን አስቀምጥ" : "Save Fasting Plan"}
              icon="check"
              onPress={handleCreateFast}
            />
          </Card>
        )}

        {/* Active Custom Fast Plans */}
        {customPlans.length > 0 && (
          <>
            <SectionHeader title={language === "am" ? "የግልና የንስሐ አጽዋማት" : "My Custom Fasting Plans"} />
            <View style={{ gap: 10 }}>
              {customPlans.map((plan) => {
                const isTodayDone = plan.completedDates.includes(todayKey);
                const completedCount = plan.completedDates.length;
                const progressPct = Math.min(100, Math.round((completedCount / plan.targetDays) * 100));

                return (
                  <Card key={plan.id} style={{ backgroundColor: colors.surface, borderColor: colors.gold, borderWidth: 1.5, gap: 10 }}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text tone="title" style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>
                          {plan.title}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {completedCount}/{plan.targetDays} {language === "am" ? "ቀናት ተፈጽመዋል" : "days completed"} • {plan.breakFastHour > 12 ? plan.breakFastHour - 12 : plan.breakFastHour}:00 {plan.breakFastHour >= 12 ? "PM" : "AM"}
                        </Text>
                      </View>
                      <IconButton
                        icon="trash"
                        size={34}
                        color={colors.danger}
                        backgroundColor={colors.dangerContainer}
                        accessibilityLabel="Delete fast"
                        onPress={() => deleteCustomFastPlan(plan.id)}
                      />
                    </View>

                    {/* Progress Bar */}
                    <View style={[styles.progressBarTrack, { backgroundColor: colors.secondary }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            backgroundColor: completedCount >= plan.targetDays ? colors.emerald : colors.gold,
                            width: `${progressPct}%`,
                          },
                        ]}
                      />
                    </View>

                    {/* Today Fast Check-off Button with safe horizontal layout */}
                    <View style={[styles.rowBetween, { alignItems: "center", gap: 8 }]}>
                      <Text style={{ flex: 1, minWidth: 0, fontSize: 12, color: colors.muted }} numberOfLines={1}>
                        {plan.notes || (language === "am" ? "የተቀደሰ የጾም ጊዜ" : "Active Fasting Journey")}
                      </Text>
                      <Pressable
                        onPress={() => {
                          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          toggleCustomFastDate(plan.id, todayKey);
                        }}
                        style={[
                          styles.fastCheckButton,
                          {
                            backgroundColor: isTodayDone ? colors.primary : colors.secondary,
                            borderColor: isTodayDone ? colors.primary : colors.border,
                            flexShrink: 0,
                          },
                        ]}
                      >
                        <LucideIcon name="check" size={14} color={isTodayDone ? "#FFFFFF" : colors.muted} strokeWidth={2.8} />
                        <Text
                          tone="label"
                          style={{
                            color: isTodayDone ? "#FFFFFF" : colors.text,
                            fontWeight: "800",
                            fontSize: 11,
                          }}
                        >
                          {isTodayDone ? (language === "am" ? "ተፈጽሟል ✓" : "Done ✓") : (language === "am" ? "ፈጽም" : "Mark")}
                        </Text>
                      </Pressable>
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        )}

        <SectionHeader title={language === "am" ? "7ቱ ቀኖናዊ አጽዋማት" : "The 7 Canonical Fasts"} />
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 12 }}>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "1. ዐቢይ ጾም (ሁዳዴ - 55 ቀናት)" : "1. Great Lent (55 Days)"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am"
                ? "ጌታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመው የ55 ቀናት ታላቅ ጾም።"
                : "Commemorating Christ's 40-day fast and Holy Passion Week."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "2. ጾመ ነቢያት (የገና ጾም - 44 ቀናት)" : "2. Fast of Prophets (44 Days)"} tone="gold" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "ከኅዳር 15 እስከ ታኅሣሥ 28 የሚጾም የገና ጾም።" : "Advent fast observed from Hidar 15 to Tahsas 28."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "3. ጾመ ነነዌ (3 ቀናት)" : "3. Fast of Nineveh (3 Days)"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "የነነዌ ሰዎች በንስሐ የዳኑበት የ3 ቀናት ጾም።" : "3 days of repentance and mercy."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "4. ጾመ ፍልሰታ (16 ቀናት)" : "4. Fast of Filseta (16 Days)"} tone="gold" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "ከነሐሴ 1 እስከ 16 የእመቤታችን የዕርገት ጾም።" : "Assumption of the Virgin Mary, Nehase 1–16."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "5. ጾመ ሐዋርያት (የሰኔ ጾም)" : "5. Fast of the Apostles"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "ከጰራቅሊጦስ ማግሥት እስከ ሐምሌ 4 የሚጾም ጾም።" : "Observed after Pentecost until feast of Peter & Paul."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "6. ጾመ ገሃድ" : "6. Gahad Fast"} tone="gold" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "የገናና የጥምቀት በዓላት ዋዜማ ጾም።" : "Eve of Nativity and Theophany."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "7. ጾመ ድኅነት (ረቡዕ/ዓርብ)" : "7. Wednesdays & Fridays"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "በዓመቱ ሙሉ የሚጾሙ ሳምንታዊ አጽዋማት (ከ50ው የትንሣኤ ቀናት ውጪ)።" : "Weekly fasts remembering the betrayal and crucifixion."}
            </Text>
          </View>
        </Card>
      </AppScreen>
    );
  }

  // Section 4: Confession Preparation & Spiritual Father with Biometric Lock Option
  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {language === "am" ? "ምስጢረ ንስሐና የነፍስ አባት" : "SACRAMENT OF CONFESSION"}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {t("confession")}
          </Text>
        </View>
      </View>

      {/* Confession Lock Card */}
      {confessionLocked ? (
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.gold, padding: 24, gap: 16, alignItems: "center" }}>
          <IconCircle icon="lock" color="gold" size={64} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text tone="title" style={{ fontSize: 18, fontWeight: "900", color: colors.text, textAlign: "center" }}>
              {language === "am" ? "የንስሐ ማስታወሻ ተቆልፏል" : "Confession Notes Locked"}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 18 }}>
              {language === "am"
                ? "የንስሐ ዝግጅትዎና የግል ጥያቄዎችዎ በምስጢር ተቆልፈዋል። ለመክፈት አረጋግጡ።"
                : "Your confession reflection notes and questions for your confessor are encrypted."}
            </Text>
          </View>
          <PrimaryButton
            label={language === "am" ? "በጣት አሻራ / በይለፍ ቃል ክፈት" : "Unlock Confession Prep"}
            icon="lock-open"
            onPress={handleUnlockConfession}
          />
        </Card>
      ) : (
        <>
          {/* Unlocked Confession View */}
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <IconCircle icon="shield-check" color="primary" size={40} />
                <View>
                  <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "የተከፈተ የንስሐ ዝግጅት" : "Confession Preparation Active"}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {language === "am" ? "100% በመሣሪያዎ ብቻ ይቀመጣል" : "100% Local & Encrypted"}
                  </Text>
                </View>
              </View>
              <IconButton
                icon="lock"
                size={38}
                accessibilityLabel="Lock"
                onPress={() => setConfessionLocked(true)}
              />
            </View>
          </Card>

          {/* Examination of Conscience Prompts */}
          <SectionHeader title={language === "am" ? "የሕሊና ምርመራ ነጥቦች" : "Examination of Conscience"} />
          <View style={{ gap: 8 }}>
            {confessionPrompts.map((prompt) => {
              const isSelected = selectedPrompts.includes(prompt.id);
              return (
                <Pressable
                  key={prompt.id}
                  onPress={() => togglePrompt(prompt.id)}
                  style={[
                    styles.promptItem,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.promptCheck,
                      {
                        borderColor: isSelected ? colors.primary : colors.muted,
                        backgroundColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    {isSelected && <LucideIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={[styles.promptText, { color: colors.text }]}>
                    {prompt.text[language] || prompt.text.en}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Private Notes for Confession */}
          <SectionHeader title={language === "am" ? "የግል ማስታወሻ" : "Private Reflection Notes"} />
          <AppTextInput
            value={confessionNotes}
            onChangeText={setConfessionNotes}
            placeholder={language === "am" ? "የግል የንስሐ ማስታወሻ ይጻፉ..." : "Write your private reflections..."}
            multiline
          />

          {/* Questions for Spiritual Father */}
          <SectionHeader title={language === "am" ? "ለነፍስ አባት የሚጠየቁ ጥያቄዎች" : "Questions for Spiritual Father"} />
          <AppTextInput
            value={priestQuestions}
            onChangeText={setPriestQuestions}
            placeholder={language === "am" ? "ለካህኑ የሚቀርቡ ጥያቄዎች..." : "Questions for your confessor..."}
            multiline
          />

          <PrimaryButton
            label={confessionSaved ? (language === "am" ? "ተቀምጧል ✓" : "Saved ✓") : (language === "am" ? "ዝግጅቱን አስቀምጥ" : "Save Preparation")}
            icon="check"
            onPress={handleSaveConfession}
          />
        </>
      )}

      {/* Penance Items Section */}
      <SectionHeader
        title={language === "am" ? "ቀኖናና ስግደት" : "Penance & Prostrations"}
        action={
          <Pressable onPress={() => setShowAddPenance((prev) => !prev)}>
            <Text tone="title" style={{ fontSize: 13, color: colors.primary }}>
              {showAddPenance ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "+ አዲስ ቀኖና" : "+ Add Penance")}
            </Text>
          </Pressable>
        }
      />

      {showAddPenance && (
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
          <AppTextInput
            value={newPenanceTitle}
            onChangeText={setNewPenanceTitle}
            placeholder={language === "am" ? "የቀኖናው ስም (ለምሳሌ፡ 41 ስግደት)..." : "Penance item (e.g. 41 Prostrations)..."}
          />
          <AppTextInput
            value={newPenanceCount}
            onChangeText={setNewPenanceCount}
            placeholder={language === "am" ? "የስግደት ቁጥር (41)..." : "Target Count (41)..."}
          />
          <PrimaryButton
            label={language === "am" ? "ቀኖናውን መዝግብ" : "Save Penance Item"}
            icon="check"
            onPress={handleAddPenance}
          />
        </Card>
      )}

      <View style={{ gap: 8 }}>
        {spiritualFather.penanceItems.map((item) => (
          <Card key={item.id} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View style={styles.rowBetween}>
              <Pressable
                onPress={() => togglePenanceItem(item.id)}
                style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={[
                    styles.promptCheck,
                    {
                      borderColor: item.completed ? colors.primary : colors.muted,
                      backgroundColor: item.completed ? colors.primary : "transparent",
                    },
                  ]}
                >
                  {item.completed && <LucideIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    tone="title"
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: item.completed ? colors.muted : colors.text,
                      textDecorationLine: item.completed ? "line-through" : "none",
                    }}
                  >
                    {item.title} {item.targetCount ? `(${item.targetCount}x)` : ""}
                  </Text>
                </View>
              </Pressable>
              <IconButton
                icon="trash"
                size={34}
                color={colors.danger}
                backgroundColor={colors.dangerContainer}
                accessibilityLabel="Delete"
                onPress={() => deletePenanceItem(item.id)}
              />
            </View>
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  title: { fontSize: 20, fontWeight: "800", marginTop: 1 },
  list: { gap: 10, marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, width: "100%" },
  row: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, minWidth: 0 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardDetail: { fontSize: 12, marginTop: 1 },
  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  themeLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  refText: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  bibleReaderCard: { padding: 16, borderWidth: 1.5 },
  chevronSlot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  fastingItem: { gap: 4 },
  fastingDesc: { fontSize: 12, lineHeight: 17 },
  progressBarTrack: { height: 8, borderRadius: 4, overflow: "hidden", width: "100%" },
  progressBarFill: { height: "100%", borderRadius: 4 },
  fastCheckButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  promptItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  promptCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText: { fontSize: 13, lineHeight: 18, flex: 1 },
});
