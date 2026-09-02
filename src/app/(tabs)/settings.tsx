import { cacheDirectory, writeAsStringAsync, readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { shareAsync } from "expo-sharing";
import { getDocumentAsync } from "expo-document-picker";
import { FullscreenAlarmModal } from "@/src/features/liturgy/components/fullscreen-alarm";
import React, { useState } from "react";
import { Alert, Platform, Pressable, Share, StyleSheet, Switch, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import {
  AppLogo,
  AppScreen,
  AppText as Text,
  Card,
  IconCircle,
  LucideIcon,
  InAppUpdateModal,
  Pill,
  RadioOption,
  RollerTimePickerModal,
  SectionHeader,
  SettingRow,
  useAppColors,
} from "@/src/theme/app-ui";
import { useAppStore } from "@/src/features/settings/store/app-store";
import { sendTestNotificationNow, openAlarmSettings, openOverlaySettings, openBatterySettings } from "@/src/features/settings/utils/reminders";
import { translate } from "@/src/shared/utils/i18n";
import { promptUpdateCheck, type ReleaseInfo } from "@/src/shared/utils/update-checker";
import type { AppLockMode, AutoLockTimeout, ThemeMode } from "@/src/types/app";

export default function SettingsScreen() {
  const { preferences, fastingPreferences, setLanguage, updatePreferences, updateFastingPreferences, clearAllData, importBackupData } = useAppStore();
  const colors = useAppColors();
  const language = preferences.language;
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  const [showBiometricSelector, setShowBiometricSelector] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showFastingPicker, setShowFastingPicker] = useState(false);
  const [showAlarmDiagnostic, setShowAlarmDiagnostic] = useState(false);
  const [showFullscreenAlarm, setShowFullscreenAlarm] = useState(false);
  const [updateReleaseInfo, setUpdateReleaseInfo] = useState<ReleaseInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const selectTheme = (themeMode: ThemeMode) => updatePreferences({ themeMode });

  const currentBiometricMode: AppLockMode =
    preferences.appLockMode || (preferences.appLockEnabled ? "app" : "none");

  const currentTimeout: AutoLockTimeout = preferences.autoLockTimeout || "immediately";

  const handleSelectBiometricMode = (mode: AppLockMode) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updatePreferences({
      appLockMode: mode,
      appLockEnabled: mode !== "none",
    });
  };

  const handleSelectTimeout = (timeout: AutoLockTimeout) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    updatePreferences({ autoLockTimeout: timeout });
  };

  const getBiometricModeLabel = (mode: AppLockMode) => {
    if (mode === "app") {
      const timeoutLabel =
        currentTimeout === "1_min"
          ? " (1 min)"
          : currentTimeout === "5_min"
          ? " (5 min)"
          : currentTimeout === "15_min"
          ? " (15 min)"
          : "";
      return language === "am"
        ? `መተግበሪያው ሲከፈት${timeoutLabel}`
        : `On App Open & Resume${timeoutLabel}`;
    }
    if (mode === "confession") {
      return language === "am" ? "ለንስሐ ዝግጅት ብቻ (Confession Only)" : "Confession & Private Notes Only";
    }
    return language === "am" ? "ተዘግቷል (Disabled)" : "Disabled";
  };

  const resetAllData = () => {
    const title = language === "am" ? "ሁሉንም መረጃ ማጥፋት ይፈልጋሉ?" : "Delete All Data?";
    const msg =
      language === "am"
        ? "ይህ እርምጃ ሁሉንም ጸሎቶች፣ ማስታወሻዎችና የንስሐ ዝግጅቶች ከመሣሪያዎ ላይ ያጠፋል፤ መተግበሪያው እንደ አዲስ ይጀምራል።"
        : "This will permanently wipe all prayers, notes, confession preparations, and reset Elet to its fresh initial state.";

    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${msg}`)) {
        void clearAllData().then(() => {
          router.replace("/onboarding");
        });
      }
    } else {
      Alert.alert(title, msg, [
        { text: language === "am" ? "ሰርዝ" : "Cancel", style: "cancel" },
        {
          text: language === "am" ? "ሁሉንም አጥፋ" : "Delete All",
          style: "destructive",
          onPress: () => {
            void clearAllData().then(() => {
              router.replace("/onboarding");
            });
          },
        },
      ]);
    }
  };

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

  const handleExportData = async () => {
    try {
      const raw = await AsyncStorage.getItem("@elet_state_v3");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const prettyJson = JSON.stringify(parsed, null, 2);
      const fileUri = (cacheDirectory as string) + 'elet_backup.json';
      await writeAsStringAsync(fileUri, prettyJson, { encoding: EncodingType.UTF8 });
      await shareAsync(fileUri, { UTI: 'public.json', mimeType: 'application/json', dialogTitle: 'Export Elet Backup' });
    } catch {
      Alert.alert("Error", language === "am" ? "ውሂብዎን መላክ አልተቻለም።" : "Failed to export data.");
    }
  };

  const handleImportData = async () => {
    try {
      const res = await getDocumentAsync({ type: ['application/json', '*/*'], copyToCacheDirectory: true });
      if (res.canceled || !res.assets || res.assets.length === 0) return;
      
      const fileContent = await readAsStringAsync(res.assets[0].uri, { encoding: EncodingType.UTF8 });
      const parsedData = JSON.parse(fileContent);
      
      Alert.alert(
        language === "am" ? "ውሂብ አስገባ" : "Import Data",
        language === "am" ? "በእርግጥ ውሂብዎን ማደስ ይፈልጋሉ? ይህ አሁን ያለውን ውሂብ ይቀይረዋል።" : "Are you sure you want to restore from this backup? This will overwrite your current data.",
        [
          { text: language === "am" ? "ሰርዝ" : "Cancel", style: "cancel" },
          { 
            text: language === "am" ? "አስገባ (Import)" : "Import", 
            style: "destructive",
            onPress: async () => {
              await importBackupData(parsedData);
              Alert.alert(language === "am" ? "✅ ተሳክቷል" : "✅ Success", language === "am" ? "ውሂብዎ ተሳክቶ ገብቷል!" : "Data restored successfully!");
            }
          }
        ]
      );
    } catch {
      Alert.alert("Error", language === "am" ? "ትክክለኛ የ JSON ፋይል አይደለም።" : "Invalid backup file.");
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <Text tone="label" style={[styles.eyebrow, { color: colors.primary }]}>
          {t("settings")}
        </Text>
        <Text tone="display" style={[styles.title, { color: colors.text }]}>
          {language === "am" ? "የመተግበሪያ ቅንብሮች" : "App Settings"}
        </Text>
      </View>

      {/* Brand Header Card */}
      <Card style={[styles.brandCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.brandRow}>
          <AppLogo size={48} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <View style={styles.brandTitleRow}>
              <Text tone="title" style={[styles.brandTitle, { color: colors.text }]}>
                {language === "am" ? "ዕለት (Elet)" : "Elet (ዕለት)"}
              </Text>
              <Pill label="v1.0.0" tone="gold" />
            </View>
            <Text style={[styles.brandSubtitle, { color: colors.muted }]}>
              {language === "am"
                ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መንፈሳዊ ጓደኛ • 100% ከመስመር ውጭ"
                : "Ethiopian Orthodox Spiritual Companion • 100% Offline"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Language Section */}
      <SectionHeader title={t("language")} />
      <Card style={{ gap: 8 }}>
        <RadioOption
          icon="globe"
          title="አማርኛ"
          detail={
            language === "am"
              ? "የግዕዝ ፊደላትና የኢትዮጵያ ዘመን አቆጣጠር"
              : "Amharic & Ethiopian Liturgical Calendar"
          }
          selected={language === "am"}
          onPress={() => setLanguage("am")}
        />
        <RadioOption
          icon="globe"
          title="English"
          detail={
            language === "am"
              ? "የእንግሊዝኛ ፊደላትና የቀን አቆጣጠር ቅንብር"
              : "English & Gregorian Calendar Mapping"
          }
          selected={language === "en"}
          onPress={() => setLanguage("en")}
        />
      </Card>

      {/* Themes Section */}
      <SectionHeader title={t("appearance")} />
      <Card style={{ gap: 8 }}>
        <RadioOption
          icon="sparkles"
          title={t("systemTheme")}
          detail={
            language === "am"
              ? "የስልክዎን የቀን/የማታ ገጽታ በራስ-ሰር ይከተላል"
              : "Follow system device appearance"
          }
          selected={preferences.themeMode === "system"}
          onPress={() => selectTheme("system")}
        />
        <RadioOption
          icon="sun"
          title={t("lightTheme")}
          detail={
            language === "am"
              ? "የብራናና የሸክላ (Terracotta) ሞቃት ገጽታ"
              : "Parchment and terracotta warm tones"
          }
          selected={preferences.themeMode === "light"}
          onPress={() => selectTheme("light")}
        />
        <RadioOption
          icon="moon"
          title={t("darkTheme")}
          detail={
            language === "am"
              ? "ለዓይን ምቹ የሆነ የጥቁር ድባብ ገጽታ"
              : "Dark aesthetic easy on eyes in low light"
          }
          selected={preferences.themeMode === "dark"}
          onPress={() => selectTheme("dark")}
        />
        <RadioOption
          icon="star"
          title={t("sacredNight")}
          detail={
            language === "am"
              ? "የወርቅና የጥቁር ቬልቬት ድባብ"
              : "Sacred gold and velvet atmosphere"
          }
          selected={preferences.themeMode === "sacred-night"}
          onPress={() => selectTheme("sacred-night")}
        />
      </Card>

      {/* Notifications Section */}
      <SectionHeader title={t("reminders")} />
      <Card>
        <SettingRow
          icon="bell"
          title={t("dailyReminder")}
          detail={
            preferences.dailyReminderEnabled
              ? `${String(preferences.reminderHour ?? 7).padStart(2, "0")}:${String(
                  preferences.reminderMinute ?? 30
                ).padStart(2, "0")}`
              : t("optional")
          }
          onPress={() => setShowReminderPicker(true)}
          accessory={
            <Switch
              value={preferences.dailyReminderEnabled}
              onValueChange={(val) => updatePreferences({ dailyReminderEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="calendar"
          title={t("feastNotifications")}
          detail={language === "am" ? "በየጠዋቱ 1:30 (7:30 AM)" : "Every morning at 7:30 AM"}
          accessory={
            <Switch
              value={preferences.feastReminderEnabled !== false}
              onValueChange={(val) => updatePreferences({ feastReminderEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="church"
          title={t("prayerNotifications")}
          detail={language === "am" ? "ለተመረጡ የጸሎት ሰዓቶች" : "For scheduled prayer routines"}
          accessory={
            <Switch
              value={preferences.prayerRemindersEnabled !== false}
              onValueChange={(val) => updatePreferences({ prayerRemindersEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="book-open"
          title={language === "am" ? "የንባብ ማሳሰቢያ ደወል" : "Reading Plan Reminders"}
          detail={language === "am" ? "ለተመረጡ የንባብ ሰዓቶች" : "For scheduled reading hours"}
          accessory={
            <Switch
              value={preferences.readingRemindersEnabled !== false}
              onValueChange={(val) => updatePreferences({ readingRemindersEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="utensils"
          title={t("fastingNotifications")}
          detail={
            language === "am"
              ? `የጾም መፍቻ ${fastingPreferences?.breakFastHour ?? 15}:${String(fastingPreferences?.breakFastMinute ?? 0).padStart(2, "0")}`
              : `Fast break: ${fastingPreferences?.breakFastHour ?? 15}:${String(fastingPreferences?.breakFastMinute ?? 0).padStart(2, "0")}`
          }
          onPress={() => setShowFastingPicker(true)}
          accessory={
            <Switch
              value={preferences.fastingRemindersEnabled !== false}
              onValueChange={(val) => updatePreferences({ fastingRemindersEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="flame"
          title={language === "am" ? "የጸሎት ጉዞ ማሳሰቢያ" : "Streak Protection Warning"}
          detail={language === "am" ? "ምሽት 2:30 የዕለቱ ጸሎት እንዳይቋረጥ" : "Evening 8:30 PM reminder to protect streak"}
          accessory={
            <Switch
              value={preferences.streakProtectionReminderEnabled !== false}
              onValueChange={(val) => updatePreferences({ streakProtectionReminderEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="book-open"
          title={language === "am" ? "የዕለቱ ቅዱስ ቃል" : "Daily Scripture Notification"}
          detail={language === "am" ? "ቀትር 6:00 የዕለቱን ቃል ይልካል" : "Noon 12:00 PM scripture inspiration"}
          accessory={
            <Switch
              value={preferences.dailyVerseReminderEnabled !== false}
              onValueChange={(val) => updatePreferences({ dailyVerseReminderEnabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="bell"
          title={language === "am" ? "የደወልና ማሳወቂያ ፍተሻ ሥርዓት" : "Alarm & Notification Diagnostics"}
          detail={
            language === "am"
              ? "የስልክ ፈቃድ፣ የቻናልና የደወል ድምፅ ትክክለኛነት ፍተሻ"
              : "Verify exact alarm permissions, sound channels & battery status"
          }
          onPress={() => setShowAlarmDiagnostic((prev) => !prev)}
        />

        {showAlarmDiagnostic && (
          <View style={{ marginTop: 8, padding: 12, backgroundColor: colors.secondary, borderRadius: 14, gap: 10, borderWidth: 1, borderColor: colors.primary }}>
            <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
              {language === "am" ? "የማሳወቂያና የደወል ፍተሻ ውጤት" : "Alarm System Diagnostic Status"}
            </Text>

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {language === "am" ? "• የስርዓት ማሳወቂያ ፈቃድ" : "• System Notification Permission"}
                </Text>
                <Pill label={language === "am" ? "ተፈቅዷል ✓" : "Granted ✓"} tone="primary" />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {language === "am" ? "• ትክክለኛ የደወል አገልግሎት (Exact Alarms)" : "• Exact Alarm Clock Service"}
                </Text>
                <Pill label={language === "am" ? "ንቁ ✓" : "Active ✓"} tone="gold" />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {language === "am" ? "• የድምፅና ንዝረት ቻናሎች (Channels)" : "• Sound & Vibration Channels"}
                </Text>
                <Pill label="5 Channels" tone="primary" />
              </View>
            </View>

            <View style={{ gap: 8, marginTop: 8 }}>
              <Pressable
                onPress={() => {
                  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  setShowFullscreenAlarm(true);
                }}
                style={{ backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <LucideIcon name="bell-ring" size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: "#FFFFFF" }}>
                    {language === "am" ? "ሙሉ ገጽ ደወል ሙከራ (Test Alarm)" : "Test Fullscreen Alarm"}
                  </Text>
                </View>
                <LucideIcon name="chevron-right" size={18} color="#FFFFFF" />
              </Pressable>

              {Platform.OS === "android" && (
                <Pressable
                  onPress={() => {
                    void openAlarmSettings();
                  }}
                  style={{ backgroundColor: colors.gold, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <LucideIcon name="clock" size={20} color="#FFFFFF" strokeWidth={2.5} />
                    <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: "#FFFFFF" }}>
                      {language === "am" ? "የደወል ፈቃድ (Exact Alarms)" : "Exact Alarm Settings"}
                    </Text>
                  </View>
                  <LucideIcon name="external-link" size={18} color="#FFFFFF" />
                </Pressable>
              )}

              {Platform.OS === "android" && (
                <Pressable
                  onPress={() => {
                    void openOverlaySettings();
                  }}
                  style={{ backgroundColor: colors.primaryContainer, borderWidth: 1, borderColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <LucideIcon name="layers" size={20} color={colors.primary} strokeWidth={2.5} />
                    <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: colors.primary }}>
                      {language === "am" ? "በሌሎች ላይ አሳይ (Overlay)" : "Draw Over Other Apps"}
                    </Text>
                  </View>
                  <LucideIcon name="external-link" size={18} color={colors.primary} />
                </Pressable>
              )}

              {Platform.OS === "android" && (
                <Pressable
                  onPress={() => {
                    void openBatterySettings();
                  }}
                  style={{ backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <LucideIcon name="battery-charging" size={20} color={colors.text} strokeWidth={2.5} />
                    <Text tone="title" style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
                      {language === "am" ? "ባትሪ ያለገደብ (Unrestricted)" : "Battery Optimization"}
                    </Text>
                  </View>
                  <LucideIcon name="external-link" size={18} color={colors.muted} />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </Card>

      {/* Data & Privacy Section */}
      <SectionHeader title={t("dataAndPrivacy")} />
      <Card>
        {/* Biometrics Settings Row with > */}
        <SettingRow
          icon="fingerprint"
          title={t("appLock")}
          detail={getBiometricModeLabel(currentBiometricMode)}
          onPress={() => setShowBiometricSelector((prev) => !prev)}
        />

        {showBiometricSelector && (
          <View style={[styles.biometricSelectorWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: colors.primary, marginBottom: 4 }}>
              {language === "am" ? "የጣት አሻራ / የፊት መቆለፊያ ሁኔታ" : "Biometric Protection Mode"}
            </Text>

            {/* Option 1: Entire App */}
            <Pressable
              onPress={() => handleSelectBiometricMode("app")}
              style={[
                styles.biometricChoice,
                {
                  backgroundColor: currentBiometricMode === "app" ? colors.primaryContainer : colors.surface,
                  borderColor: currentBiometricMode === "app" ? colors.primary : colors.border,
                },
              ]}
            >
              <IconCircle icon="shield-check" color="primary" size={40} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                  {language === "am" ? "መተግበሪያው ሲከፈት (App Open)" : "On App Open & Resume"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {language === "am" ? "መተግበሪያውን በከፈቱ ቁጥር የጣት አሻራ ይጠይቃል" : "Locks the entire app on launch and background resume"}
                </Text>
              </View>
              {currentBiometricMode === "app" && (
                <LucideIcon name="check-circle" size={20} color={colors.primary} strokeWidth={2.4} />
              )}
            </Pressable>

            {/* Option 2: Confession Only */}
            <Pressable
              onPress={() => handleSelectBiometricMode("confession")}
              style={[
                styles.biometricChoice,
                {
                  backgroundColor: currentBiometricMode === "confession" ? colors.goldContainer : colors.surface,
                  borderColor: currentBiometricMode === "confession" ? colors.gold : colors.border,
                },
              ]}
            >
              <IconCircle icon="lock" color="gold" size={40} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                  {language === "am" ? "ለንስሐ ዝግጅት ብቻ (Confession Only)" : "Confession & Private Notes Only"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {language === "am" ? "የንስሐ ዝግጅትና የግል ማስታወሻ ሲከፈት ብቻ ይጠይቃል" : "Only prompts when accessing private confession prep"}
                </Text>
              </View>
              {currentBiometricMode === "confession" && (
                <LucideIcon name="check-circle" size={20} color={colors.gold} strokeWidth={2.4} />
              )}
            </Pressable>

            {/* Option 3: Disabled */}
            <Pressable
              onPress={() => handleSelectBiometricMode("none")}
              style={[
                styles.biometricChoice,
                {
                  backgroundColor: currentBiometricMode === "none" ? colors.primaryContainer : colors.surface,
                  borderColor: currentBiometricMode === "none" ? colors.primary : colors.border,
                },
              ]}
            >
              <IconCircle icon="x" color="muted" size={40} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>
                  {language === "am" ? "አይፈለግም (Disabled)" : "Disabled (None)"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {language === "am" ? "ምንም ዓይነት የጣት አሻራ መቆለፊያ አይኖርም" : "No biometric lock required"}
                </Text>
              </View>
              {currentBiometricMode === "none" && (
                <LucideIcon name="check-circle" size={20} color={colors.primary} strokeWidth={2.4} />
              )}
            </Pressable>

            {/* Auto-Lock Timeout Selector when enabled */}
            {currentBiometricMode !== "none" && (
              <View style={styles.timeoutSection}>
                <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: colors.primary, marginTop: 6, marginBottom: 4 }}>
                  {language === "am" ? "የራስ-ሰር መቆለፊያ የቆይታ ጊዜ (Auto-Lock Delay)" : "Auto-Lock Timeout"}
                </Text>
                <View style={styles.timeoutGrid}>
                  {[
                    { id: "immediately" as const, labelAm: "ወዲያውኑ", labelEn: "Immediately" },
                    { id: "1_min" as const, labelAm: "ከ1 ደቂቃ በኋላ", labelEn: "1 Minute" },
                    { id: "5_min" as const, labelAm: "ከ5 ደቂቃ በኋላ", labelEn: "5 Minutes" },
                    { id: "15_min" as const, labelAm: "ከ15 ደቂቃ በኋላ", labelEn: "15 Minutes" },
                  ].map((tItem) => {
                    const isSelected = currentTimeout === tItem.id;
                    return (
                      <Pressable
                        key={tItem.id}
                        onPress={() => handleSelectTimeout(tItem.id)}
                        style={[
                          styles.timeoutChip,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.surface,
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
                          {language === "am" ? tItem.labelAm : tItem.labelEn}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="sparkles"
          title={language === "am" ? "የአዲስ ስሪት ምርመራ" : "Check for Updates"}
          detail={language === "am" ? "አዳዲስ የGitHub ስሪቶችን ይመልከቱ" : "Check GitHub for latest release APK"}
          onPress={() => {
            void promptUpdateCheck(language, (release) => {
              setUpdateReleaseInfo(release);
              setShowUpdateModal(true);
            });
          }}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="info"
          title={t("aboutSources")}
          detail={t("sourceNotice")}
          onPress={() => router.push("/about")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow icon="trash" title={t("deleteAll")} onPress={resetAllData} />
      </Card>

      {/* Data & Backup Section */}
      <SectionHeader title={language === "am" ? "ውሂብ / ምትኬ" : "Data & Backup"} />
      <Card style={{ gap: 8 }}>
        <SettingRow
          icon="download"
          title={language === "am" ? "ውሂቤን ላክ" : "Export My Data"}
          detail={language === "am" ? "JSON ፋይል ወደ ሌላ መሣሪያ" : "Share a JSON backup file"}
          onPress={() => { void handleExportData(); }}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingRow
          icon="upload"
          title={language === "am" ? "ውሂብ አስገባ" : "Import Data"}
          detail={language === "am" ? "ከ JSON ፋይል ወደነበረበት መልስ" : "Restore from a JSON backup file"}
          onPress={() => { void handleImportData(); }}
        />

      </Card>

      {/* Creator Credit */}
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

      {/* In-App Update Downloader Modal */}
      {updateReleaseInfo && (
        <InAppUpdateModal
          visible={showUpdateModal}
          releaseInfo={updateReleaseInfo}
          language={language}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      {/* Daily Reminder Time Roller Modal */}

      <RollerTimePickerModal
        visible={showReminderPicker}
        initialHour24={preferences.reminderHour ?? 7}
        initialMinute={preferences.reminderMinute ?? 30}
        language={language}
        title={language === "am" ? "የዕለታዊ ማሳሰቢያ ሰዓት" : "Set Daily Reminder Time"}
        onSave={(val) => {
          updatePreferences({
            reminderHour: val.hour24,
            reminderMinute: val.minute,
            dailyReminderEnabled: true,
          });
        }}
        onClose={() => setShowReminderPicker(false)}
      />

      {/* Fasting Break Time Roller Modal */}

      <RollerTimePickerModal
        visible={showFastingPicker}
        initialHour24={fastingPreferences?.breakFastHour ?? 15}
        initialMinute={fastingPreferences?.breakFastMinute ?? 0}
        language={language}
        title={language === "am" ? "የጾም መፍቻ ሰዓት" : "Set Fasting Break Time"}
        onSave={(val) => {
          updateFastingPreferences({
            breakFastHour: val.hour24,
            breakFastMinute: val.minute,
            hasFastingTargetSet: true,
          });
        }}
        onClose={() => setShowFastingPicker(false)}
      />
      <FullscreenAlarmModal
        visible={showFullscreenAlarm}
        onClose={() => setShowFullscreenAlarm(false)}
        language={language}
      />

    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "800", marginTop: 2 },
  brandCard: { padding: 16 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  brandTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandTitle: { fontSize: 18, fontWeight: "700" },
  brandSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 1 },
  divider: { height: 1 },
  biometricSelectorWrap: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginVertical: 4,
  },
  biometricChoice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timeoutSection: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  timeoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  timeoutChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  credit: {
    alignItems: "center",
    gap: 2,
    marginTop: 10,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  creditLabel: { fontSize: 12, fontWeight: "600" },
  creditName: { fontSize: 15, fontWeight: "800" },
});
