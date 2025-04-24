import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { config as defaultConfig } from "@gluestack-ui/config";
import { createConfig, GluestackUIProvider } from "@gluestack-ui/themed";

// Define the theme context type
type ThemeType = "light" | "dark";
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

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

  // Update theme when device color scheme changes
  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme as ThemeType);
    }
  }, [colorScheme]);

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
