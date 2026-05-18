import React, { useEffect } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { useAuthStore } from "./src/store/authStore";
import { COLORS } from "./src/utils/constants";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.primaryLight,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onBackground: COLORS.text,
    onSurface: COLORS.text,
    outline: COLORS.border,
  },
};

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
