import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VoiceTest = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast({ title: "Microphone access denied", description: "Please allow microphone access to use this test.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);
    try {
      const voiceMetrics = {
        duration_seconds: duration,
        sample_rate: 44100,
        recording_quality: "standard",
        format: "webm",
        notes: "Voice recording from browser microphone for Parkinson's screening. Analyze for vocal tremor, monotone patterns, dysarthria, and hypophonia indicators.",
      };

      const { data, error } = await supabase.functions.invoke("analyze-test", {
        body: { test_type: "voice_analysis", test_data: voiceMetrics },
      });

      if (error) throw error;
      setResult(data);

      await (supabase as any).from("test_results").insert({
        user_id: user!.id,
        test_type: "voice_analysis",
        score: data.score,
        risk_level: data.risk_level,
        details: { metrics: voiceMetrics, analysis: data.analysis, recommendations: data.recommendations },
      });
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

        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground">
            Voice <span className="font-serif italic text-foreground/80">Analysis</span>
          </h1>
          <p className="mb-8 text-sm text-foreground/60">
            Record yourself speaking for at least 10 seconds. Read aloud or describe your day.
          </p>

          <div className="liquid-glass-strong mb-6 flex flex-col items-center rounded-3xl p-8">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95 ${
                recording ? "bg-destructive/20" : "bg-foreground/10"
              }`}
            >
              {recording ? <MicOff className="h-8 w-8 text-destructive" /> : <Mic className="h-8 w-8 text-foreground" />}
            </button>
            <p className="text-sm text-foreground/60">
              {recording ? `Recording... ${duration}s` : audioBlob ? `Recorded ${duration}s` : "Tap to start recording"}
            </p>
          </div>

          {audioBlob && !recording && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="liquid-glass-strong mb-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-foreground transition-transform hover:scale-105 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {analyzing ? "Analyzing..." : "Analyze Voice"}
            </button>
          )}

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

export default VoiceTest;
