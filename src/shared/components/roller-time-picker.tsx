import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LucideIcon, type IconName } from "@/src/shared/components/icons";
import { useAppColors } from "@/src/theme/theme-provider";
import { AppText as Text, Card, Pill } from "@/src/theme/app-ui";
import { sendTestNotificationNow } from "@/src/features/settings/utils/reminders";
import type { AppLanguage } from "@/src/types/app";

export interface RollerTimeValue {
  hour24: number;
  minute: number;
  mode?: "full_alarm" | "notification_only";
  vibrate?: boolean;
  soundType?: "sacred_chime" | "church_bell" | "gentle_morning";
  repeatDays?: number[]; // 0 = Sun, 1 = Mon ...
}

interface RollerTimePickerModalProps {
  visible: boolean;
  initialHour24?: number;
  initialMinute?: number;
  language?: AppLanguage;
  title?: string;
  onSave: (value: RollerTimeValue) => void;
  onClose: () => void;
}

const ITEM_HEIGHT = 46;

import { calculateAlarmCountdown } from "@/src/shared/utils/alarm-countdown";
export { calculateAlarmCountdown };

export function RollerTimePickerModal({
  visible,
  initialHour24 = 7,
  initialMinute = 0,
  language = "am",
  title,
  onSave,
  onClose,
}: RollerTimePickerModalProps) {
  const colors = useAppColors();

  // Convert 24-hour initial values to 12-hour + Period
  const initialPeriod = initialHour24 >= 12 ? "PM" : "AM";
  const initial12Hour = initialHour24 % 12 === 0 ? 12 : initialHour24 % 12;

  const [selectedHour, setSelectedHour] = useState<number>(initial12Hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialMinute);
  const hourDragStart = useRef<number | null>(null);
  const minuteDragStart = useRef<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(initialPeriod);

  // Additional Alarm Options
  const [alarmMode, setAlarmMode] = useState<"full_alarm" | "notification_only">("full_alarm");
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [repeatType, setRepeatType] = useState<"everyday" | "weekdays" | "weekends" | "once_a_week">("everyday");
  const [soundType, setSoundType] = useState<"sacred_chime" | "church_bell" | "gentle_morning">("sacred_chime");

  useEffect(() => {
    if (visible) {
      const p = initialHour24 >= 12 ? "PM" : "AM";
      const h = initialHour24 % 12 === 0 ? 12 : initialHour24 % 12;
      setSelectedHour(h);
      setSelectedMinute(initialMinute);
      setSelectedPeriod(p);
    }
  }, [visible, initialHour24, initialMinute]);

  // Compute 24-hour value
  const current24Hour = useMemo(() => {
    let h = selectedHour % 12;
    if (selectedPeriod === "PM") h += 12;
    return h;
  }, [selectedHour, selectedPeriod]);

  const countdownText = useMemo(() => {
    return calculateAlarmCountdown(current24Hour, selectedMinute, language);
  }, [current24Hour, selectedMinute, language]);

  const handleSave = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    let repeatDays: number[] = [0, 1, 2, 3, 4, 5, 6];
    if (repeatType === "weekdays") repeatDays = [1, 2, 3, 4, 5];
    if (repeatType === "weekends") repeatDays = [0, 6];
    if (repeatType === "once_a_week") repeatDays = [new Date().getDay()];

    onSave({
      hour24: current24Hour,
      minute: selectedMinute,
      mode: alarmMode,
      vibrate: vibrateEnabled,
      soundType,
      repeatDays,
    });
    onClose();
  };

  const cycleHour = (direction: "up" | "down") => {
    void Haptics.selectionAsync().catch(() => {});
    if (direction === "up") {
      // Rolling up (earlier in time): 1 -> 12, 12 -> 11 ...
      setSelectedHour((prev) => {
        if (prev === 12) {
          setSelectedPeriod((p) => (p === "AM" ? "PM" : "AM"));
          return 11;
        }
        return prev === 1 ? 12 : prev - 1;
      });
    } else {
      // Rolling down (later in time): 11 -> 12, 12 -> 1 ...
      setSelectedHour((prev) => {
        if (prev === 11) {
          setSelectedPeriod((p) => (p === "AM" ? "PM" : "AM"));
          return 12;
        }
        return prev === 12 ? 1 : prev + 1;
      });
    }
  };

  const cycleMinute = (direction: "up" | "down") => {
    void Haptics.selectionAsync().catch(() => {});
    if (direction === "up") {
      // Rolling up (earlier in time): 00 -> 59 (also roll hour up)
      setSelectedMinute((prev) => {
        if (prev === 0) {
          cycleHour("up");
          return 59;
        }
        return prev - 1;
      });
    } else {
      // Rolling down (later in time): 59 -> 00 (also roll hour down)
      setSelectedMinute((prev) => {
        if (prev === 59) {
          cycleHour("down");
          return 0;
        }
        return prev + 1;
      });
    }
  };

  const togglePeriod = () => {
    void Haptics.selectionAsync().catch(() => {});
    setSelectedPeriod((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  // Cylinder roller helper values
  const prevHour = selectedHour === 1 ? 12 : selectedHour - 1;
  const nextHour = selectedHour === 12 ? 1 : selectedHour + 1;

  const prevMinute = selectedMinute === 0 ? 59 : selectedMinute - 1;
  const nextMinute = selectedMinute === 59 ? 0 : selectedMinute + 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalSheet, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          {/* Top Navigation Bar with Cancel (X) and Save (✓) */}
          <View style={[styles.topNavBar, { borderBottomColor: colors.border }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              onPress={onClose}
              style={({ pressed }) => [styles.navIconButton, { opacity: pressed ? 0.6 : 1 }]}
            >
              <LucideIcon name="close" size={22} color={colors.muted} strokeWidth={2.4} />
            </Pressable>

            <View style={styles.titleWrap}>
              <Text tone="title" style={[styles.navTitle, { color: colors.text }]}>
                {title || (language === "am" ? "የሰዓት ማስተካከያ" : "Set Time & Alarm")}
              </Text>
              <Text style={[styles.countdownSubtitle, { color: colors.primary }]}>
                {countdownText}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save Time"
              onPress={handleSave}
              style={({ pressed }) => [
                styles.navSaveButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <LucideIcon name="check" size={20} color="#FFFFFF" strokeWidth={2.6} />
            </Pressable>
          </View>

          {/* 3D Cylinder Roller Dial Container */}
          <View style={[styles.rollerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {/* Column 1: Hours Roller */}
            <View
              style={styles.rollerColumn}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                hourDragStart.current = e.nativeEvent.pageY;
              }}
              onResponderMove={(e) => {
                if (hourDragStart.current === null) return;
                const dy = hourDragStart.current - e.nativeEvent.pageY;
                // ITEM_HEIGHT is 46, we use 30 as threshold for easier swipe
                if (Math.abs(dy) >= 30) {
                  const steps = Math.floor(Math.abs(dy) / 30);
                  for (let i = 0; i < steps; i++) {
                    dy > 0 ? cycleHour("down") : cycleHour("up");
                  }
                  hourDragStart.current = e.nativeEvent.pageY;
                }
              }}
              onResponderRelease={() => {
                hourDragStart.current = null;
              }}
            >
              <Pressable
                onPress={() => cycleHour("up")}
                style={({ pressed }) => [styles.rollerArrow, { opacity: pressed ? 0.5 : 0.9 }]}
              >
                <LucideIcon name="chevron-up" size={18} color={colors.primary} />
              </Pressable>

              <Pressable onPress={() => cycleHour("up")} style={styles.cylinderSlot}>
                <Text style={[styles.cylinderDimmedText, { color: colors.muted }]}>
                  {String(prevHour).padStart(2, "0")}
                </Text>
              </Pressable>

              <View
                style={[
                  styles.rollerCenterCard,
                  {
                    backgroundColor: colors.primaryContainer,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text tone="display" style={[styles.cylinderCenterText, { color: colors.primary }]}>
                  {String(selectedHour).padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => cycleHour("down")} style={styles.cylinderSlot}>
                <Text style={[styles.cylinderDimmedText, { color: colors.muted }]}>
                  {String(nextHour).padStart(2, "0")}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => cycleHour("down")}
                style={({ pressed }) => [styles.rollerArrow, { opacity: pressed ? 0.5 : 0.9 }]}
              >
                <LucideIcon name="chevron-down" size={18} color={colors.primary} />
              </Pressable>
            </View>

            {/* Colon Separator */}
            <View style={styles.separatorBox}>
              <Text tone="display" style={[styles.separatorColon, { color: colors.primary }]}>
                :
              </Text>
            </View>

            {/* Column 2: Minutes Roller */}
            <View
              style={styles.rollerColumn}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                minuteDragStart.current = e.nativeEvent.pageY;
              }}
              onResponderMove={(e) => {
                if (minuteDragStart.current === null) return;
                const dy = minuteDragStart.current - e.nativeEvent.pageY;
                if (Math.abs(dy) >= 30) {
                  const steps = Math.floor(Math.abs(dy) / 30);
                  for (let i = 0; i < steps; i++) {
                    dy > 0 ? cycleMinute("down") : cycleMinute("up");
                  }
                  minuteDragStart.current = e.nativeEvent.pageY;
                }
              }}
              onResponderRelease={() => {
                minuteDragStart.current = null;
              }}
            >
              <Pressable
                onPress={() => cycleMinute("up")}
                style={({ pressed }) => [styles.rollerArrow, { opacity: pressed ? 0.5 : 0.9 }]}
              >
                <LucideIcon name="chevron-up" size={18} color={colors.primary} />
              </Pressable>

              <Pressable onPress={() => cycleMinute("up")} style={styles.cylinderSlot}>
                <Text style={[styles.cylinderDimmedText, { color: colors.muted }]}>
                  {String(prevMinute).padStart(2, "0")}
                </Text>
              </Pressable>

              <View
                style={[
                  styles.rollerCenterCard,
                  {
                    backgroundColor: colors.primaryContainer,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text tone="display" style={[styles.cylinderCenterText, { color: colors.primary }]}>
                  {String(selectedMinute).padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => cycleMinute("down")} style={styles.cylinderSlot}>
                <Text style={[styles.cylinderDimmedText, { color: colors.muted }]}>
                  {String(nextMinute).padStart(2, "0")}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => cycleMinute("down")}
                style={({ pressed }) => [styles.rollerArrow, { opacity: pressed ? 0.5 : 0.9 }]}
              >
                <LucideIcon name="chevron-down" size={18} color={colors.primary} />
              </Pressable>
            </View>

            {/* Column 3: AM / PM Period Segment (Only 2 options, no duplicates) */}
            <View style={styles.periodSegmentColumn}>
              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync().catch(() => {});
                  setSelectedPeriod("AM");
                }}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === "AM" ? colors.primary : colors.secondary,
                    borderColor: selectedPeriod === "AM" ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  tone="title"
                  style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === "AM" ? "#FFFFFF" : colors.muted },
                  ]}
                >
                  AM
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync().catch(() => {});
                  setSelectedPeriod("PM");
                }}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === "PM" ? colors.primary : colors.secondary,
                    borderColor: selectedPeriod === "PM" ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  tone="title"
                  style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === "PM" ? "#FFFFFF" : colors.muted },
                  ]}
                >
                  PM
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Additional Alarm Controls Menu Card */}
          <ScrollView
            style={styles.controlsScroll}
            contentContainerStyle={styles.controlsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Alarm Mode: Fullscreen Disturbance vs Notification */}
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 14 }}>
              <Text tone="label" style={[styles.menuSectionHeader, { color: colors.primary }]}>
                {language === "am" ? "የማንቂያ ዓይነት" : "ALARM BEHAVIOR"}
              </Text>
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setAlarmMode("full_alarm")}
                  style={[
                    styles.modeChoice,
                    {
                      backgroundColor: alarmMode === "full_alarm" ? colors.primaryContainer : colors.secondary,
                      borderColor: alarmMode === "full_alarm" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <LucideIcon
                    name="bell"
                    size={18}
                    color={alarmMode === "full_alarm" ? colors.primary : colors.muted}
                    strokeWidth={2.4}
                  />
                  <Text
                    tone="title"
                    style={{
                      fontSize: 13,
                      fontWeight: "800",
                      color: alarmMode === "full_alarm" ? colors.primary : colors.text,
                    }}
                  >
                    {language === "am" ? "ደወልና ንዝረት" : "Full Alarm"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setAlarmMode("notification_only")}
                  style={[
                    styles.modeChoice,
                    {
                      backgroundColor: alarmMode === "notification_only" ? colors.primaryContainer : colors.secondary,
                      borderColor: alarmMode === "notification_only" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <LucideIcon
                    name="sparkles"
                    size={18}
                    color={alarmMode === "notification_only" ? colors.primary : colors.muted}
                    strokeWidth={2.4}
                  />
                  <Text
                    tone="title"
                    style={{
                      fontSize: 13,
                      fontWeight: "800",
                      color: alarmMode === "notification_only" ? colors.primary : colors.text,
                    }}
                  >
                    {language === "am" ? "ማሳወቂያ ብቻ" : "Notification Only"}
                  </Text>
                </Pressable>
              </View>
            </Card>

            {/* Repeat Frequency Options */}
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 14 }}>
              <Text tone="label" style={[styles.menuSectionHeader, { color: colors.primary }]}>
                {language === "am" ? "የመደጋገም ድግግሞሽ" : "REPEAT FREQUENCY"}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {[
                  { id: "everyday", icon: "calendar", labelAm: "በየቀኑ", labelEn: "Everyday" },
                  { id: "weekdays", icon: "calendar-days", labelAm: "ከሰኞ-አርብ", labelEn: "Weekdays" },
                  { id: "weekends", icon: "star", labelAm: "ቅዳሜና እሑድ", labelEn: "Weekends" },
                  { id: "once_a_week", icon: "refresh", labelAm: "በየሳምንቱ (አንድ ቀን)", labelEn: "Once a Week" },
                ].map((opt) => (
                  <Pressable
                    key={opt.id}
                    onPress={() => setRepeatType(opt.id as any)}
                    style={[
                      styles.modeChoice,
                      { paddingHorizontal: 12, paddingVertical: 10, minHeight: 0,
                        backgroundColor: repeatType === opt.id ? colors.primaryContainer : colors.secondary,
                        borderColor: repeatType === opt.id ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <LucideIcon name={opt.icon} size={16} color={repeatType === opt.id ? colors.primary : colors.muted} strokeWidth={2.4} />
                    <Text tone="title" style={{ fontSize: 12, fontWeight: "800", color: repeatType === opt.id ? colors.primary : colors.text }}>
                      {language === "am" ? opt.labelAm : opt.labelEn}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Card>

            {/* Drill-down Menus & Toggles Card */}
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 14, gap: 14 }}>
              {/* Vibration Toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <LucideIcon name="sparkle" size={18} color={colors.primary} />
                  <View>
                    <Text tone="title" style={[styles.settingTitle, { color: colors.text }]}>
                      {language === "am" ? "ንዝረት (Vibration)" : "Vibrations"}
                    </Text>
                    <Text style={[styles.settingSub, { color: colors.muted }]}>
                      {language === "am" ? "ደወሉ ሲደርስ በንዝረት ያሳውቃል" : "Haptic pulse with prayer bell"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={vibrateEnabled}
                  onValueChange={setVibrateEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Sound / Ringtone Selection */}
              <View style={styles.settingRow}>
                <View style={styles.settingLabelWrap}>
                  <LucideIcon name="church" size={18} color={colors.gold} />
                  <View>
                    <Text tone="title" style={[styles.settingTitle, { color: colors.text }]}>
                      {language === "am" ? "የደወል ዜማ" : "Ringtone / Chime"}
                    </Text>
                    <Text style={[styles.settingSub, { color: colors.muted }]}>
                      {soundType === "sacred_chime"
                        ? language === "am"
                          ? "የቤተክርስቲያን ቃጭል (Sacred Chime)"
                          : "Sacred Orthodox Chime"
                        : soundType === "church_bell"
                        ? language === "am"
                          ? "የደብር ደወል (Church Bell)"
                          : "Cathedral Bell"
                        : language === "am"
                        ? "ለስላሳ የጠዋት ዜማ"
                        : "Gentle Morning Tone"}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Pressable
                    onPress={async () => {
                      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                      await sendTestNotificationNow(language);
                    }}
                    style={[styles.previewButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                  >
                    <LucideIcon name="bell" size={14} color={colors.primary} />
                    <Text tone="label" style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
                      {language === "am" ? "ሙከራ" : "Test"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setSoundType((prev) =>
                        prev === "sacred_chime"
                          ? "church_bell"
                          : prev === "church_bell"
                          ? "gentle_morning"
                          : "sacred_chime"
                      );
                    }}
                    style={styles.drillDownButton}
                  >
                    <LucideIcon name="chevron-right" size={18} color={colors.primary} strokeWidth={2.4} />
                  </Pressable>
                </View>
              </View>

            </Card>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    maxHeight: "88%",
    paddingBottom: 24,
    ...Platform.select({
      web: { boxShadow: "0px -8px 24px rgba(0, 0, 0, 0.35)" },
      default: { elevation: 16 },
    }),
  },
  topNavBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  navIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  countdownSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  navSaveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rollerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 22,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  rollerColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rollerArrow: {
    padding: 6,
  },
  cylinderSlot: {
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rollerCenterCard: {
    width: 80,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    paddingTop: Platform.OS === "android" ? 0 : 2,
  },
  cylinderDimmedText: {
    fontSize: 17,
    fontWeight: "700",
    opacity: 0.35,
    transform: [{ scale: 0.88 }],
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  cylinderCenterText: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  periodSegmentColumn: {
    width: 68,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  periodButton: {
    width: 60,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  separatorBox: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  separatorColon: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  controlsScroll: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  controlsContainer: {
    gap: 12,
    paddingBottom: 16,
  },
  menuSectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeChoice: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  settingSub: {
    fontSize: 12,
    marginTop: 1,
  },
  drillDownButton: {
    padding: 6,
  },
  divider: {
    height: 1,
    width: "100%",
  },
});
