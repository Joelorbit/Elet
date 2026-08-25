import { useEffect, useState, useCallback, useRef } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import { useAppStore } from "@/src/features/settings/store/app-store";
import type { AutoLockTimeout } from "@/src/types/app";

function getTimeoutMilliseconds(timeout?: AutoLockTimeout): number {
  switch (timeout) {
    case "1_min":
      return 60 * 1000;
    case "5_min":
      return 5 * 60 * 1000;
    case "15_min":
      return 15 * 60 * 1000;
    case "1_hour":
      return 60 * 60 * 1000;
    case "immediately":
    default:
      return 0;
  }
}

export function useAppLock() {
  const { preferences } = useAppStore();
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const appState = useRef(AppState.currentState);
  const authInProgress = useRef(false);
  const backgroundTimestamp = useRef<number>(0);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldLockEntireApp =
    preferences.appLockMode === "app" ||
    (preferences.appLockEnabled &&
      preferences.appLockMode !== "confession" &&
      preferences.appLockMode !== "none");

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      setIsLocked(false);
      return true;
    }

    if (authInProgress.current) {
      return false;
    }

    try {
      authInProgress.current = true;
      setIsAuthenticating(true);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsLocked(false);
        setIsAuthenticating(false);
        authInProgress.current = false;
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          preferences.language === "am"
            ? "ዕለት — መተግበሪያውን ለመክፈት የጣት አሻራ ወይም ፊትዎን ይጠቀሙ"
            : "Elet — Unlock Spiritual Companion",
        fallbackLabel: preferences.language === "am" ? "የስልክ መክፈቻ ይለፍ ቃል ተጠቀም" : "Use Passcode",
        cancelLabel: preferences.language === "am" ? "ሰርዝ" : "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
        setIsAuthenticating(false);
        backgroundTimestamp.current = Date.now();
        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
        cooldownTimer.current = setTimeout(() => {
          authInProgress.current = false;
        }, 800);
        return true;
      } else {
        setIsAuthenticating(false);
        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
        cooldownTimer.current = setTimeout(() => {
          authInProgress.current = false;
        }, 800);
        return false;
      }
    } catch {
      setIsAuthenticating(false);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => {
        authInProgress.current = false;
      }, 800);
      return false;
    }
  }, [preferences.language]);

  useEffect(() => {
    if (!shouldLockEntireApp) {
      setIsLocked(false);
      return;
    }

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      const prev = appState.current;
      appState.current = nextAppState;

      // When leaving active state, record timestamp
      if (prev === "active" && (nextAppState === "inactive" || nextAppState === "background")) {
        if (!authInProgress.current) {
          backgroundTimestamp.current = Date.now();
        }
      }

      // When returning to active state
      const isComingFromBackground =
        prev.match(/inactive|background/) && nextAppState === "active";

      // If already authenticating or within dialog cooldown, ignore AppState transition
      if (authInProgress.current) {
        return;
      }

      if (isComingFromBackground && shouldLockEntireApp) {
        const threshold = getTimeoutMilliseconds(preferences.autoLockTimeout);
        const elapsed = Date.now() - (backgroundTimestamp.current || 0);

        if (threshold === 0 || elapsed >= threshold) {
          setIsLocked(true);
          void authenticate();
        }
      }
    });

    return () => {
      subscription.remove();
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, [shouldLockEntireApp, preferences.autoLockTimeout, authenticate]);

  return {
    isLocked,
    isAuthenticating,
    authenticate,
    unlockManually: () => {
      setIsLocked(false);
      authInProgress.current = false;
      backgroundTimestamp.current = Date.now();
    },
  };
}
