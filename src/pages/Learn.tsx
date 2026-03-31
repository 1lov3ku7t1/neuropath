import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import SettingsMenu from "@/components/SettingsMenu";
import { Brain, Menu, ArrowLeft, BookOpen, Play, ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Pill, HeartPulse, FlaskConical, Home, Stethoscope } from "lucide-react";

const Learn = () => {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const toggleArticle = (i: number) => setExpandedArticle(expandedArticle === i ? null : i);

  const articles = [
    {
      title: t.learnWhat,
      desc: t.learnWhatDesc,
      icon: "🧠",
      detail: t.learnWhatDetail,
      keyIcon: Brain,
    },
    {
      title: t.learnSymptoms,
      desc: t.learnSymptomsDesc,
      icon: "📋",
      detail: t.learnSymptomsDetail,
      keyIcon: AlertTriangle,
    },
    {
      title: t.learnCauses,
      desc: t.learnCausesDesc,
      icon: "🔬",
      detail: t.learnCausesDetail,
      keyIcon: FlaskConical,
    },
    {
      title: t.learnTreatment,
      desc: t.learnTreatmentDesc,
      icon: "💊",
      detail: t.learnTreatmentDetail,
      keyIcon: Pill,
    },
    {
      title: t.learnSigns,
      desc: t.learnSignsDesc,
      icon: "⚠️",
      detail: t.learnSignsDetail,
      keyIcon: Stethoscope,
    },
    {
      title: t.learnLiving,
      desc: t.learnLivingDesc,
      icon: "🏡",
      detail: t.learnLivingDetail,
      keyIcon: Home,
    },
    {
      title: t.learnResearch,
      desc: t.learnResearchDesc,
      icon: "📊",
      detail: t.learnResearchDetail,
      keyIcon: HeartPulse,
    },
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
    { title: "Mayo Clinic — Parkinson's", url: "https://www.mayoclinic.org/diseases-conditions/parkinsons-disease/symptoms-causes/syc-20376055", desc: t.resourceMayo },
    { title: "NIH — NINDS Parkinson's", url: "https://www.ninds.nih.gov/health-information/disorders/parkinsons-disease", desc: t.resourceNIH },
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

          {/* Expandable Articles */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">
            <BookOpen className="mr-1 inline h-3 w-3" /> {t.learnArticles}
          </h2>
          <div className="mb-10 space-y-3">
            {articles.map((a, i) => (
              <div key={i} className="liquid-glass overflow-hidden rounded-2xl transition-all">
                <button
                  onClick={() => toggleArticle(i)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-transform hover:scale-[1.01]"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground">{a.title}</h3>
                    <p className="text-xs text-foreground/60">{a.desc}</p>
                  </div>
                  {expandedArticle === i ? (
                    <ChevronUp className="h-4 w-4 text-foreground/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-foreground/40" />
                  )}
                </button>
                {expandedArticle === i && (
                  <div className="border-t border-foreground/10 px-5 pb-5 pt-4">
                    <div className="prose prose-sm max-w-none text-foreground/80">
                      {a.detail.split("\n\n").map((paragraph: string, pi: number) => {
                        if (paragraph.startsWith("• ") || paragraph.startsWith("- ")) {
                          return (
                            <ul key={pi} className="my-2 ml-4 list-disc space-y-1">
                              {paragraph.split("\n").map((line: string, li: number) => (
                                <li key={li} className="text-xs leading-relaxed text-foreground/70">
                                  {line.replace(/^[•\-]\s*/, "")}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (paragraph.startsWith("##")) {
                          return (
                            <h4 key={pi} className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-foreground/90">
                              {paragraph.replace(/^##\s*/, "")}
                            </h4>
                          );
                        }
                        return (
                          <p key={pi} className="mb-3 text-xs leading-relaxed text-foreground/70">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-[10px] italic text-foreground/40">{t.learnDisclaimer}</p>
                  </div>
                )}
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
