import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Hand, Send, Loader2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TEST_DURATION = 15;

const TappingTest = () => {
  const [phase, setPhase] = useState<"ready" | "testing" | "done">("ready");
  const [taps, setTaps] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLang();

  const startTest = () => {
    setPhase("testing"); setTaps([]); setTimeLeft(TEST_DURATION); startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, TEST_DURATION - (Date.now() - startTimeRef.current) / 1000);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) { clearInterval(timerRef.current!); setPhase("done"); }
    }, 100);
  };

  const handleTap = useCallback(() => { if (phase === "testing") setTaps((prev) => [...prev, Date.now()]); }, [phase]);

  const analyzeMetrics = () => {
    if (taps.length < 5) return null;
    const intervals = taps.slice(1).map((t, i) => t - taps[i]);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + (b - avgInterval) ** 2, 0) / intervals.length;
    const firstHalf = intervals.slice(0, Math.floor(intervals.length / 2));
    const secondHalf = intervals.slice(Math.floor(intervals.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return {
      total_taps: taps.length, duration_seconds: TEST_DURATION,
      taps_per_second: Math.round((taps.length / TEST_DURATION) * 100) / 100,
      avg_interval_ms: Math.round(avgInterval), interval_variance: Math.round(variance),
      rhythm_regularity: Math.round((1 - Math.min(Math.sqrt(variance) / avgInterval, 1)) * 100),
      fatigue_ratio: Math.round((avgSecond / avgFirst) * 100) / 100,
      first_half_speed: Math.round((firstHalf.length / (TEST_DURATION / 2)) * 100) / 100,
      second_half_speed: Math.round((secondHalf.length / (TEST_DURATION / 2)) * 100) / 100,
    };
  };

  const handleAnalyze = async () => {
    const metrics = analyzeMetrics();
    if (!metrics) { toast({ title: t.notEnoughTaps, description: t.notEnoughTapsDesc, variant: "destructive" }); return; }
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-test", { body: { test_type: "finger_tapping", test_data: metrics } });
      if (error) throw error;
      setResult(data);
      if (user) {
        await (supabase as any).from("test_results").insert({
          user_id: user.id, test_type: "finger_tapping", score: data.score, risk_level: data.risk_level,
          details: { metrics, analysis: data.analysis, recommendations: data.recommendations },
        });
      }
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setAnalyzing(false); }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        <button onClick={() => navigate("/dashboard")} className="liquid-glass mb-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </button>
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground">
            {t.tappingTitle} <span className="font-serif italic text-foreground/80">{t.tappingSubtitle}</span> {t.tappingTestLabel}
          </h1>
          <p className="mb-8 text-sm text-foreground/60">{t.tappingInstructions}</p>

          <div className="liquid-glass-strong mb-6 flex flex-col items-center rounded-3xl p-8">
            {phase === "ready" && (
              <button onClick={startTest} className="flex h-32 w-32 items-center justify-center rounded-full bg-foreground/10 transition-transform hover:scale-110 active:scale-95">
                <Play className="h-10 w-10 text-foreground" />
              </button>
            )}
            {phase === "testing" && (
              <>
                <p className="mb-4 text-4xl font-medium text-foreground">{timeLeft}s</p>
                <button onClick={handleTap} className="flex h-40 w-40 items-center justify-center rounded-full bg-foreground/10 transition-transform active:scale-90">
                  <Hand className="h-12 w-12 text-foreground" />
                </button>
                <p className="mt-4 text-lg font-medium text-foreground">{taps.length} {t.taps}</p>
              </>
            )}
            {phase === "done" && (
              <div className="text-center">
                <p className="mb-2 text-4xl font-medium text-foreground">{taps.length}</p>
                <p className="text-sm text-foreground/60">{t.tapsIn} {TEST_DURATION} {t.seconds}</p>
                <p className="text-xs text-foreground/40">({(taps.length / TEST_DURATION).toFixed(1)} {t.tapsSec})</p>
              </div>
            )}
          </div>

          {phase === "done" && (
            <div className="flex gap-3">
              <button onClick={() => { setPhase("ready"); setTaps([]); setResult(null); }}
                className="liquid-glass flex-1 rounded-full py-3 text-sm text-foreground transition-transform hover:scale-105">{t.tryAgain}</button>
              <button onClick={handleAnalyze} disabled={analyzing}
                className="liquid-glass-strong flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-foreground transition-transform hover:scale-105 disabled:opacity-50">
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {analyzing ? t.analyzing : t.analyze}
              </button>
            </div>
          )}
          {result && <div className="mt-6"><ResultCard result={result} t={t} /></div>}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ result, t }: { result: any; t: any }) => {
  const riskColor = result.risk_level === "low" ? "text-green-400" : result.risk_level === "moderate" ? "text-yellow-400" : "text-red-400";
  return (
    <div className="liquid-glass-strong rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">{t.aiAnalysis}</h3>
        <div className="text-right">
          <p className="text-2xl font-medium text-foreground">{result.score}</p>
          <p className={`text-xs font-medium capitalize ${riskColor}`}>{result.risk_level} {t.risk}</p>
        </div>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-foreground/70">{result.analysis}</p>
      {result.recommendations?.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground/50">{t.recommendations}</p>
          <ul className="space-y-1">{result.recommendations.map((rec: string, i: number) => (<li key={i} className="text-xs text-foreground/60">• {rec}</li>))}</ul>
        </div>
      )}
      <p className="mt-4 text-[10px] text-foreground/30">{t.disclaimer}</p>
    </div>
  );
};

export default TappingTest;
