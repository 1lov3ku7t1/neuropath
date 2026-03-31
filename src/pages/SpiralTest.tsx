import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Brain, ArrowLeft, RotateCcw, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Point {
  x: number;
  y: number;
  t: number;
}

const SpiralTest = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
      t: Date.now(),
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    setHasDrawn(true);
    const pos = getPos(e);
    setPoints([pos]);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    setPoints((prev) => [...prev, pos]);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setPoints([]);
    setHasDrawn(false);
    setResult(null);
  };

  const analyzeMetrics = useCallback(() => {
    if (points.length < 10) return null;
    const speeds: number[] = [];
    const angles: number[] = [];
    const deviations: number[] = [];
    const cx = 300, cy = 300;

    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const dt = (points[i].t - points[i - 1].t) / 1000;
      if (dt > 0) speeds.push(Math.sqrt(dx * dx + dy * dy) / dt);
      angles.push(Math.atan2(dy, dx));
      const dist = Math.sqrt((points[i].x - cx) ** 2 + (points[i].y - cy) ** 2);
      deviations.push(dist);
    }

    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const speedVar = speeds.reduce((a, b) => a + (b - avgSpeed) ** 2, 0) / speeds.length;
    const jitter = angles.slice(1).reduce((sum, a, i) => sum + Math.abs(a - angles[i]), 0) / angles.length;

    return {
      total_points: points.length,
      avg_speed: Math.round(avgSpeed),
      speed_variance: Math.round(speedVar),
      jitter: Math.round(jitter * 1000) / 1000,
      duration_seconds: (points[points.length - 1].t - points[0].t) / 1000,
      avg_deviation_from_center: Math.round(deviations.reduce((a, b) => a + b, 0) / deviations.length),
    };
  }, [points]);

  const handleAnalyze = async () => {
    const metrics = analyzeMetrics();
    if (!metrics) {
      toast({ title: "Draw more", description: "Please draw a more complete spiral", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-test", {
        body: { test_type: "spiral_drawing", test_data: metrics },
      });

      if (error) throw error;
      setResult(data);

      if (user) {
        await (supabase as any).from("test_results").insert({
          user_id: user.id,
          test_type: "spiral_drawing",
          score: data.score,
          risk_level: data.risk_level,
          details: { metrics, analysis: data.analysis, recommendations: data.recommendations },
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        <button onClick={() => navigate("/dashboard")} className="liquid-glass mb-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground">
            Spiral <span className="font-serif italic text-foreground/80">Drawing</span> Test
          </h1>
          <p className="mb-6 text-sm text-foreground/60">
            Draw a spiral starting from the center. The AI will analyze your motor control patterns.
          </p>

          <div className="liquid-glass-strong mb-4 rounded-3xl p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="h-[300px] w-full cursor-crosshair rounded-2xl sm:h-[400px]"
              style={{ background: "rgba(255,255,255,0.03)" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>

          <div className="mb-6 flex gap-3">
            <button onClick={clearCanvas} className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-foreground transition-transform hover:scale-105">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!hasDrawn || analyzing}
              className="liquid-glass-strong flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-foreground transition-transform hover:scale-105 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {analyzing ? "Analyzing..." : "Analyze Drawing"}
            </button>
          </div>

          {result && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ result }: { result: any }) => {
  const riskColor = result.risk_level === "low" ? "text-green-400" : result.risk_level === "moderate" ? "text-yellow-400" : "text-red-400";
  return (
    <div className="liquid-glass-strong rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">AI Analysis</h3>
        <div className="text-right">
          <p className="text-2xl font-medium text-foreground">{result.score}</p>
          <p className={`text-xs font-medium capitalize ${riskColor}`}>{result.risk_level} risk</p>
        </div>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-foreground/70">{result.analysis}</p>
      {result.recommendations?.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground/50">Recommendations</p>
          <ul className="space-y-1">
            {result.recommendations.map((rec: string, i: number) => (
              <li key={i} className="text-xs text-foreground/60">• {rec}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-[10px] text-foreground/30">⚠ This is a screening tool only. Please consult a neurologist for diagnosis.</p>
    </div>
  );
};

export default SpiralTest;
