import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import {
  AppLogo,
  AppScreen,
  AppText as Text,
  Card,
  IconCircle,
  LucideIcon,
  Pill,
  PrimaryButton,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore } from "@/src/features/settings/store/app-store";
import { syncAllAppReminders } from "@/src/features/settings/utils/reminders";

export default function OnboardingScreen() {
  const store = useAppStore();
  const { preferences, setLanguage, updatePreferences } = store;
  const colors = useAppColors();
  const language = preferences.language;

  const handleEnterApp = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    updatePreferences({ onboardingComplete: true });
    void syncAllAppReminders(store);
    router.replace("/(tabs)");
  };

  const toggleLang = (lang: "am" | "en") => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setLanguage(lang);
  };

  return (
    <AppScreen bottomSafeArea>
      <View style={styles.container}>
        {/* Top Minimal Language Pill Switcher */}
        <View style={styles.topBar}>
          <View style={[styles.langSegment, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              onPress={() => toggleLang("am")}
              style={[
                styles.langOption,
                language === "am" && [
                  styles.langActive,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                ],
              ]}
            >
              <Text
                tone="title"
                style={[
                  styles.langText,
                  { color: language === "am" ? "#FFFFFF" : colors.muted, fontWeight: "800" },
                ]}
              >
                አማርኛ
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleLang("en")}
              style={[
                styles.langOption,
                language === "en" && [
                  styles.langActive,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                ],
              ]}
            >
              <Text
                tone="title"
                style={[
                  styles.langText,
                  { color: language === "en" ? "#FFFFFF" : colors.muted, fontWeight: "800" },
                ]}
              >
                English
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Atmosphere & Radiant Cross Emblem */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.emblemAura,
              {
                backgroundColor: colors.goldContainer,
                borderColor: colors.gold,
              },
            ]}
          >
            <AppLogo size={74} />
          </View>

          <View style={styles.titleWrap}>
            <Text tone="display" style={[styles.brandTitle, { color: colors.text }]}>
              {language === "am" ? "ዕለት" : "Elet"}
            </Text>
            <Text tone="title" style={[styles.tagline, { color: colors.primary }]}>
              {language === "am"
                ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መንፈሳዊ ረዳት"
                : "Ethiopian Orthodox Spiritual Companion"}
            </Text>
            <Text style={[styles.quoteText, { color: colors.muted }]}>
              {language === "am"
                ? "«ሕግህ ለእግሬ መብራት፥ ለመንገዴም ብርሃን ነው።» (መዝ 119፥105)"
                : "“Thy word is a lamp unto my feet, and a light unto my path.” (Psalm 119:105)"}
            </Text>
          </View>
        </View>

        {/* 3 Delightful Bento Pillars (Visual 0-to-Hero) */}
        <View style={styles.bentoGrid}>
          {/* Pillar 1: Se'atat */}
          <Card
            style={[
              styles.bentoCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <IconCircle icon="church" color="primary" size={44} />
            <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
              <Text tone="title" style={[styles.bentoTitle, { color: colors.text }]}>
                {language === "am" ? "ሰባቱ ሰዓታትና ጾም" : "7 Prayer Hours & Fasting"}
              </Text>
              <Text style={[styles.bentoDesc, { color: colors.muted }]} numberOfLines={1}>
                {language === "am"
                  ? "የጸሎት ሰዓታት ጥሪና የጾም መፍቻ ቆጣሪ"
                  : "Canonical bells & fasting countdown"}
              </Text>
            </View>
          </Card>

          {/* Pillar 2: 24-Year Bahire Hasab */}
          <Card
            style={[
              styles.bentoCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.gold,
                borderWidth: 1.5,
              },
            ]}
          >
            <IconCircle icon="calendar" color="gold" size={44} />
            <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
              <Text tone="title" style={[styles.bentoTitle, { color: colors.text }]}>
                {language === "am" ? "24 ዓመታት ባሕረ-ሐሳብ" : "24-Year Bahire Hasab"}
              </Text>
              <Text style={[styles.bentoDesc, { color: colors.muted }]} numberOfLines={1}>
                {language === "am"
                  ? "2018–2041 ተንቀሳቃሽ አጽዋማትና ወርሃዊ ታቦታት"
                  : "2018–2041 movable fasts & monthly tabot"}
              </Text>
            </View>
          </Card>

          {/* Pillar 3: 81-Canon Bible & Confession */}
          <Card
            style={[
              styles.bentoCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <IconCircle icon="book-open" color="primary" size={44} />
            <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
              <Text tone="title" style={[styles.bentoTitle, { color: colors.text }]}>
                {language === "am" ? "81ዱ መጻሕፍትና ንስሐ" : "81-Canon & Confession"}
              </Text>
              <Text style={[styles.bentoDesc, { color: colors.muted }]} numberOfLines={1}>
                {language === "am"
                  ? "ሙሉ መጽሐፍ ቅዱስ፣ ሄኖክ፣ ሲራክና ምስጢራዊ ማስታወሻ"
                  : "Full scripture reader & confidential journal"}
              </Text>
            </View>
          </Card>
        </View>

        {/* Magnetic Single Call to Action */}
        <View style={styles.actionSection}>
          <PrimaryButton
            label={language === "am" ? "ወደ ዕለት ግቡ" : "Enter Elet"}
            icon="arrow-right"
            iconPosition="right"
            onPress={handleEnterApp}
          />

          <View style={styles.trustBadge}>
            <LucideIcon name="shield-check" size={15} color={colors.gold} strokeWidth={2.4} />
            <Text tone="label" style={[styles.trustText, { color: colors.muted }]}>
              {language === "am"
                ? "100% ከመስመር ውጭ • የግል ምስጢር የተጠበቀ • መመዝገብ አያስፈልግም"
                : "100% Offline • Zero-Knowledge Storage • No Signup Needed"}
            </Text>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: "100%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 4,
  },
  langSegment: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 3,
    gap: 2,
    ...Platform.select({
      web: { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)" },
      default: { elevation: 1 },
    }),
  },
  langOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  langActive: {
    ...Platform.select({
      web: { boxShadow: "0px 2px 6px rgba(142, 68, 36, 0.25)" },
      default: { elevation: 2 },
    }),
  },
  langText: { fontSize: 13 },
  heroSection: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  emblemAura: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    ...Platform.select({
      web: { boxShadow: "0px 6px 24px rgba(200, 157, 66, 0.28)" },
      default: {
        elevation: 6,
        shadowColor: "#C89D42",
        shadowOpacity: 0.28,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  titleWrap: {
    alignItems: "center",
    gap: 4,
    maxWidth: 340,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  quoteText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    fontStyle: "italic",
    marginTop: 2,
    maxWidth: 300,
  },
  bentoGrid: {
    gap: 9,
    marginVertical: 6,
  },
  bentoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  bentoTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  bentoDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionSection: {
    gap: 10,
    paddingBottom: 6,
    width: "100%",
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
