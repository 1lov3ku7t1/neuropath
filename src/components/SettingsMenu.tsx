import { X, Languages, Palette } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
}

const SettingsMenu = ({ open, onClose }: SettingsMenuProps) => {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="liquid-glass-strong relative mt-16 w-72 rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">{t.settings}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-transform hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Language */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground/50">
            <Languages className="h-3.5 w-3.5" />
            {t.language}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm transition-transform hover:scale-105 ${
                lang === "en" ? "liquid-glass-strong text-foreground" : "text-foreground/50"
              }`}
            >
              {t.english}
            </button>
            <button
              onClick={() => setLang("ru")}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm transition-transform hover:scale-105 ${
                lang === "ru" ? "liquid-glass-strong text-foreground" : "text-foreground/50"
              }`}
            >
              {t.russian}
            </button>
          </div>
        </div>

        {/* Theme */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground/50">
            <Palette className="h-3.5 w-3.5" />
            {t.theme}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTheme("dark-glass")}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-transform hover:scale-105 ${
                theme === "dark-glass" ? "liquid-glass-strong text-foreground" : "text-foreground/50"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-foreground/80" />
              {t.darkGlass}
            </button>
            <button
              onClick={() => setTheme("white-purple")}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-transform hover:scale-105 ${
                theme === "white-purple" ? "liquid-glass-strong text-foreground" : "text-foreground/50"
              }`}
            >
              <span className="h-5 w-5 rounded-full" style={{ background: "linear-gradient(135deg, #fff 50%, #7c3aed 50%)" }} />
              {t.whitePurple}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
