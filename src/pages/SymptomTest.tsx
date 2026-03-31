import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomTest = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLang();

  const questions = [
    { id: "tremor_rest", text: t.q_tremor, category: "motor" },
    { id: "slowness", text: t.q_slowness, category: "motor" },
    { id: "stiffness", text: t.q_stiffness, category: "motor" },
    { id: "balance", text: t.q_balance, category: "motor" },
    { id: "handwriting", text: t.q_handwriting, category: "motor" },
    { id: "smell", text: t.q_smell, category: "non_motor" },
    { id: "sleep", text: t.q_sleep, category: "non_motor" },
    { id: "constipation", text: t.q_constipation, category: "non_motor" },
    { id: "voice", text: t.q_voice, category: "non_motor" },
    { id: "facial", text: t.q_facial, category: "non_motor" },
    { id: "dizziness", text: t.q_dizziness, category: "non_motor" },
    { id: "posture", text: t.q_posture, category: "motor" },
  ];

  const options = [
    { value: 0, label: t.never },
    { value: 1, label: t.rarely },
    { value: 2, label: t.sometimes },
    { value: 3, label: t.often },
    { value: 4, label: t.always },
  ];

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const responses = questions.map((q) => ({
        question: q.text, category: q.category, severity: answers[q.id],
        severity_label: options.find((o) => o.value === answers[q.id])?.label,
      }));
      const { data, error } = await supabase.functions.invoke("analyze-test", {
        body: { test_type: "symptom_questionnaire", test_data: { responses, total_score: Object.values(answers).reduce((a, b) => a + b, 0) } },
      });
      if (error) throw error;
      setResult(data);
      if (user) {
        await (supabase as any).from("test_results").insert({
          user_id: user.id, test_type: "symptom_questionnaire", score: data.score, risk_level: data.risk_level,
          details: { responses, analysis: data.analysis, recommendations: data.recommendations },
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
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground">
            {t.symptomTitle} <span className="font-serif italic text-foreground/80">{t.symptomSubtitle}</span>
          </h1>
          <p className="mb-8 text-sm text-foreground/60">{t.symptomInstructions}</p>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="liquid-glass rounded-2xl p-5">
                <p className="mb-3 text-sm text-foreground"><span className="mr-2 text-foreground/40">{idx + 1}.</span>{q.text}</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button key={opt.value} onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                      className={`rounded-full px-4 py-1.5 text-xs transition-transform hover:scale-105 ${answers[q.id] === opt.value ? "liquid-glass-strong text-foreground" : "text-foreground/50 hover:text-foreground/80"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAnalyze} disabled={!allAnswered || analyzing}
            className="liquid-glass-strong mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-foreground transition-transform hover:scale-105 disabled:opacity-50">
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {analyzing ? t.analyzing : `${t.analyzeResponses} (${Object.keys(answers).length}/${questions.length})`}
          </button>
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

export default SymptomTest;
