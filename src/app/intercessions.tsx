import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

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
import { translate } from "@/src/shared/utils/i18n";

export default function IntercessionsScreen() {
  const { preferences, intercessions, addIntercession, togglePrayForIntercession } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const todayKey = useTodayKey();

  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    addIntercession(name.trim(), intention.trim());
    setName("");
    setIntention("");
    setShowAddForm(false);
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {language === "am" ? "የምልጃ ጸሎት" : "INTERCESSORY PRAYER"}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {t("intercessions")}
          </Text>
        </View>
      </View>

      <PrimaryButton
        label={showAddForm ? (language === "am" ? "ዝጋ" : "Close") : (language === "am" ? "አዲስ የምልጃ ስም ጨምር" : "Add Prayer Request")}
        icon={showAddForm ? "x" : "plus"}
        tone={showAddForm ? "soft" : "primary"}
        onPress={() => setShowAddForm((prev) => !prev)}
      />

      {showAddForm && (
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, gap: 10, borderWidth: 1.5 }}>
          <Text tone="title" style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
            {language === "am" ? "የምልጃ ጸሎት መዝግብ" : "New Intercession"}
          </Text>
          <AppTextInput
            value={name}
            onChangeText={setName}
            placeholder={language === "am" ? "የግለሰቡ ስም..." : "Name of person or group..."}
          />
          <AppTextInput
            value={intention}
            onChangeText={setIntention}
            placeholder={language === "am" ? "የጸሎት ሐሳብ (ፈውስ፣ በረከት...)" : "Intention (healing, peace, strength)..."}
          />
          <PrimaryButton
            label={language === "am" ? "አስቀምጥ" : "Save Request"}
            icon="check"
            onPress={handleAdd}
          />
        </Card>
      )}

      <SectionHeader title={language === "am" ? "የምልጃ ስሞች" : "Intercession List"} />

      <View style={styles.list}>
        {intercessions.map((item) => {
          const prayedToday = item.prayedDates.includes(todayKey);
          return (
            <Card key={item.id} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text tone="title" style={[styles.nameText, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  {item.intention ? (
                    <Text style={[styles.intentionText, { color: colors.muted }]}>{item.intention}</Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => togglePrayForIntercession(item.id)}
                  style={[
                    styles.prayButton,
                    {
                      backgroundColor: prayedToday ? colors.primary : colors.secondary,
                      borderColor: prayedToday ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <LucideIcon name="heart" size={16} color={prayedToday ? "#FFFFFF" : colors.primary} strokeWidth={2.2} />
                  <Text
                    tone="label"
                    style={{
                      color: prayedToday ? "#FFFFFF" : colors.primary,
                      fontSize: 11,
                      fontWeight: "800",
                    }}
                  >
                    {prayedToday ? (language === "am" ? "ተጸልዮአል" : "Prayed ✓") : (language === "am" ? "ጸልይ" : "Pray")}
                  </Text>
                </Pressable>
              </View>
            </Card>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 1 },
  list: { gap: 10, marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  nameText: { fontSize: 16, fontWeight: "800" },
  intentionText: { fontSize: 13, lineHeight: 18 },
  prayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
});
