import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { config as defaultConfig } from "@gluestack-ui/config";
import { createConfig, GluestackUIProvider } from "@gluestack-ui/themed";

// Define the theme context type
type ThemeType = "light" | "dark";
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

// SecureStore key for theme
const THEME_STORAGE_KEY = "app_theme_mode";

// Create the context
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Create the theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get the device color scheme
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(colorScheme! || "light");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme as ThemeType);
        } else if (colorScheme) {
          // If no saved theme, use device preference
          setTheme(colorScheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSavedTheme();
  }, []);

  // Save theme changes to secure storage
  useEffect(() => {
    if (!isLoading) {
      SecureStore.setItemAsync(THEME_STORAGE_KEY, theme).catch((error) => {
        console.error("Failed to save theme to storage:", error);
      });
    }
  }, [theme, isLoading]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Create the config with the current theme
  const config = createConfig({
    ...defaultConfig,
    // Use the predefined colors from the default config
    // Just modify the theme mode based on the current theme
    theme: theme === "dark" ? "dark" : "light",
    tokens: {
      ...defaultConfig.tokens,
      fonts: {
        heading: "Poppins_600SemiBold",
        body: "Poppins_400Regular",
        titan: "TitanOne_400Regular",
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GluestackUIProvider config={config}>{children}</GluestackUIProvider>
    </ThemeContext.Provider>
  );
};
