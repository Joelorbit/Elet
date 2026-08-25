import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";

import {
  AppLogo,
  AppScreen,
  AppText as Text,
  Card,
  IconButton,
  IconCircle,
  Pill,
  SectionHeader,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppLanguage } from "@/src/features/settings/store/app-store";
import { translate } from "@/src/shared/utils/i18n";

export default function AboutScreen() {
  const language = useAppLanguage();
  const colors = useAppColors();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const openCreatorWebsite = async () => {
    try {
      const url = "https://eyuel.me";
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => router.back()} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
            {language === "am" ? "ስለ መተግበሪያው" : "ABOUT ELET"}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.text }]}>
            {t("aboutSources")}
          </Text>
        </View>
      </View>

      {/* Emblem Hero Card */}
      <Card style={[styles.emblemCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
        <AppLogo size={56} />
        <Text tone="display" style={[styles.brandTitle, { color: colors.text }]}>
          Elet (ዕለት)
        </Text>
        <Text style={[styles.brandSubtitle, { color: colors.muted }]}>
          {language === "am"
            ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ቀኖናዊ መንፈሳዊ ረዳት"
            : "Ethiopian Orthodox Tewahedo Spiritual Companion"}
        </Text>
        <Pill label="100% Offline • Local-First" tone="gold" />
      </Card>

      {/* Mission & Canonical Scope */}
      <SectionHeader title={language === "am" ? "ዓላማና ቀኖናዊ ምንጮች" : "Canonical Sources & Purpose"} />
      <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, gap: 10 }}>
        <View style={styles.sourceItem}>
          <IconCircle icon="calendar" color="primary" size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "የ24 ዓመታት ባሕረ-ሐሳብ (2018–2041)" : "24-Year Bahire Hasab (2018–2041)"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 17 }}>
              {language === "am"
                ? "ተንቀሳቃሽ አጽዋማትና በዓላት (ነነዌ፣ ዐቢይ ጾም፣ ሆሣዕና፣ ስቅለት፣ ትንሣኤ፣ ጰራቅሊጦስ) በቀጥታ በቤተ ክርስቲያን ቀኖና መሠረት የተሰሉ ናቸው።"
                : "Movable fasts and feasts calculated accurately based on official church canons."}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.sourceItem}>
          <IconCircle icon="book-open" color="gold" size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "የ81ዱ መጻሕፍት ቀኖና" : "81-Canon Scriptures"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 17 }}>
              {language === "am"
                ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ 81 መጻሕፍት (መጽሐፈ ሄኖክ፣ መጽሐፈ ኩፋሌ፣ መጽሐፈ ጥበብ፣ ሲራክ፣ ወንጌላትና መልእክታት)።"
                : "Bilingual verses from the full 81-book canonical scriptures."}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.sourceItem}>
          <IconCircle icon="shield-check" color="primary" size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "የግል ምስጢርና ደህንነት" : "Privacy by Design"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 17 }}>
              {language === "am"
                ? "ምንም ዓይነት ማስታወቂያ ወይም የውጪ መከታተያ የለም። ሁሉም ማስታወሻዎችዎ በስልክዎ ብቻ ይቀመጣሉ።"
                : "Zero tracking, zero analytics. Your notes and spiritual records remain 100% on your device."}
            </Text>
          </View>
        </View>
      </Card>

      {/* Creator Credit matching Settings */}
      <View style={[styles.credit, { borderTopColor: colors.border }]}>
        <Text tone="label" style={[styles.creditLabel, { color: colors.muted }]}>
          {language === "am" ? "የተሠራው በ" : "Crafted by"}
        </Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="eyuel.me"
          onPress={() => {
            void openCreatorWebsite();
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.65 : 1,
            paddingHorizontal: 4,
            paddingVertical: 2,
          })}
        >
          <Text tone="title" style={[styles.creditName, { color: colors.primary }]}>
            eyuel.me
          </Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 1 },
  emblemCard: { alignItems: "center", padding: 24, gap: 8, borderWidth: 1.5 },
  brandTitle: { fontSize: 24, fontWeight: "900" },
  brandSubtitle: { fontSize: 13, textAlign: "center", maxWidth: 300, lineHeight: 18 },
  sourceItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  divider: { height: 1, width: "100%" },
  credit: {
    alignItems: "center",
    gap: 2,
    marginTop: 10,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  creditLabel: { fontSize: 12, fontWeight: "600" },
  creditName: { fontSize: 15, fontWeight: "900" },
});
