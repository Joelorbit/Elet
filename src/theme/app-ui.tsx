import React, { type ReactNode } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  type TextProps,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppStore } from "@/src/features/settings/store/app-store";
import { useAppColors } from "@/src/theme/theme-provider";
import { LucideIcon, type IconName } from "@/src/shared/components/icons";

export { useAppColors, LucideIcon, type IconName };
export { AppIcon } from "@/src/shared/components/icons";

export type TextTone = "body" | "label" | "title" | "display";

/**
 * Resolves exact font family and strips fontWeight on Native so React Native Android/iOS
 * font manager resolves @expo-google-fonts custom font files without falling back to Roboto.
 */
function resolveFont(
  language: string,
  tone: TextTone,
  weight?: string | number
): { fontFamily: string; fontWeight?: any } {
  const is900 = weight === "900" || weight === "black";
  const is800 = weight === "800" || weight === "extra-bold" || tone === "display";
  const is700 = weight === "700" || weight === "bold" || tone === "title";
  const is600 = weight === "600" || weight === "semi-bold";
  const is500 = weight === "500" || weight === "medium";

  if (Platform.OS === "web") {
    if (language === "am") {
      return {
        fontFamily: "'Noto Sans Ethiopic', sans-serif",
        fontWeight: is900 ? "900" : is800 ? "800" : is700 ? "700" : is600 ? "600" : is500 ? "500" : "400",
      };
    }
    if (tone === "display" || tone === "title" || is700 || is800 || is900) {
      return {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: is900 ? "900" : is800 ? "800" : is700 ? "700" : is600 ? "600" : "600",
      };
    }
    return {
      fontFamily: "'Lexend', sans-serif",
      fontWeight: is700 ? "700" : is600 ? "600" : is500 ? "500" : "400",
    };
  }

  // Native (Android & iOS Expo Go)
  if (language === "am") {
    if (is900) return { fontFamily: "NotoSansEthiopic_900Black", fontWeight: undefined };
    if (is800 || is700) return { fontFamily: "NotoSansEthiopic_700Bold", fontWeight: undefined };
    if (is600 || is500) return { fontFamily: "NotoSansEthiopic_600SemiBold", fontWeight: undefined };
    return { fontFamily: "NotoSansEthiopic_400Regular", fontWeight: undefined };
  }

  if (tone === "display" || is900) {
    return { fontFamily: "Outfit_900Black", fontWeight: undefined };
  }
  if (is800) {
    return { fontFamily: "Outfit_800ExtraBold", fontWeight: undefined };
  }
  if (tone === "title" || is700) {
    return { fontFamily: "Outfit_700Bold", fontWeight: undefined };
  }
  if (is600) {
    return { fontFamily: "Outfit_600SemiBold", fontWeight: undefined };
  }
  if (is500) {
    return { fontFamily: "Lexend_500Medium", fontWeight: undefined };
  }

  return { fontFamily: "Lexend_400Regular", fontWeight: undefined };
}

export function AppText({
  style,
  tone = "body",
  children,
  ...props
}: TextProps & { tone?: TextTone }) {
  const colors = useAppColors();
  const { preferences } = useAppStore();
  const language = preferences.language;
  const flattened = StyleSheet.flatten(style) || {};

  const rawFontSize = Number(
    flattened.fontSize ||
      (tone === "display" ? 28 : tone === "title" ? 18 : tone === "label" ? 12 : 14)
  );

  const autoLineHeight = Math.round(
    rawFontSize * (language === "am" ? 1.4 : tone === "display" ? 1.15 : 1.35)
  );
  const resolvedLineHeight = flattened.lineHeight !== undefined ? flattened.lineHeight : autoLineHeight;
  const { fontFamily, fontWeight } = resolveFont(language, tone, flattened.fontWeight);

  return (
    <NativeText
      {...props}
      style={[
        {
          includeFontPadding: false,
          textAlignVertical: "center",
        },
        flattened,
        {
          color: flattened.color || colors.text,
          fontSize: rawFontSize,
          lineHeight: flattened.lineHeight !== undefined ? flattened.lineHeight : resolvedLineHeight,
          fontFamily,
          fontWeight,
          letterSpacing: tone === "display" ? -0.8 : tone === "title" ? -0.3 : 0,
        },
      ]}
    >
      {children}
    </NativeText>
  );
}

export const Text = AppText;

export function AppScreen({
  children,
  scroll = false,
  bottomSafeArea = false,
}: {
  children: ReactNode;
  scroll?: boolean;
  bottomSafeArea?: boolean;
}) {
  const colors = useAppColors();
  const content = scroll ? (
    <ScrollView
      style={styles.fill}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fill}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#FAF7F2" ? "dark" : "light"} />
      <SafeAreaView
        edges={bottomSafeArea ? ["top", "left", "right", "bottom"] : ["top", "left", "right"]}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={[styles.screen, { backgroundColor: colors.background }]}>{content}</View>
      </SafeAreaView>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  const colors = useAppColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function TerracottaSurface({ children, style }: { children: ReactNode; style?: object }) {
  return (
    <View style={styles.terracottaOuter}>
      <View style={[styles.terracottaInner, style]}>{children}</View>
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  const colors = useAppColors();
  return (
    <View style={styles.sectionHeader}>
      <Text tone="title" style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {action}
    </View>
  );
}

export function IconCircle({
  icon,
  color = "primary",
  size = 50,
}: {
  icon: IconName;
  color?: "primary" | "gold" | "crimson" | "muted" | "danger" | "emerald";
  size?: number;
}) {
  const colors = useAppColors();

  const styleMap = {
    primary: {
      background: colors.primaryContainer,
      foreground: colors.primary,
      borderColor: colors.primary,
    },
    gold: {
      background: colors.goldContainer,
      foreground: colors.gold,
      borderColor: colors.gold,
    },
    crimson: {
      background: colors.dangerContainer,
      foreground: colors.danger,
      borderColor: colors.danger,
    },
    danger: {
      background: colors.dangerContainer,
      foreground: colors.danger,
      borderColor: colors.danger,
    },
    emerald: {
      background: colors.emeraldContainer,
      foreground: colors.emerald,
      borderColor: colors.emerald,
    },
    muted: {
      background: colors.secondary,
      foreground: colors.muted,
      borderColor: colors.border,
    },
  };

  const palette = styleMap[color] || styleMap.primary;
  const iconSize = Math.max(22, Math.round(size * 0.52));

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          borderRadius: size / 2,
          backgroundColor: palette.background,
          borderColor: palette.borderColor,
          borderWidth: 1.5,
          flexShrink: 0,
        },
      ]}
    >
      <LucideIcon name={icon} size={iconSize} color={palette.foreground} strokeWidth={2.2} />
    </View>
  );
}

export function AppLogo({ size = 48 }: { size?: number }) {
  const colors = useAppColors();
  const radius = size / 2;
  return (
    <View
      style={[
        styles.logoWrap,
        {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          borderRadius: radius,
          borderColor: colors.gold,
          backgroundColor: colors.surface,
          flexShrink: 0,
        },
      ]}
    >
      <NativeText style={{ fontSize: Math.round(size * 0.58), color: colors.gold, fontWeight: "900" }}>
        ✞
      </NativeText>
    </View>
  );
}

export function AppEmblem({ icon = "church", size = 84 }: { icon?: IconName; size?: number }) {
  const colors = useAppColors();
  return (
    <View
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: colors.gold,
        backgroundColor: colors.goldContainer,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <LucideIcon name={icon} size={Math.round(size * 0.5)} color={colors.gold} strokeWidth={2.2} />
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  color,
  backgroundColor,
  size = 46,
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  color?: string;
  backgroundColor?: string;
  size?: number;
}) {
  const colors = useAppColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.secondary,
          borderWidth: 1.5,
          borderColor: colors.border,
          flexShrink: 0,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      <LucideIcon name={icon} size={Math.round(size * 0.52)} color={color || colors.primary} strokeWidth={2.2} />
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  tone = "primary",
  disabled = false,
  iconPosition = "left",
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: "primary" | "soft" | "danger";
  disabled?: boolean;
  iconPosition?: "left" | "right";
}) {
  const colors = useAppColors();
  const isSoft = tone === "soft";
  const isDanger = tone === "danger";
  const bg = isDanger ? colors.danger : isSoft ? colors.surface : "#8E4424";
  const fg = isSoft ? colors.primary : "#FFFFFF";

  const iconElement = icon ? (
    <View
      style={[
        styles.buttonIconSlot,
        { backgroundColor: isSoft ? colors.secondary : "rgba(255, 255, 255, 0.22)" },
      ]}
    >
      <LucideIcon name={icon} size={17} color={fg} strokeWidth={2.4} />
    </View>
  ) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: bg,
          borderColor: isSoft ? colors.border : "transparent",
          borderWidth: isSoft ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={styles.buttonContent}>
        {iconPosition === "left" && iconElement}
        <Text tone="title" numberOfLines={1} style={[styles.primaryButtonText, { color: fg, flexShrink: 1 }]}>
          {label}
        </Text>
        {iconPosition === "right" && iconElement}
      </View>
    </Pressable>
  );
}

export function OutlineButton({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
}) {
  const colors = useAppColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.outlineButton,
        {
          borderColor: colors.outline,
          backgroundColor: pressed ? colors.surfaceElevated : colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.buttonContent}>
        {icon ? <LucideIcon name={icon} size={20} color={colors.primary} strokeWidth={2.2} /> : null}
        <Text tone="title" numberOfLines={1} style={[styles.outlineText, { color: colors.primary }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function Pill({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: "primary" | "gold" | "muted" | "danger" | "emerald";
}) {
  const colors = useAppColors();
  const palette =
    tone === "gold"
      ? { bg: colors.goldContainer, fg: colors.gold }
      : tone === "emerald"
      ? { bg: colors.emeraldContainer, fg: colors.emerald }
      : tone === "danger"
      ? { bg: colors.dangerContainer, fg: colors.danger }
      : tone === "muted"
      ? { bg: colors.secondary, fg: colors.muted }
      : { bg: colors.primaryContainer, fg: colors.primary };

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg, borderColor: palette.fg }]}>
      <Text tone="label" numberOfLines={1} style={[styles.pillText, { color: palette.fg }]}>
        {label}
      </Text>
    </View>
  );
}

export function SettingRow({
  icon,
  title,
  detail,
  accessory,
  onPress,
}: {
  icon: IconName;
  title: string;
  detail?: string;
  accessory?: ReactNode;
  onPress?: () => void;
}) {
  const colors = useAppColors();
  const content = (
    <View style={styles.settingRowInner}>
      <IconCircle icon={icon} size={48} color="primary" />
      <View style={styles.settingCopy}>
        <Text tone="title" numberOfLines={1} style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {detail ? (
          <Text style={[styles.settingDetail, { color: colors.muted }]} numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
      </View>
      <View style={styles.settingAccessory}>
        {accessory ||
          (onPress ? (
            <View style={[styles.chevronSlot, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <LucideIcon name="chevron-right" size={20} color={colors.primary} strokeWidth={2.4} />
            </View>
          ) : null)}
      </View>
    </View>
  );

  if (!onPress) return <View style={styles.settingRow}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

export function RadioOption({
  selected,
  onPress,
  title,
  detail,
  icon,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  detail?: string;
  icon?: IconName;
}) {
  const colors = useAppColors();
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.radioOptionContainer,
        {
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
          backgroundColor: selected ? colors.primaryContainer : colors.surface,
        },
      ]}
    >
      <View style={styles.radioOptionLeft}>
        {icon ? <IconCircle icon={icon} size={44} color={selected ? "primary" : "muted"} /> : null}
        <View style={styles.radioOptionCopy}>
          <Text tone="title" numberOfLines={1} style={[styles.radioOptionTitle, { color: selected ? colors.primary : colors.text }]}>
            {title}
          </Text>
          {detail ? (
            <Text numberOfLines={2} style={[styles.radioOptionDetail, { color: colors.muted }]}>
              {detail}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.radioCircleOuter,
          {
            borderColor: selected ? colors.primary : colors.border,
            backgroundColor: selected ? colors.primaryContainer : "transparent",
          },
        ]}
      >
        {selected ? <View style={[styles.radioCircleInner, { backgroundColor: colors.primary }]} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export function AppTextInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  style?: object;
}) {
  const colors = useAppColors();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      style={[
        styles.input,
        multiline ? styles.multilineInput : styles.singleInput,
        { backgroundColor: colors.input, color: colors.text, borderColor: colors.outline },
        style,
      ]}
    />
  );
}

export function ProgressRing({
  progress,
  size = 64,
  label,
  caption,
}: {
  progress: number;
  size?: number;
  label: string;
  caption: string;
}) {
  const colors = useAppColors();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: progress >= 1 ? colors.emerald : colors.gold,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text tone="title" style={{ fontSize: 16, color: colors.text }}>
        {label}
      </Text>
      <Text tone="label" style={{ fontSize: 9, color: colors.muted }}>
        {caption}
      </Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  detail,
  action,
}: {
  icon: IconName;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  const colors = useAppColors();
  return (
    <View style={styles.empty}>
      <IconCircle icon={icon} size={58} color="gold" />
      <Text tone="title" style={[styles.emptyTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.emptyDetail, { color: colors.muted }]}>{detail}</Text>
      {action ? <View style={styles.emptyAction}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: "100%" },
  safeArea: { flex: 1 },
  screen: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center" },
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36, gap: 14 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    ...Platform.select({
      web: { boxShadow: "0px 4px 14px rgba(60, 40, 25, 0.06)" },
      default: {
        elevation: 2,
        shadowColor: "#3C2819",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  terracottaOuter: {
    borderRadius: 22,
    ...Platform.select({
      web: { boxShadow: "0px 6px 18px rgba(142, 68, 36, 0.3)" },
      default: {
        elevation: 6,
        shadowColor: "#8E4424",
        shadowOpacity: 0.3,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  terracottaInner: {
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#8E4424",
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 2,
  },
  sectionTitle: { fontSize: 18, lineHeight: 24 },
  iconContainer: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  iconButton: { alignItems: "center", justifyContent: "center" },
  primaryButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    borderRadius: 18,
    ...Platform.select({
      web: { boxShadow: "0px 4px 10px rgba(142, 68, 36, 0.28)" },
      default: {
        elevation: 3,
        shadowColor: "#8E4424",
        shadowOpacity: 0.28,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    maxWidth: "100%",
    paddingHorizontal: 2,
  },
  buttonIconSlot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  primaryButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.1,
  },
  outlineButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 18,
  },
  outlineText: { fontSize: 15, lineHeight: 21, textAlign: "center" },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  pillText: { fontSize: 11, lineHeight: 15, letterSpacing: 0.3 },
  settingRow: { minHeight: 58, width: "100%", paddingVertical: 4 },
  settingRowInner: { width: "100%", flexDirection: "row", alignItems: "center", gap: 12 },
  settingCopy: { flex: 1, minWidth: 0, gap: 2 },
  settingTitle: { fontSize: 15, lineHeight: 20 },
  settingDetail: { fontSize: 13, lineHeight: 18 },
  settingAccessory: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
  chevronSlot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  radioOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    width: "100%",
    gap: 12,
  },
  radioOptionLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, minWidth: 0 },
  radioOptionCopy: { flex: 1, minWidth: 0, gap: 2 },
  radioOptionTitle: { fontSize: 15, lineHeight: 20 },
  radioOptionDetail: { fontSize: 12, lineHeight: 17 },
  radioCircleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioCircleInner: { width: 10, height: 10, borderRadius: 5 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, lineHeight: 22 },
  singleInput: { minHeight: 50 },
  multilineInput: { minHeight: 120, paddingTop: 12, paddingBottom: 12 },
  empty: { alignItems: "center", gap: 10, paddingVertical: 24, paddingHorizontal: 16 },
  emptyTitle: { fontSize: 17, textAlign: "center", lineHeight: 24 },
  emptyDetail: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  emptyAction: { width: "100%", maxWidth: 280, marginTop: 8 },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    ...Platform.select({
      web: { boxShadow: "0px 3px 10px rgba(142, 68, 36, 0.24)" },
      default: {
        elevation: 4,
        shadowColor: "#8E4424",
        shadowOpacity: 0.24,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
});
