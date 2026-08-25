import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import {
  AppLogo,
  AppText as Text,
  Card,
  IconCircle,
  PrimaryButton,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore } from "@/src/features/settings/store/app-store";

interface AppLockScreenProps {
  onUnlock: () => void;
  isAuthenticating: boolean;
}

export function AppLockScreen({ onUnlock, isAuthenticating }: AppLockScreenProps) {
  const colors = useAppColors();
  const { preferences } = useAppStore();
  const language = preferences.language;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.lockCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppLogo size={64} />
        <View style={styles.titleWrap}>
          <Text tone="display" style={[styles.title, { color: colors.text }]}>
            {language === "am" ? "ዕለት ተቆልፏል" : "Elet is Locked"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {language === "am"
              ? "የግል መንፈሳዊ ማስታወሻዎችዎና የንስሐ ዝግጅትዎ በምስጢር የተጠበቁ ናቸው።"
              : "Your spiritual journals, prayers, and confession preparation are safely encrypted."}
          </Text>
        </View>

        <IconCircle icon="fingerprint" color="primary" size={72} />

        <View style={{ width: "100%", marginTop: 8 }}>
          <PrimaryButton
            label={
              isAuthenticating
                ? language === "am"
                  ? "በማረጋገጥ ላይ..."
                  : "Authenticating..."
                : language === "am"
                ? "በጣት አሻራ / በይለፍ ቃል ክፈት"
                : "Unlock with Biometrics"
            }
            icon="lock-open"
            onPress={onUnlock}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lockCard: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    padding: 28,
    gap: 16,
    ...Platform.select({
      web: {
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
      },
      default: {
        elevation: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  titleWrap: { alignItems: "center", gap: 4 },
  title: { fontSize: 24, fontWeight: "900", textAlign: "center" },
  subtitle: { fontSize: 13, lineHeight: 18, textAlign: "center" },
});
