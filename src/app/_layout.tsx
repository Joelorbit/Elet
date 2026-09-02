import { PostHogProvider } from "posthog-react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import {
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from "@expo-google-fonts/lexend";
import {
  NotoSansEthiopic_400Regular,
  NotoSansEthiopic_600SemiBold,
  NotoSansEthiopic_700Bold,
  NotoSansEthiopic_900Black,
} from "@expo-google-fonts/noto-sans-ethiopic";

import { AppStoreProvider } from "@/src/features/settings/store/app-store";
import { ThemeProvider, useAppColors } from "@/src/theme/theme-provider";
import { useAppLock } from "@/src/features/auth/hooks/use-app-lock";
import { AppLockScreen } from "@/src/features/auth/components/app-lock-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

function WebFontInjector() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const fontId = "elet-google-fonts";
      if (!document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@400;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap";
        document.head.appendChild(link);

        const style = document.createElement("style");
        style.textContent = `
          * {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          body {
            background-color: #FAF7F2;
            margin: 0;
            padding: 0;
            font-family: 'Lexend', 'Noto Sans Ethiopic', sans-serif;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return null;
}

function WebContainer({ children }: { children: React.ReactNode }) {
  const colors = useAppColors();

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={[styles.webOuter, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.webInner,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function MainAppShell() {
  const { isLocked, isAuthenticating, authenticate } = useAppLock();

  return (
    <WebContainer>
      {isLocked && (
        <AppLockScreen onUnlock={authenticate} isAuthenticating={isAuthenticating} />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="daily-scripture" options={{ presentation: "modal" }} />
        <Stack.Screen name="practice/[section]" />
        <Stack.Screen name="intercessions" options={{ presentation: "modal" }} />
        <Stack.Screen name="note-editor" options={{ presentation: "modal" }} />
        <Stack.Screen name="about" options={{ presentation: "modal" }} />
      </Stack>
    </WebContainer>
  );
}



export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    NotoSansEthiopic_400Regular,
    NotoSansEthiopic_600SemiBold,
    NotoSansEthiopic_700Bold,
    NotoSansEthiopic_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError && Platform.OS !== "web") {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF7F2", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#8E4424" />
      </View>
    );
  }

  return (
    <PostHogProvider apiKey="phc_oZ64eCe7D9FhZLBpwosbk2hphbjtoqLKSJuYKnVdzzxZ" options={{
      host: 'https://us.i.posthog.com',
      enableSessionReplay: true,
    }}>
      <SafeAreaProvider>
        <AppStoreProvider>
          <ThemeProvider>
            <WebFontInjector />
            <MainAppShell />
          </ThemeProvider>
        </AppStoreProvider>
      </SafeAreaProvider>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  webInner: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    overflow: "hidden",
    borderLeftWidth: Platform.OS === "web" ? 1 : 0,
    borderRightWidth: Platform.OS === "web" ? 1 : 0,
    elevation: Platform.OS === "web" ? 8 : 0,
  },
});
