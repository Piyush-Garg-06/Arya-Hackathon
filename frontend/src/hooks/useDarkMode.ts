import { useTheme } from "next-themes";

export function useDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");
  const enable = () => setTheme("dark");
  const disable = () => setTheme("light");
  return { isDark, toggle, enable, disable };
}
