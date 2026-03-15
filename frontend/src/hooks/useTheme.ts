import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  return {
    theme: theme ?? "dark",
    resolvedTheme: resolvedTheme ?? "dark",
    setTheme,
    isDark: (resolvedTheme ?? theme) === "dark",
  };
}
