import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import SettingsMenu from "@/components/SettingsMenu";
import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  Brain,
  Microscope,
  Plus,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="relative flex w-full flex-col lg:w-[52%]">
          <div className="liquid-glass-strong absolute inset-4 rounded-3xl lg:inset-6" />

          <nav className="relative z-10 flex items-center justify-between px-8 pt-8 lg:px-12 lg:pt-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center">
                <Brain className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tighter text-foreground">
                {t.neuropath}
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {t.menu}
              <Menu className="h-4 w-4" />
            </button>
          </nav>

          <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-8 lg:px-12">
            <div className="mb-8 flex h-20 w-20 items-center justify-center">
              <Brain className="h-16 w-16 text-foreground" />
            </div>

            <h1 className="mb-8 text-5xl font-medium leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              {t.heroLine1}
              <br />
              <span className="font-serif italic text-foreground/80">{t.heroLine2}</span>{" "}
              {t.heroLine3}
            </h1>

            <button
              onClick={() => navigate("/auth")}
              className="liquid-glass-strong mb-8 flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {t.startJourney}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/15">
                <Download className="h-3.5 w-3.5" />
              </span>
            </button>

            <div className="mb-12 flex flex-wrap gap-2">
              {[
                { label: t.symptomTracking, path: "/test/symptoms" },
                { label: t.aiAdvisor, path: "/test/voice" },
                { label: t.treatmentGuide, path: "/test/spiral" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="liquid-glass cursor-pointer rounded-full px-4 py-1.5 text-xs text-foreground/80 transition-transform hover:scale-105 active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 px-8 pb-8 lg:px-12 lg:pb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-foreground/50">
              {t.ourMission}
            </p>
            <p className="mb-3 max-w-md text-sm leading-relaxed text-foreground/80">
              "{t.missionQuote}{" "}
              <span className="font-serif italic">{t.missionImagined}</span>{" "}
              {t.missionMiddle}{" "}
              <span className="font-serif italic">{t.missionAlone}</span>"
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 max-w-[40px] bg-foreground/20" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/50">
                {t.drName}
              </span>
              <span className="h-px flex-1 max-w-[40px] bg-foreground/20" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden w-[48%] flex-col p-6 lg:flex">
          <div className="flex items-center justify-between">
            <div className="liquid-glass flex items-center gap-1 rounded-full p-1.5">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:text-foreground/80">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:text-foreground/80">
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <button className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105 active:scale-95">
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 self-end">
            <button onClick={() => navigate("/auth")} className="liquid-glass w-56 cursor-pointer rounded-2xl p-5 text-left transition-transform hover:scale-105">
              <h3 className="mb-2 text-sm font-medium text-foreground">{t.joinEcosystem}</h3>
              <p className="text-xs leading-relaxed text-foreground/60">{t.joinDesc}</p>
            </button>
          </div>

          <div className="mt-auto">
            <div className="liquid-glass rounded-[2.5rem] p-4">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <button onClick={() => navigate("/test/spiral")} className="liquid-glass flex cursor-pointer flex-col gap-3 rounded-3xl p-5 text-left transition-transform hover:scale-[1.03]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
                    <Wand2 className="h-4 w-4 text-foreground" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground">{t.aiProcessing}</h4>
                  <p className="text-xs leading-relaxed text-foreground/60">{t.aiProcessingDesc}</p>
                </button>
                <button onClick={() => navigate("/test/tapping")} className="liquid-glass flex cursor-pointer flex-col gap-3 rounded-3xl p-5 text-left transition-transform hover:scale-[1.03]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
                    <BookOpen className="h-4 w-4 text-foreground" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground">{t.careArchive}</h4>
                  <p className="text-xs leading-relaxed text-foreground/60">{t.careArchiveDesc}</p>
                </button>
              </div>

              <button onClick={() => navigate("/test/voice")} className="liquid-glass flex w-full cursor-pointer items-center gap-4 rounded-3xl p-5 text-left transition-transform hover:scale-[1.02]">
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground/5">
                  <Microscope className="h-8 w-8 text-foreground/60" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-foreground">{t.neuralMonitoring}</h4>
                  <p className="text-xs leading-relaxed text-foreground/60">{t.neuralMonitoringDesc}</p>
                </div>
                <span className="liquid-glass flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground">
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SettingsMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Index;
