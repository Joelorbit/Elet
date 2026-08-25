import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAppStore } from "@/src/features/settings/store/app-store";
import { darkTheme, lightTheme, sacredNightTheme, type AppThemeColors } from "@/src/theme/theme";

const ThemeContext = createContext<AppThemeColors>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useAppStore();
  const systemScheme = useColorScheme();

  const colors = useMemo(() => {
    const mode = preferences.themeMode;
    if (mode === "sacred-night") return sacredNightTheme;
    if (mode === "dark") return darkTheme;
    if (mode === "light") return lightTheme;
    return systemScheme === "dark" ? darkTheme : lightTheme;
  }, [preferences.themeMode, systemScheme]);

  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
}

export function useAppColors(): AppThemeColors {
  return useContext(ThemeContext);
}
