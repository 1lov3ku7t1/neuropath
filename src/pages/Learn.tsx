import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import SettingsMenu from "@/components/SettingsMenu";
import { Brain, Menu, ArrowLeft, BookOpen, Play, ExternalLink } from "lucide-react";

const Learn = () => {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const articles = [
    { title: t.learnWhat, desc: t.learnWhatDesc, icon: "🧠" },
    { title: t.learnSymptoms, desc: t.learnSymptomsDesc, icon: "📋" },
    { title: t.learnCauses, desc: t.learnCausesDesc, icon: "🔬" },
    { title: t.learnTreatment, desc: t.learnTreatmentDesc, icon: "💊" },
    { title: t.learnLiving, desc: t.learnLivingDesc, icon: "🏡" },
    { title: t.learnResearch, desc: t.learnResearchDesc, icon: "📊" },
  ];

  const videos = [
    { title: t.videoWhat, id: "cRLB7WqX0fU" },
    { title: t.videoSymptoms, id: "Se0kcMGBJkA" },
    { title: t.videoExercise, id: "Y7LG1n1vkBo" },
    { title: t.videoDiet, id: "fCWrVz9T2Ag" },
  ];

  const resources = [
    { title: "Parkinson's Foundation", url: "https://www.parkinson.org", desc: t.resourcePF },
    { title: "Michael J. Fox Foundation", url: "https://www.michaeljfox.org", desc: t.resourceMJF },
    { title: "WHO — Parkinson Disease", url: "https://www.who.int/news-room/fact-sheets/detail/parkinson-disease", desc: t.resourceWHO },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        <nav className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <Brain className="h-6 w-6 text-foreground" />
            <span className="text-xl font-semibold tracking-tighter text-foreground">{t.neuropath}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105">
              <ArrowLeft className="h-4 w-4" /> {t.back}
            </Link>
            <button onClick={() => setMenuOpen(true)} className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105">
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>

        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            {t.learnTitle} <span className="font-serif italic text-foreground/80">{t.learnSubtitle}</span>
          </h1>
          <p className="mb-8 text-sm text-foreground/60">{t.learnIntro}</p>

          {/* Articles */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">{t.learnArticles}</h2>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <div key={i} className="liquid-glass flex flex-col gap-3 rounded-2xl p-5">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="text-sm font-medium text-foreground">{a.title}</h3>
                <p className="text-xs leading-relaxed text-foreground/60">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* Videos */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">
            <Play className="mr-1 inline h-3 w-3" /> {t.learnVideos}
          </h2>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {videos.map((v, i) => (
              <div key={i} className="liquid-glass overflow-hidden rounded-2xl">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">{t.learnResources}</h2>
          <div className="mb-10 space-y-3">
            {resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="liquid-glass flex items-center gap-4 rounded-2xl p-4 transition-transform hover:scale-[1.02]">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground/10">
                  <ExternalLink className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{r.title}</h3>
                  <p className="text-xs text-foreground/60">{r.desc}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-foreground/40" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <SettingsMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Learn;
