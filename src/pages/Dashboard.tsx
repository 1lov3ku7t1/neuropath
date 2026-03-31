import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain,
  PenTool,
  Mic,
  ClipboardList,
  Hand,
  LogOut,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface TestResult {
  id: string;
  test_type: string;
  score: number;
  risk_level: string;
  details: any;
  created_at: string;
}

const testInfo = {
  spiral_drawing: { icon: PenTool, label: "Spiral Drawing", color: "bg-foreground/10" },
  voice_analysis: { icon: Mic, label: "Voice Analysis", color: "bg-foreground/10" },
  symptom_questionnaire: { icon: ClipboardList, label: "Symptom Questionnaire", color: "bg-foreground/10" },
  finger_tapping: { icon: Hand, label: "Finger Tapping", color: "bg-foreground/10" },
};

const riskColors: Record<string, string> = {
  low: "text-green-400",
  moderate: "text-yellow-400",
  high: "text-red-400",
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await (supabase as any)
      .from("test_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setResults(data as TestResult[]);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const tests = [
    { key: "spiral_drawing", path: "/test/spiral", label: "Spiral Drawing", desc: "Draw a spiral to assess tremor", icon: PenTool },
    { key: "voice_analysis", path: "/test/voice", label: "Voice Analysis", desc: "Record your voice for analysis", icon: Mic },
    { key: "symptom_questionnaire", path: "/test/symptoms", label: "Symptoms", desc: "Answer screening questions", icon: ClipboardList },
    { key: "finger_tapping", path: "/test/tapping", label: "Finger Tapping", desc: "Tap to measure motor speed", icon: Hand },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <nav className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Brain className="h-6 w-6 text-foreground" />
            <span className="text-xl font-semibold tracking-tighter text-foreground">neuropath</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </nav>

        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            Your <span className="font-serif italic text-foreground/80">Assessment</span> Hub
          </h1>
          <p className="mb-8 text-sm text-foreground/60">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>

          {/* Test Cards */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">Take a Test</h2>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tests.map((test) => (
              <Link
                key={test.key}
                to={test.path}
                className="liquid-glass group flex flex-col gap-3 rounded-2xl p-5 transition-transform hover:scale-[1.03]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
                  <test.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground">{test.label}</h3>
                <p className="text-xs text-foreground/60">{test.desc}</p>
                <div className="mt-auto flex items-center gap-1 text-xs text-foreground/50 group-hover:text-foreground/80">
                  Start test <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* Results History */}
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground/50">Recent Results</h2>
          {loading ? (
            <div className="liquid-glass rounded-2xl p-8 text-center text-sm text-foreground/50">Loading...</div>
          ) : results.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-8 text-center">
              <TrendingUp className="mx-auto mb-3 h-8 w-8 text-foreground/30" />
              <p className="text-sm text-foreground/50">No test results yet. Take your first test above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => {
                const info = testInfo[result.test_type as keyof typeof testInfo];
                const Icon = info?.icon || Brain;
                return (
                  <div key={result.id} className="liquid-glass flex items-center gap-4 rounded-2xl p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground/10">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{info?.label || result.test_type}</p>
                      <div className="flex items-center gap-3 text-xs text-foreground/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-foreground">{Math.round(result.score)}</p>
                      <p className={`text-xs font-medium capitalize ${riskColors[result.risk_level] || "text-foreground/50"}`}>
                        {result.risk_level} risk
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
