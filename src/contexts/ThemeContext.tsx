import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark-glass" | "white-purple" | "ocean-blue" | "rose-gold" | "forest-green";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark-glass",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("neuropath-theme") as Theme | null;
    const valid: Theme[] = ["dark-glass", "white-purple", "ocean-blue", "rose-gold", "forest-green"];
    return saved && valid.includes(saved) ? saved : "dark-glass";
  });

  useEffect(() => {
    const root = document.documentElement;
    const themes = ["theme-white-purple", "theme-ocean-blue", "theme-rose-gold", "theme-forest-green"];
    themes.forEach(t => root.classList.remove(t));
    if (theme !== "dark-glass") {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("neuropath-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
