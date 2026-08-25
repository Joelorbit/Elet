import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  AppScreen,
  AppText as Text,
  AppTextInput,
  Card,
  IconButton,
  PrimaryButton,
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore } from "@/src/features/settings/store/app-store";
import { noteCategoryLabels } from "@/src/features/bible/utils/content";
import { translate } from "@/src/shared/utils/i18n";
import type { NoteCategory } from "@/src/types/app";

const categories: NoteCategory[] = [
  "sermon",
  "prayer",
  "verse",
  "priest",
  "gratitude",
  "reflection",
  "confession",
  "service",
];

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { notes, preferences, saveNote, deleteNote } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const existing = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(existing?.title || "");
  const [body, setBody] = useState(existing?.body || "");
  const [category, setCategory] = useState<NoteCategory>(existing?.category || "reflection");
  const [pinned, setPinned] = useState(existing?.pinned || false);
  const [sensitive, setSensitive] = useState(existing?.sensitive || false);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) return;
    saveNote({
      id,
      title: title.trim(),
      body: body.trim(),
      category,
      pinned,
      sensitive,
    });
    router.back();
  };

  const handleDelete = () => {
    if (id) {
      deleteNote(id);
      router.back();
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {id ? (language === "am" ? "ማስታወሻ አርትዕ" : "Edit Note") : t("newNote")}
          </Text>
        </View>
        {id ? (
          <IconButton
            icon="trash"
            accessibilityLabel="Delete"
            color={colors.danger}
            backgroundColor={colors.dangerContainer}
            onPress={handleDelete}
          />
        ) : null}
      </View>

      {/* Category Selector Chips */}
      <SectionHeader title={language === "am" ? "የማስታወሻ ዓይነት" : "Category"} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isSelected = category === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
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
                {noteCategoryLabels[cat][language]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Form Inputs */}
      <AppTextInput
        value={title}
        onChangeText={setTitle}
        placeholder={language === "am" ? "የርእስ ስም..." : "Note title..."}
      />

      <AppTextInput
        value={body}
        onChangeText={setBody}
        placeholder={language === "am" ? "ማስታወሻዎን እዚህ ይጻፉ..." : "Write your thoughts, sermon notes, prayer insights..."}
        multiline
        style={{ minHeight: 180 }}
      />

      {/* Options Card */}
      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 12 }}>
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>
              {language === "am" ? "ከላይ ሰካ (Pin Note)" : "Pin to Top"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {language === "am" ? "ማስታወሻው ከዝርዝሩ አናት ላይ እንዲታይ ያደርጋል" : "Keep this note at the top of your list"}
            </Text>
          </View>
          <Switch
            value={pinned}
            onValueChange={setPinned}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>
              {language === "am" ? "ምስጢራዊ ምልክት" : "Mark as Sensitive"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {language === "am" ? "ለንስሐ እና ለግል ምስጢሮች" : "Visually marks this note as confidential"}
            </Text>
          </View>
          <Switch
            value={sensitive}
            onValueChange={setSensitive}
            trackColor={{ false: colors.border, true: colors.danger }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <PrimaryButton
        label={t("save")}
        icon="check"
        onPress={handleSave}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: "900" },
  categoryScroll: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  optionInfo: { flex: 1, minWidth: 0, gap: 2 },
  divider: { height: 1, width: "100%" },
});
