import { RollerTimePickerModal } from "@/src/shared/components/roller-time-picker";
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
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore, useTodayKey } from "@/src/features/settings/store/app-store";
import { confessionPrompts } from "@/src/features/bible/utils/content";
import { translate } from "@/src/shared/utils/i18n";
import { FastingTimerWidget } from "@/src/features/liturgy/components/orthodox-widgets";
import { ScriptureRefPicker } from "@/src/features/bible/components/scripture-ref-picker";
import { authenticateBiometrics } from "@/src/features/auth/hooks/use-app-lock";
import { formatDateKey } from "@/src/features/streaks/utils/streaks";
import type { ConfessionSession, ConfessionTick } from "@/src/types/app";

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
    updatePenanceItem,
    deletePenanceItem,
    saveConfessionSession,
    confessionSessions,
    deleteConfessionSession,
    confessionTicks = [],
    addConfessionTick,
    updateConfessionTick,
    toggleConfessionTick,
    deleteConfessionTick,
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
  const [customPrayerRepeatDays, setCustomPrayerRepeatDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [customPrayerAlarmMode, setCustomPrayerAlarmMode] = useState<"full_alarm" | "notification_only">("full_alarm");

  // Custom Reading Form State
  const [showAddReading, setShowAddReading] = useState(false);
  const [showReadingTimePicker, setShowReadingTimePicker] = useState(false);
  const [readingTitleAm, setReadingTitleAm] = useState("");
  const [readingTitleEn, setReadingTitleEn] = useState("");
  const [readingThemeAm, setReadingThemeAm] = useState("የግል ንባብ");
  const [readingThemeEn, setReadingThemeEn] = useState("Custom Reading");
  const [readingRef, setReadingRef] = useState("");
  const [showScripturePicker, setShowScripturePicker] = useState(false);
  const [readingHour, setReadingHour] = useState("8");
  const [readingMinute, setReadingMinute] = useState("0");
  const [readingRepeatDays, setReadingRepeatDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [readingAlarmMode, setReadingAlarmMode] = useState<"full_alarm" | "notification_only">("notification_only");

  // Custom Fast Form State
  const [showAddFast, setShowAddFast] = useState(false);
  const [showFastTimePicker, setShowFastTimePicker] = useState(false);
  const [fastTitle, setFastTitle] = useState("");
  const [fastDays, setFastDays] = useState("5");
  const [fastHour, setFastHour] = useState("15");
  const [fastMinute, setFastMinute] = useState("0");
  const [fastAlarmMode, setFastAlarmMode] = useState<"full_alarm" | "notification_only">("full_alarm");
  const [fastNotes, setFastNotes] = useState("");

  // Confession form state
  const isLockRequired = preferences.appLockMode === "confession" || preferences.appLockMode === "app";
  const [confessionLocked, setConfessionLocked] = useState(true);
  const [confessionTab, setConfessionTab] = useState<"notes" | "ticks" | "penance">("notes");

  // Confession Notes CRUD state
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [notePriestQuestions, setNotePriestQuestions] = useState("");
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Custom Ticks CRUD state
  const [showAddTickForm, setShowAddTickForm] = useState(false);
  const [newTickText, setNewTickText] = useState("");
  const [editingTickId, setEditingTickId] = useState<string | null>(null);
  const [editTickText, setEditTickText] = useState("");
  const [showChurchPrompts, setShowChurchPrompts] = useState(false);

  // Penance item state
  const [showAddPenance, setShowAddPenance] = useState(false);
  const [newPenanceTitle, setNewPenanceTitle] = useState("");
  const [newPenanceCount, setNewPenanceCount] = useState("41");
  const [editingPenanceId, setEditingPenanceId] = useState<string | null>(null);
  const [editPenanceTitle, setEditPenanceTitle] = useState("");

  const handleAddCustomPrayer = () => {
    if (!customPrayerTitleAm.trim() && !customPrayerTitleEn.trim()) return;
    addCustomPrayer({
      titleAm: customPrayerTitleAm.trim() || customPrayerTitleEn.trim(),
      titleEn: customPrayerTitleEn.trim() || customPrayerTitleAm.trim(),
      timeLabel: customPrayerTimeLabel.trim() || "Daily",
      hour: parseInt(customPrayerHour, 10) || 7,
      minute: parseInt(customPrayerMinute, 10) || 0,
      repeatDays: customPrayerRepeatDays,
      alarmMode: customPrayerAlarmMode,
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
      minute: parseInt(readingMinute, 10) || 0,
      repeatDays: readingRepeatDays,
      alarmMode: readingAlarmMode,
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
      breakFastMinute: parseInt(fastMinute, 10) || 0,
      hasFastingTargetSet: true,
      alarmMode: fastAlarmMode,
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

  const handleSaveConfessionNote = () => {
    if (!noteBody.trim() && !noteTitle.trim()) return;
    saveConfessionSession({
      id: editingNoteId || undefined,
      title: noteTitle.trim() || (language === "am" ? "የንስሐ ማስታወሻ" : "Confession Note"),
      preparationDate: todayKey,
      selectedPromptIds: [],
      notes: noteBody.trim(),
      questionsForPriest: notePriestQuestions.trim(),
      completed: false,
    });
    setNoteTitle("");
    setNoteBody("");
    setNotePriestQuestions("");
    setEditingNoteId(null);
    setShowAddNoteForm(false);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 3000);
  };

  const handleEditConfessionNote = (session: ConfessionSession) => {
    setEditingNoteId(session.id);
    setNoteTitle(session.title || "");
    setNoteBody(session.notes || "");
    setNotePriestQuestions(session.questionsForPriest || "");
    setShowAddNoteForm(true);
  };

  const handleToggleConfessionCompleted = (session: ConfessionSession) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    saveConfessionSession({
      id: session.id,
      title: session.title,
      preparationDate: session.preparationDate,
      selectedPromptIds: session.selectedPromptIds || [],
      notes: session.notes,
      questionsForPriest: session.questionsForPriest,
      completed: !session.completed,
    });
  };

  const handleAddCustomTick = () => {
    if (!newTickText.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    addConfessionTick(newTickText.trim());
    setNewTickText("");
    setShowAddTickForm(false);
  };

  const handleSaveTickEdit = (id: string) => {
    if (!editTickText.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updateConfessionTick(id, editTickText.trim());
    setEditingTickId(null);
    setEditTickText("");
  };

  const handleImportPrompt = (promptText: string) => {
    addConfessionTick(promptText);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const handleSavePenanceEdit = (id: string) => {
    if (!editPenanceTitle.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updatePenanceItem(id, { title: editPenanceTitle.trim() });
    setEditingPenanceId(null);
    setEditPenanceTitle("");
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
              initialMode={customPrayerAlarmMode}
              language={language}
              title={language === "am" ? "የጸሎት ሰዓት ማስተካከያ" : "Set Prayer Time"}
              onSave={(val) => {
                const hour12 = val.hour24 % 12 === 0 ? 12 : val.hour24 % 12;
                const period = val.hour24 >= 12 ? "PM" : "AM";
                const label = `${hour12}:${String(val.minute).padStart(2, "0")} ${period}`;
                setCustomPrayerHour(String(val.hour24));
                setCustomPrayerMinute(String(val.minute));
                if (val.repeatDays) setCustomPrayerRepeatDays(val.repeatDays);
                if (val.mode) setCustomPrayerAlarmMode(val.mode);
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
            <Pressable
              onPress={() => setShowScripturePicker(true)}
              style={[styles.timePickerButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            >
              <LucideIcon name="book-open" size={18} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text tone="label" style={{ fontSize: 11, color: colors.muted }}>
                  {language === "am" ? "የመጽሐፍ ቅዱስ ክፍል" : "Scripture Reference"}
                </Text>
                <Text tone="title" style={{ fontSize: 15, fontWeight: "700", color: readingRef ? colors.text : colors.muted }}>
                  {readingRef || (language === "am" ? "ምዕራፍ ይምረጡ..." : "Select chapter...")}
                </Text>
              </View>
              <LucideIcon name="chevron-right" size={18} color={colors.primary} />
            </Pressable>
            <ScriptureRefPicker
              visible={showScripturePicker}
              language={language}
              onSelect={(ref) => { setReadingRef(ref); setShowScripturePicker(false); }}
              onClose={() => setShowScripturePicker(false)}
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
              initialMode={readingAlarmMode}
              language={language}
              title={language === "am" ? "የንባብ ሰዓት ማስተካከያ" : "Set Reading Reminder Time"}
              onSave={(val) => {
                setReadingHour(String(val.hour24));
                setReadingMinute(String(val.minute));
                if (val.repeatDays) setReadingRepeatDays(val.repeatDays);
                if (val.mode) setReadingAlarmMode(val.mode);
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
          hasFastingTargetSet={fastingPreferences?.hasFastingTargetSet ?? false}
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
              initialMode={fastAlarmMode}
              language={language}
              title={language === "am" ? "የጾም መፍቻ ሰዓት ማስተካከያ" : "Set Fast Break Time"}
              onSave={(val) => {
                setFastHour(String(val.hour24));
                setFastMinute(String(val.minute));
                if (val.mode) setFastAlarmMode(val.mode);
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
        {!confessionLocked && (
          <IconButton
            icon="lock"
            accessibilityLabel="Lock Confession"
            onPress={() => setConfessionLocked(true)}
          />
        )}
      </View>

      {/* Confession Lock Card */}
      {confessionLocked ? (
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.gold, padding: 24, gap: 16, alignItems: "center", marginTop: 8 }}>
          <IconCircle icon="lock" color="gold" size={64} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text tone="title" style={{ fontSize: 18, fontWeight: "900", color: colors.text, textAlign: "center" }}>
              {language === "am" ? "የንስሐ ማስታወሻ ተቆልፏል" : "Confession Sanctuary Locked"}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 18 }}>
              {language === "am"
                ? "የግል የንስሐ ማስታወሻዎችዎና ነጥቦችዎ በምስጢር ተቆልፈዋል። ለመክፈት በጣት አሻራ ወይም በይለፍ ቃል ያረጋግጡ።"
                : "Your confession reflection notes, sins, and personal checklist are safely encrypted. Authenticate to view."}
            </Text>
          </View>
          <PrimaryButton
            label={language === "am" ? "በጣት አሻራ / በይለፍ ቃል ክፈት" : "Unlock with Biometrics"}
            icon="lock-open"
            onPress={handleUnlockConfession}
          />
        </Card>
      ) : (
        <>
          {/* Unlocked Confession Status Banner */}
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 12 }}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <IconCircle icon="shield-check" color="primary" size={38} />
                <View style={{ flex: 1 }}>
                  <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "የተከፈተ የንስሐ ዝግጅት" : "Confession Vault Active"}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>
                    {language === "am" ? "100% በመሣሪያዎ ብቻ ይቀመጣል" : "100% Local & Encrypted"}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setConfessionLocked(true)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.secondary }}
              >
                <LucideIcon name="lock" size={14} color={colors.primary} />
                <Text tone="label" style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
                  {language === "am" ? "አሁን ቆልፍ" : "Lock Now"}
                </Text>
              </Pressable>
            </View>
          </Card>

          {/* Section Navigation Tabs */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setConfessionTab("notes");
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: confessionTab === "notes" ? colors.primary : colors.secondary,
                borderWidth: 1,
                borderColor: confessionTab === "notes" ? colors.primary : colors.border,
              }}
            >
              <Text
                tone="label"
                style={{
                  fontSize: 12,
                  fontWeight: "800",
                  color: confessionTab === "notes" ? "#FFFFFF" : colors.text,
                }}
              >
                {language === "am" ? "ማስታወሻ" : "Notes"} ({confessionSessions.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setConfessionTab("ticks");
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: confessionTab === "ticks" ? colors.primary : colors.secondary,
                borderWidth: 1,
                borderColor: confessionTab === "ticks" ? colors.primary : colors.border,
              }}
            >
              <Text
                tone="label"
                style={{
                  fontSize: 12,
                  fontWeight: "800",
                  color: confessionTab === "ticks" ? "#FFFFFF" : colors.text,
                }}
              >
                {language === "am" ? "ነጥቦች" : "Ticks"} ({confessionTicks.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setConfessionTab("penance");
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 12,
                backgroundColor: confessionTab === "penance" ? colors.primary : colors.secondary,
                borderWidth: 1,
                borderColor: confessionTab === "penance" ? colors.primary : colors.border,
              }}
            >
              <Text
                tone="label"
                style={{
                  fontSize: 12,
                  fontWeight: "800",
                  color: confessionTab === "penance" ? "#FFFFFF" : colors.text,
                }}
              >
                {language === "am" ? "ቀኖና" : "Penance"} ({spiritualFather.penanceItems.length})
              </Text>
            </Pressable>
          </View>

          {/* TAB 1: CONFESSION NOTES (CRUD) */}
          {confessionTab === "notes" && (
            <View style={{ gap: 12 }}>
              <PrimaryButton
                label={
                  showAddNoteForm
                    ? (language === "am" ? "ዝጋ" : "Close")
                    : (language === "am" ? "+ አዲስ የንስሐ ማስታወሻ ጻፍ" : "+ Write Confession Note")
                }
                icon={showAddNoteForm ? "x" : "plus"}
                tone={showAddNoteForm ? "soft" : "primary"}
                onPress={() => {
                  if (showAddNoteForm) {
                    setShowAddNoteForm(false);
                    setEditingNoteId(null);
                    setNoteTitle("");
                    setNoteBody("");
                    setNotePriestQuestions("");
                  } else {
                    setShowAddNoteForm(true);
                  }
                }}
              />

              {showAddNoteForm && (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                    {editingNoteId
                      ? (language === "am" ? "የንስሐ ማስታወሻ ማስተካከያ" : "Edit Confession Note")
                      : (language === "am" ? "አዲስ የንስሐ ዝግጅት ማስታወሻ" : "New Confession Note")}
                  </Text>
                  <AppTextInput
                    value={noteTitle}
                    onChangeText={setNoteTitle}
                    placeholder={language === "am" ? "የርዕስ ስም (ለምሳሌ፡ የዐቢይ ጾም ንስሐ)..." : "Title (e.g. Lent Confession)..."}
                  />
                  <AppTextInput
                    value={noteBody}
                    onChangeText={setNoteBody}
                    placeholder={language === "am" ? "የሚናዘዙትን ኃጢአት፣ ድካምና የጸጸት ማስታወሻ እዚህ በነፃነት ይጻፉ..." : "Write your private sins, struggles, and repentance reflections here..."}
                    multiline
                    style={{ minHeight: 140 }}
                  />
                  <AppTextInput
                    value={notePriestQuestions}
                    onChangeText={setNotePriestQuestions}
                    placeholder={language === "am" ? "ለነፍስ አባት የሚጠየቁ ጥያቄዎች ወይም ምክር..." : "Questions or guidance to ask spiritual father..."}
                    multiline
                    style={{ minHeight: 70 }}
                  />
                  <PrimaryButton
                    label={
                      editingNoteId
                        ? (language === "am" ? "አስተካክል ✓" : "Update Note ✓")
                        : (language === "am" ? "ማስታወሻውን አስቀምጥ" : "Save Confession Note")
                    }
                    icon="check"
                    onPress={handleSaveConfessionNote}
                  />
                </Card>
              )}

              {noteSavedFeedback && (
                <View style={{ backgroundColor: colors.primaryContainer, padding: 10, borderRadius: 10, alignItems: "center" }}>
                  <Text tone="label" style={{ color: colors.primary, fontWeight: "800" }}>
                    {language === "am" ? "የንስሐ ማስታወሻው ተቀምጧል ✓" : "Confession Note Saved Successfully ✓"}
                  </Text>
                </View>
              )}

              <SectionHeader title={language === "am" ? "የተቀመጡ የንስሐ ማስታወሻዎች" : "My Confession Notes"} />

              {confessionSessions.length === 0 ? (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 24, alignItems: "center", gap: 8 }}>
                  <IconCircle icon="file-text" color="muted" size={48} />
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text, textAlign: "center" }}>
                    {language === "am" ? "ምንም የንስሐ ማስታወሻ አልተጻፈም" : "No Confession Notes Yet"}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18 }}>
                    {language === "am"
                      ? "የንስሐ ማስታወሻዎችዎ እዚህ በመሣሪያዎ ብቻ በምስጢር ይቀመጣሉ። አዲስ ማስታወሻ ለመጻፍ ከላይ ያለውን ይጫኑ።"
                      : "Your private journal entries stay encrypted on your phone. Tap above to write."}
                  </Text>
                </Card>
              ) : (
                confessionSessions.map((session) => (
                  <Card key={session.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 10 }}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                        <Text tone="title" style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>
                          {session.title || (language === "am" ? "የንስሐ ማስታወሻ" : "Confession Note")}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {session.preparationDate}
                        </Text>
                      </View>
                      <Pill
                        label={session.completed ? (language === "am" ? "ተናዝዣለሁ ✓" : "Confessed ✓") : (language === "am" ? "በዝግጅት ላይ" : "Preparing")}
                        tone={session.completed ? "primary" : "gold"}
                      />
                    </View>

                    {session.notes ? (
                      <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>
                        {session.notes}
                      </Text>
                    ) : null}

                    {session.questionsForPriest ? (
                      <View style={{ backgroundColor: colors.secondary, padding: 10, borderRadius: 10, gap: 4 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <LucideIcon name="church" size={14} color={colors.primary} />
                          <Text tone="label" style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
                            {language === "am" ? "ለነፍስ አባት የሚቀርብ ጥያቄ" : "Question for Priest"}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 17 }}>
                          {session.questionsForPriest}
                        </Text>
                      </View>
                    ) : null}

                    <View style={[styles.rowBetween, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 }]}>
                      <Pressable
                        onPress={() => handleToggleConfessionCompleted(session)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: session.completed ? colors.primary : colors.secondary,
                          borderWidth: 1,
                          borderColor: session.completed ? colors.primary : colors.border,
                        }}
                      >
                        <LucideIcon name="check" size={14} color={session.completed ? "#FFFFFF" : colors.muted} strokeWidth={2.6} />
                        <Text
                          tone="label"
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: session.completed ? "#FFFFFF" : colors.text,
                          }}
                        >
                          {session.completed ? (language === "am" ? "ተናዝዣለሁ ✓" : "Confessed ✓") : (language === "am" ? "ተናዝዣለሁ በል" : "Mark Confessed")}
                        </Text>
                      </Pressable>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <IconButton
                          icon="edit"
                          size={34}
                          color={colors.primary}
                          backgroundColor={colors.primaryContainer}
                          accessibilityLabel="Edit note"
                          onPress={() => handleEditConfessionNote(session)}
                        />
                        <IconButton
                          icon="trash"
                          size={34}
                          color={colors.danger}
                          backgroundColor={colors.dangerContainer}
                          accessibilityLabel="Delete note"
                          onPress={() => deleteConfessionSession(session.id)}
                        />
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </View>
          )}

          {/* TAB 2: CUSTOM TICKS (CRUD) */}
          {confessionTab === "ticks" && (
            <View style={{ gap: 12 }}>
              <PrimaryButton
                label={
                  showAddTickForm
                    ? (language === "am" ? "ዝጋ" : "Close")
                    : (language === "am" ? "+ አዲስ የንስሐ ነጥብ ጨምር" : "+ Add Custom Examination Point")
                }
                icon={showAddTickForm ? "x" : "plus"}
                tone={showAddTickForm ? "soft" : "primary"}
                onPress={() => setShowAddTickForm((prev) => !prev)}
              />

              {showAddTickForm && (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "አዲስ የሕሊና ምርመራ / የንስሐ ነጥብ" : "New Custom Examination Point"}
                  </Text>
                  <AppTextInput
                    value={newTickText}
                    onChangeText={setNewTickText}
                    placeholder={language === "am" ? "የሚናዘዙት ኃጢአት ወይም የሕሊና ነጥብ (ለምሳሌ፡ ቁጣ፣ ስንፍና)..." : "Point to confess or examine (e.g. anger, sloth)..."}
                  />
                  <PrimaryButton
                    label={language === "am" ? "ነጥቡን ጨምር" : "Add Point"}
                    icon="check"
                    onPress={handleAddCustomTick}
                  />
                </Card>
              )}

              {/* Suggested Church Examination Prompts Library */}
              <Pressable
                onPress={() => setShowChurchPrompts((prev) => !prev)}
                style={{
                  backgroundColor: colors.secondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 12,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <LucideIcon name="sparkles" size={16} color={colors.gold} />
                  <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "የቤተክርስቲያን መመርመሪያ ነጥቦች (Suggested)" : "Orthodox Examination Prompts"}
                  </Text>
                </View>
                <LucideIcon name={showChurchPrompts ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
              </Pressable>

              {showChurchPrompts && (
                <View style={{ gap: 8 }}>
                  {confessionPrompts.map((prompt) => (
                    <Card key={prompt.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 12 }}>
                      <View style={styles.rowBetween}>
                        <Text style={{ flex: 1, fontSize: 13, lineHeight: 18, color: colors.text }}>
                          {prompt.text[language] || prompt.text.en}
                        </Text>
                        <Pressable
                          onPress={() => handleImportPrompt(prompt.text[language] || prompt.text.en)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: colors.primaryContainer,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                            flexShrink: 0,
                          }}
                        >
                          <LucideIcon name="plus" size={12} color={colors.primary} strokeWidth={3} />
                          <Text tone="label" style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
                            {language === "am" ? "ጨምር" : "Add"}
                          </Text>
                        </Pressable>
                      </View>
                    </Card>
                  ))}
                </View>
              )}

              <SectionHeader title={language === "am" ? "የግል የንስሐ ነጥቦች ዝርዝር" : "My Custom Checklist"} />

              {confessionTicks.length === 0 ? (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 24, alignItems: "center", gap: 8 }}>
                  <IconCircle icon="check-circle" color="muted" size={48} />
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text, textAlign: "center" }}>
                    {language === "am" ? "ምንም የግል የንስሐ ነጥብ የለም" : "No Custom Ticks Yet"}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18 }}>
                    {language === "am"
                      ? "የሚናዘዟቸውን ኃጢአቶች በነጥብ ለመያዝ ከላይ አዲስ ነጥብ ይጨምሩ ወይም ከመመርመሪያዎች ይምረጡ።"
                      : "Add your personal examination check-items above or select from Orthodox prompts."}
                  </Text>
                </Card>
              ) : (
                confessionTicks.map((tick) => (
                  <Card key={tick.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 12 }}>
                    {editingTickId === tick.id ? (
                      <View style={styles.rowBetween}>
                        <AppTextInput
                          value={editTickText}
                          onChangeText={setEditTickText}
                          placeholder={language === "am" ? "ነጥቡን ያስተካክሉ..." : "Edit item..."}
                          style={{ flex: 1 }}
                        />
                        <IconButton
                          icon="check"
                          size={34}
                          color={colors.primary}
                          backgroundColor={colors.primaryContainer}
                          accessibilityLabel="Save Edit"
                          onPress={() => handleSaveTickEdit(tick.id)}
                        />
                        <IconButton
                          icon="x"
                          size={34}
                          color={colors.muted}
                          backgroundColor={colors.surface}
                          accessibilityLabel="Cancel Edit"
                          onPress={() => setEditingTickId(null)}
                        />
                      </View>
                    ) : (
                      <View style={styles.rowBetween}>
                        <Pressable
                          onPress={() => {
                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                            toggleConfessionTick(tick.id);
                          }}
                          style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
                        >
                          <View
                            style={[
                              styles.promptCheck,
                              {
                                borderColor: tick.completed ? colors.primary : colors.muted,
                                backgroundColor: tick.completed ? colors.primary : "transparent",
                              },
                            ]}
                          >
                            {tick.completed && <LucideIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} />}
                          </View>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              fontWeight: "600",
                              color: tick.completed ? colors.muted : colors.text,
                              textDecorationLine: tick.completed ? "line-through" : "none",
                              lineHeight: 19,
                            }}
                          >
                            {tick.text}
                          </Text>
                        </Pressable>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <IconButton
                            icon="edit"
                            size={32}
                            color={colors.primary}
                            backgroundColor={colors.primaryContainer}
                            accessibilityLabel="Edit item"
                            onPress={() => {
                              setEditingTickId(tick.id);
                              setEditTickText(tick.text);
                            }}
                          />
                          <IconButton
                            icon="trash"
                            size={32}
                            color={colors.danger}
                            backgroundColor={colors.dangerContainer}
                            accessibilityLabel="Delete item"
                            onPress={() => deleteConfessionTick(tick.id)}
                          />
                        </View>
                      </View>
                    )}
                  </Card>
                ))
              )}
            </View>
          )}

          {/* TAB 3: PENANCE & PROSTRATIONS (CRUD) */}
          {confessionTab === "penance" && (
            <View style={{ gap: 12 }}>
              <PrimaryButton
                label={
                  showAddPenance
                    ? (language === "am" ? "ዝጋ" : "Close")
                    : (language === "am" ? "+ አዲስ ቀኖና / ስግደት ጨምር" : "+ Add Penance Item")
                }
                icon={showAddPenance ? "x" : "plus"}
                tone={showAddPenance ? "soft" : "primary"}
                onPress={() => setShowAddPenance((prev) => !prev)}
              />

              {showAddPenance && (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "አዲስ የቀኖና ትእዛዝ" : "New Penance Item"}
                  </Text>
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

              <SectionHeader title={language === "am" ? "የቀኖናና የስግደት ዝርዝር" : "Penance & Prostrations List"} />

              {spiritualFather.penanceItems.length === 0 ? (
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 24, alignItems: "center", gap: 8 }}>
                  <IconCircle icon="church" color="muted" size={48} />
                  <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text, textAlign: "center" }}>
                    {language === "am" ? "ምንም የተመዘገበ ቀኖና የለም" : "No Penance Items Yet"}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18 }}>
                    {language === "am"
                      ? "የነፍስ አባትዎ ያዘዙዎትን ቀኖናና ስግደት እዚህ መዝግበው ይፈጽሙ።"
                      : "Record and track prostrations or prayers given by your confessor."}
                  </Text>
                </Card>
              ) : (
                spiritualFather.penanceItems.map((item) => (
                  <Card key={item.id} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    {editingPenanceId === item.id ? (
                      <View style={styles.rowBetween}>
                        <AppTextInput
                          value={editPenanceTitle}
                          onChangeText={setEditPenanceTitle}
                          placeholder={language === "am" ? "ቀኖናውን ያስተካክሉ..." : "Edit penance..."}
                          style={{ flex: 1 }}
                        />
                        <IconButton
                          icon="check"
                          size={34}
                          color={colors.primary}
                          backgroundColor={colors.primaryContainer}
                          accessibilityLabel="Save Edit"
                          onPress={() => handleSavePenanceEdit(item.id)}
                        />
                        <IconButton
                          icon="x"
                          size={34}
                          color={colors.muted}
                          backgroundColor={colors.surface}
                          accessibilityLabel="Cancel Edit"
                          onPress={() => setEditingPenanceId(null)}
                        />
                      </View>
                    ) : (
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
                          icon="edit"
                          size={34}
                          color={colors.primary}
                          backgroundColor={colors.primaryContainer}
                          accessibilityLabel="Edit"
                          onPress={() => {
                            setEditingPenanceId(item.id);
                            setEditPenanceTitle(item.title);
                          }}
                        />
                        <IconButton
                          icon="trash"
                          size={34}
                          color={colors.danger}
                          backgroundColor={colors.dangerContainer}
                          accessibilityLabel="Delete"
                          onPress={() => deletePenanceItem(item.id)}
                        />
                      </View>
                    )}
                  </Card>
                ))
              )}
            </View>
          )}
        </>
      )}
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
