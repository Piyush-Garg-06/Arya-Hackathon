import { useTheme } from "next-themes";
import { createContext, useContext } from "react";

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeCtx = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeContextProvider({
  children,
}: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <ThemeCtx.Provider
      value={{ theme: theme ?? "dark", setTheme, isDark, toggleTheme }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeCtx);
}
