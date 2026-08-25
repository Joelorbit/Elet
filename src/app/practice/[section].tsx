import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
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
import { dailyReadings, confessionPrompts } from "@/src/features/bible/utils/content";
import { translate } from "@/src/shared/utils/i18n";
import { FastingTimerWidget } from "@/src/features/liturgy/components/orthodox-widgets";
import { useAppLock } from "@/src/features/auth/hooks/use-app-lock";

export default function PracticeSectionScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const {
    preferences,
    prayers,
    readingProgress,
    spiritualFather,
    confessionSessions,
    togglePrayerCompletion,
    addCustomPrayer,
    deletePrayer,
    togglePenanceItem,
    addPenanceItem,
    deletePenanceItem,
    saveConfessionSession,
  } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const todayKey = useTodayKey();
  const { authenticate } = useAppLock();

  // Custom Prayer Form State
  const [showAddPrayer, setShowAddPrayer] = useState(false);
  const [customPrayerTitleAm, setCustomPrayerTitleAm] = useState("");
  const [customPrayerTitleEn, setCustomPrayerTitleEn] = useState("");
  const [customPrayerTimeLabel, setCustomPrayerTimeLabel] = useState("6:00 AM");
  const [customPrayerHour, setCustomPrayerHour] = useState("6");

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

  const handleUnlockConfession = async () => {
    const success = await authenticate();
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

  // Section 1: Prayer Hours (ሰዓታት) with Full Custom Prayer CRUD
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
          label={showAddPrayer ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "አዲስ የጸሎት ሰዓት ጨምር" : "Add Custom Prayer Hour")}
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
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <AppTextInput
                  value={customPrayerTimeLabel}
                  onChangeText={setCustomPrayerTimeLabel}
                  placeholder={language === "am" ? "የሰዓት መግለጫ (6:00 AM)..." : "Time Label (e.g. 6:00 AM)..."}
                />
              </View>
              <View style={{ width: 90 }}>
                <AppTextInput
                  value={customPrayerHour}
                  onChangeText={setCustomPrayerHour}
                  placeholder="Hour (0-23)"
                />
              </View>
            </View>
            <PrimaryButton
              label={language === "am" ? "የጸሎት ሰዓቱን አስቀምጥ" : "Save Prayer Routine"}
              icon="check"
              onPress={handleAddCustomPrayer}
            />
          </Card>
        )}

        <SectionHeader title={language === "am" ? "ሰባቱ ቀኖናዊ ሰዓታት" : "Canonical Prayer Routines"} />

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
                    {prayer.custom && (
                      <IconButton
                        icon="trash"
                        size={36}
                        color={colors.danger}
                        backgroundColor={colors.dangerContainer}
                        accessibilityLabel="Delete prayer"
                        onPress={() => deletePrayer(prayer.id)}
                      />
                    )}
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

  // Section 2: Readings with Link to Full 81-Canon Bible Reader
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

        {/* Big Entry Card to Full 81-Canon Bible Reader */}
        <Pressable
          onPress={() => router.push("/bible-reader" as never)}
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <Card style={[styles.bibleReaderCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <IconCircle icon="book-open" color="gold" size={54} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 17, fontWeight: "900", color: colors.text }}>
                  {language === "am" ? "ሙሉውን 81 መጻሕፍት ክፈት" : "Open 81-Canon Bible Reader"}
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
                  {language === "am"
                    ? "ከዘፍጥረት እስከ ራእይ፣ መጽሐፈ ሄኖክ፣ ኩፋሌ፣ ሲራክና መዝሙረ ዳዊት።"
                    : "Genesis to Revelation, Enoch, Jubilees, Sirach, Wisdom & all 150 Psalms."}
                </Text>
              </View>
              <View style={[styles.chevronSlot, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <LucideIcon name="chevron-right" size={20} color={colors.primary} strokeWidth={2.4} />
              </View>
            </View>
          </Card>
        </Pressable>

        <SectionHeader title={language === "am" ? "ዕለታዊ የተመረጡ ንባባት" : "Daily Liturgical Scripture Plan"} />

        <View style={styles.list}>
          {dailyReadings.map((reading) => (
            <Card key={reading.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 8 }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text tone="label" style={[styles.themeLabel, { color: colors.gold }]}>
                    {reading.theme[language] || reading.theme.en}
                  </Text>
                  <Text tone="title" style={[styles.cardTitle, { color: colors.text }]}>
                    {reading.title[language] || reading.title.en}
                  </Text>
                  <Text style={[styles.refText, { color: colors.primary }]}>{reading.reference}</Text>
                </View>
                <IconCircle icon="book-open" color="gold" size={46} />
              </View>
            </Card>
          ))}
        </View>
      </AppScreen>
    );
  }

  // Section 3: Fasting
  if (section === "fasting") {
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

        <FastingTimerWidget language={language} />

        <SectionHeader title={language === "am" ? "7ቱ ቀኖናዊ አጽዋማት" : "The 7 Canonical Fasts"} />
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 12 }}>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "1. ዐቢይ ጾም (ሁዳዴ)" : "1. Great Lent (55 Days)"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am"
                ? "ጌታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመው የ55 ቀናት ታላቅ ጾም።"
                : "Commemorating Christ's 40-day fast and Holy Passion Week."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "2. ጾመ ነቢያት (የገና ጾም)" : "2. Fast of Prophets (44 Days)"} tone="gold" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "ከኅዳር 15 እስከ ታኅሣሥ 28 የሚጾም የገና ጾም።" : "Advent fast observed from Hidar 15 to Tahsas 28."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "3. ጾመ ነነዌ" : "3. Fast of Nineveh (3 Days)"} tone="primary" />
            <Text style={[styles.fastingDesc, { color: colors.muted }]}>
              {language === "am" ? "የነነዌ ሰዎች በንስሐ የዳኑበት የ3 ቀናት ጾም።" : "3 days of repentance and mercy."}
            </Text>
          </View>
          <View style={styles.fastingItem}>
            <Pill label={language === "am" ? "4. ጾመ ፍልሰታ" : "4. Fast of Filseta (16 Days)"} tone="gold" />
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
  themeLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  refText: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  bibleReaderCard: { padding: 16, borderWidth: 1.5 },
  chevronSlot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  fastingItem: { gap: 4 },
  fastingDesc: { fontSize: 12, lineHeight: 17 },
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
