import React, { memo } from "react";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { LucideIcon, useAppColors } from "@/src/theme/app-ui";
import { useAppLanguage } from "@/src/features/settings/store/app-store";
import { translate } from "@/src/shared/utils/i18n";

export default function TabLayout() {
  const colors = useAppColors();
  const language = useAppLanguage();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1.5,
          height: 68 + bottomPadding,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          ...Platform.select({
            web: {
              boxShadow: "0px -4px 16px rgba(42, 26, 24, 0.1)",
            },
            default: {
              elevation: 8,
              shadowColor: "#2A1A18",
              shadowOpacity: 0.1,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: -4 },
            },
          }),
        },
        tabBarItemStyle: { borderRadius: 14, marginHorizontal: 2 },
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "800",
          marginTop: 4,
        },
      }}
      screenListeners={{
        tabPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translate(language, "today"),
          tabBarIcon: ({ color, focused }) => (
            <NavigationIcon icon="home" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: translate(language, "calendar"),
          tabBarIcon: ({ color, focused }) => (
            <NavigationIcon icon="calendar" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: translate(language, "practice"),
          tabBarIcon: ({ color, focused }) => (
            <NavigationIcon icon="church" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: translate(language, "notes"),
          tabBarIcon: ({ color, focused }) => (
            <NavigationIcon icon="book-open" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: translate(language, "settings"),
          tabBarIcon: ({ color, focused }) => (
            <NavigationIcon icon="settings" color={String(color)} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const NavigationIcon = memo(function NavigationIcon({
  icon,
  color,
  focused,
}: {
  icon: "home" | "calendar" | "church" | "book-open" | "settings";
  color: string;
  focused: boolean;
}) {
  const colors = useAppColors();
  return (
    <View
      style={{
        width: 54,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? colors.primaryContainer : "transparent",
      }}
    >
      <LucideIcon name={icon} size={24} color={color} strokeWidth={focused ? 2.5 : 2.0} />
    </View>
  );
});
