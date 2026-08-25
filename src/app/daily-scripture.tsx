import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import {
  AppScreen,
  AppText as Text,
  Card,
  IconButton,
  IconCircle,
  Pill,
  PrimaryButton,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppLanguage } from "@/src/features/settings/store/app-store";
import {
  CANONICAL_BOOKS,
  dailyBibleReferences,
  getRandomBibleVerse,
  type BibleCategory,
} from "@/src/features/bible/utils/daily-bible";
import { translate } from "@/src/shared/utils/i18n";

const categories: Array<{ id: BibleCategory; labelEn: string; labelAm: string }> = [
  { id: "all", labelEn: "All", labelAm: "ሁሉም" },
  { id: "gospels", labelEn: "Gospels", labelAm: "ወንጌላት" },
  { id: "wisdom", labelEn: "Wisdom & Psalms", labelAm: "ጥበብና መዝሙር" },
  { id: "canon81", labelEn: "81-Canon (Enoch/Sirach)", labelAm: "ቀኖና 81 (ሄኖክ/ሲራክ)" },
  { id: "prophets", labelEn: "Prophets", labelAm: "ነቢያት" },
  { id: "epistles", labelEn: "Epistles", labelAm: "መልእክታት" },
  { id: "torah", labelEn: "Torah", labelAm: "ኦሪት" },
];

export default function DailyScriptureScreen() {
  const language = useAppLanguage();
  const colors = useAppColors();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const [selectedCategory, setSelectedCategory] = useState<BibleCategory>("all");
  const [featuredVerse, setFeaturedVerse] = useState(() => getRandomBibleVerse(language));

  const filteredVerses =
    selectedCategory === "all"
      ? dailyBibleReferences
      : dailyBibleReferences.filter((v) => v.category === selectedCategory);

  const pickRandom = () => {
    setFeaturedVerse(getRandomBibleVerse(language, selectedCategory));
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
            {language === "am" ? "የ81ዱ መጻሕፍት ቀኖና" : "81-CANON SCRIPTURE"}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {t("dailyScriptureTitle")}
          </Text>
        </View>
      </View>

      {/* Featured Verse Inspiration Card */}
      <Card style={[styles.featuredCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
        <View style={styles.featuredHeader}>
          <IconCircle icon="book-open" color="gold" size={42} />
          <View style={{ flex: 1 }}>
            <Text tone="label" style={[styles.focusLabel, { color: colors.gold }]}>
              {featuredVerse.focusText}
            </Text>
            <Text tone="title" style={[styles.featuredRef, { color: colors.text }]}>
              {featuredVerse.referenceText}
            </Text>
          </View>
          <Pill label="81-Canon" tone="gold" />
        </View>
        <Text style={[styles.featuredText, { color: colors.text }]}>
          «{featuredVerse.verseText}»
        </Text>
        <PrimaryButton
          label={t("randomVerse")}
          icon="sparkles"
          tone="soft"
          onPress={pickRandom}
        />
      </Card>

      {/* Category Chips Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.secondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                tone="label"
                style={{
                  color: isSelected ? "#FFFFFF" : colors.text,
                  fontWeight: isSelected ? "800" : "600",
                }}
              >
                {language === "am" ? cat.labelAm : cat.labelEn}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Verses Catalog List */}
      <View style={styles.verseList}>
        {filteredVerses.map((verse) => (
          <Card key={verse.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 8 }}>
            <View style={styles.rowBetween}>
              <Text tone="title" style={[styles.verseRef, { color: colors.primary }]}>
                {verse.reference[language] || verse.reference.en}
              </Text>
              <Pill label={verse.focus[language] || verse.focus.en} tone="muted" />
            </View>
            <Text style={[styles.verseBody, { color: colors.text }]}>
              «{verse.text[language] || verse.text.en}»
            </Text>
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 1 },
  featuredCard: { padding: 16, gap: 12, borderWidth: 1.5 },
  featuredHeader: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%" },
  focusLabel: { fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  featuredRef: { fontSize: 16, fontWeight: "800" },
  featuredText: { fontSize: 15, lineHeight: 22, fontStyle: "italic" },
  categoryScroll: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  verseList: { gap: 10, marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  verseRef: { fontSize: 15, fontWeight: "800" },
  verseBody: { fontSize: 14, lineHeight: 21 },
});
