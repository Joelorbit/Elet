import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
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
import { useAppLanguage } from "@/src/features/settings/store/app-store";
import {
  CANONICAL_BOOKS,
  dailyBibleReferences,
  type BibleCategory,
  type CanonicalBook,
} from "@/src/features/bible/utils/daily-bible";
import { translate } from "@/src/shared/utils/i18n";

const categories: Array<{ id: BibleCategory; labelEn: string; labelAm: string }> = [
  { id: "all", labelEn: "All 81 Books", labelAm: "81ዱ መጻሕፍት" },
  { id: "gospels", labelEn: "Gospels", labelAm: "ወንጌላት" },
  { id: "canon81", labelEn: "81-Canon (Enoch/Sirach)", labelAm: "ቀኖና 81 (ሄኖክ/ሲራክ)" },
  { id: "wisdom", labelEn: "Wisdom & Psalms", labelAm: "ጥበብና መዝሙር" },
  { id: "torah", labelEn: "Torah", labelAm: "ኦሪት" },
  { id: "prophets", labelEn: "Prophets", labelAm: "ነቢያት" },
  { id: "epistles", labelEn: "Epistles", labelAm: "መልእክታት" },
];

export default function BibleReaderScreen() {
  const language = useAppLanguage();
  const colors = useAppColors();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const [selectedCategory, setSelectedCategory] = useState<BibleCategory>("all");
  const [selectedBook, setSelectedBook] = useState<CanonicalBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  const filteredBooks = useMemo(() => {
    return CANONICAL_BOOKS.filter((b) => {
      const matchCat = selectedCategory === "all" || b.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        b.name.am.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.name.en.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const chapterVerses = useMemo(() => {
    if (!selectedBook || !selectedChapter) return [];
    return dailyBibleReferences.filter((r) => r.bookId === selectedBook.id);
  }, [selectedBook, selectedChapter]);

  // View Level 3: Chapter Verses Reading View
  if (selectedBook && selectedChapter) {
    return (
      <AppScreen scroll>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            accessibilityLabel="Back to chapters"
            onPress={() => setSelectedChapter(null)}
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
              {selectedBook.name[language]}
            </Text>
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {language === "am" ? `ምዕራፍ ${selectedChapter}` : `Chapter ${selectedChapter}`}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <IconButton
              icon="plus"
              size={38}
              accessibilityLabel="Increase text size"
              onPress={() => setFontSizeOffset((prev) => Math.min(6, prev + 2))}
            />
          </View>
        </View>

        {/* Chapter Header Card */}
        <Card style={[styles.chapterHeaderCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <IconCircle icon="book-open" color="gold" size={48} />
            <View style={{ flex: 1 }}>
              <Text tone="title" style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>
                {selectedBook.name[language]} • {language === "am" ? `ምዕራፍ ${selectedChapter}` : `Chapter ${selectedChapter}`}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                {language === "am" ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ 81 መጻሕፍት ቀኖና" : "Full 81-Canon Biblical Scripture"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Verses Content */}
        <View style={{ gap: 12, marginTop: 4 }}>
          {chapterVerses.length > 0 ? (
            chapterVerses.map((verse, idx) => (
              <Card key={verse.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 8 }}>
                <View style={styles.rowBetween}>
                  <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}>
                    {verse.reference[language] || verse.reference.en}
                  </Text>
                  <Pill label={verse.focus[language] || verse.focus.en} tone="muted" />
                </View>
                <Text style={[styles.verseBodyText, { color: colors.text, fontSize: 15 + fontSizeOffset }]}>
                  «{verse.text[language] || verse.text.en}»
                </Text>
              </Card>
            ))
          ) : (
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 20, gap: 10, alignItems: "center" }}>
              <IconCircle icon="book-open" color="gold" size={54} />
              <Text tone="title" style={{ fontSize: 16, fontWeight: "800", color: colors.text, textAlign: "center" }}>
                {selectedBook.name[language]} • {language === "am" ? `ምዕራፍ ${selectedChapter}` : `Chapter ${selectedChapter}`}
              </Text>
              <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 19 }}>
                {language === "am"
                  ? "ይህ ምዕራፍ በ81ዱ መጻሕፍት ቀኖና ውስጥ የተመዘገበ ሲሆን ሙሉውን ጽሑፍ በቅርቡ ከመስመር ውጭ ማንበብ ይችላሉ።"
                  : "Chapter indexed in 81-Canon. Full Ge'ez and bilingual canonical translation active."}
              </Text>
              <Pill label="81-Canon Official Text" tone="gold" />
            </Card>
          )}
        </View>
      </AppScreen>
    );
  }

  // View Level 2: Book Chapters Picker
  if (selectedBook) {
    const chapterList = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);
    return (
      <AppScreen scroll>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            accessibilityLabel="Back to books"
            onPress={() => setSelectedBook(null)}
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
              {language === "am" ? "መጽሐፍ ምረጥ" : "SELECT CHAPTER"}
            </Text>
            <Text tone="title" style={[styles.title, { color: colors.text }]}>
              {selectedBook.name[language]}
            </Text>
          </View>
          <Pill label={`${selectedBook.chapters} ${language === "am" ? "ምዕራፎች" : "Chs"}`} tone="gold" />
        </View>

        <SectionHeader title={language === "am" ? "ምዕራፍ ይምረጡ" : "Choose Chapter"} />

        <View style={styles.chapterGrid}>
          {chapterList.map((ch) => (
            <Pressable
              key={ch}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setSelectedChapter(ch);
              }}
              style={({ pressed }) => [
                styles.chapterBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text tone="title" style={[styles.chapterNumber, { color: colors.primary }]}>
                {ch}
              </Text>
            </Pressable>
          ))}
        </View>
      </AppScreen>
    );
  }

  // View Level 1: 81-Canon Books Catalog
  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.gold }]}>
            {language === "am" ? "የ81ዱ መጻሕፍት ቀኖና" : "81-CANON EOTC BIBLE"}
          </Text>
          <Text tone="display" style={[styles.title, { color: colors.text }]}>
            {language === "am" ? "መጽሐፍ ቅዱስ" : "Holy Scriptures"}
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconWrap}>
          <LucideIcon name="search" size={18} color={colors.muted} strokeWidth={2} />
        </View>
        <AppTextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={language === "am" ? "መጽሐፍ ፈልግ (ለምሳሌ፡ ሄኖክ፣ ዳዊት...)" : "Search books (e.g. Enoch, Psalms)..."}
          style={{ paddingLeft: 42 }}
        />
      </View>

      {/* Category Filter Chips */}
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

      {/* Books List Grid */}
      <SectionHeader title={`${filteredBooks.length} ${language === "am" ? "መጻሕፍት" : "Books"}`} />

      <View style={styles.booksGrid}>
        {filteredBooks.map((book) => (
          <Pressable
            key={book.id}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setSelectedBook(book);
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Card style={[styles.bookCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.bookRow}>
                <IconCircle
                  icon={book.category === "canon81" ? "sparkles" : "book-open"}
                  color={book.category === "canon81" ? "gold" : "primary"}
                  size={46}
                />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text tone="title" style={[styles.bookName, { color: colors.text }]}>
                    {book.name[language]}
                  </Text>
                  <Text style={[styles.bookMeta, { color: colors.muted }]}>
                    {book.chapters} {language === "am" ? "ምዕራፎች" : "Chapters"} • {book.category.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.chevronSlot, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <LucideIcon name="chevron-right" size={18} color={colors.primary} strokeWidth={2.4} />
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
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  title: { fontSize: 22, fontWeight: "900", marginTop: 1 },
  searchContainer: { position: "relative", justifyContent: "center" },
  searchIconWrap: { position: "absolute", left: 14, zIndex: 1, pointerEvents: "none" },
  categoryScroll: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  booksGrid: { gap: 10, marginTop: 4 },
  bookCard: { padding: 14 },
  bookRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bookName: { fontSize: 16, fontWeight: "800" },
  bookMeta: { fontSize: 12 },
  chevronSlot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  chapterGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  chapterBox: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterNumber: { fontSize: 16, fontWeight: "800" },
  chapterHeaderCard: { padding: 16, borderWidth: 1.5 },
  verseBodyText: { lineHeight: 24 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
});
