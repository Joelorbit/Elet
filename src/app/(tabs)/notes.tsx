import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import {
  AppScreen,
  AppText as Text,
  AppTextInput,
  Card,
  EmptyState,
  IconCircle,
  LucideIcon,
  Pill,
  PrimaryButton,
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore } from "@/src/features/settings/store/app-store";
import { noteCategoryLabels } from "@/src/features/bible/utils/content";
import { translate } from "@/src/shared/utils/i18n";

export default function NotesScreen() {
  const { notes, preferences } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      notes
        .filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt)),
    [notes, query]
  );

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <View>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {t("notes")}
          </Text>
          <Text tone="display" style={[styles.title, { color: colors.text }]}>
            {t("privateNotes")}
          </Text>
        </View>
        <IconCircle icon="file-text" color="gold" size={46} />
      </View>

      {/* Action Button */}
      <PrimaryButton
        label={t("newNote")}
        icon="plus"
        onPress={() => router.push("/note-editor" as never)}
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconWrap}>
          <LucideIcon name="search" size={18} color={colors.muted} strokeWidth={2} />
        </View>
        <AppTextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("searchNotes")}
          style={{ paddingLeft: 42 }}
        />
      </View>

      <SectionHeader title={query ? t("searchNotes") : t("notes")} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="book-open"
          title={query ? t("emptySearch") : t("noNotes")}
          detail={
            query
              ? t("searchNotes")
              : language === "am"
              ? "ማስታወሻዎችዎ በመሣሪያዎ ላይ ብቻ በምስጢር ይቀመጣሉ።"
              : "Your private journal entries stay local-only on your device."
          }
        />
      ) : (
        <View style={styles.list}>
          {filtered.map((note) => (
            <Pressable
              key={note.id}
              onPress={() =>
                router.push({ pathname: "/note-editor", params: { id: note.id } } as never)
              }
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 8, padding: 14 }}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteTitleWrap}>
                    {note.pinned ? (
                      <LucideIcon name="pin" size={14} color={colors.gold} strokeWidth={2.4} />
                    ) : null}
                    <Text tone="title" numberOfLines={1} style={[styles.noteTitle, { color: colors.text }]}>
                      {note.title || t("newNote")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Pill
                      label={noteCategoryLabels[note.category][language]}
                      tone={note.category === "confession" ? "gold" : "muted"}
                    />
                    {note.sensitive ? <Pill label={t("sensitive")} tone="danger" /> : null}
                  </View>
                </View>

                {note.body ? (
                  <Text numberOfLines={2} style={[styles.noteBody, { color: colors.muted }]}>
                    {note.body}
                  </Text>
                ) : null}

                <Text tone="label" style={[styles.noteMeta, { color: colors.muted }]}>
                  {new Intl.DateTimeFormat(language === "am" ? "am-ET" : "en-GB", {
                    day: "numeric",
                    month: "short",
                  }).format(new Date(note.updatedAt))}
                </Text>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "900", marginTop: 2 },
  searchContainer: { position: "relative", justifyContent: "center" },
  searchIconWrap: { position: "absolute", left: 14, zIndex: 1, pointerEvents: "none" },
  list: { gap: 10 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  noteTitleWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, minWidth: 0 },
  noteTitle: { flex: 1, fontSize: 16, fontWeight: "800" },
  noteBody: { fontSize: 13, lineHeight: 19 },
  noteMeta: { fontSize: 11, fontWeight: "600", marginTop: 2 },
});
