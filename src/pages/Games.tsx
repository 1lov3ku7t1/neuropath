import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import SettingsMenu from "@/components/SettingsMenu";
import { Brain, Menu, ArrowLeft, Zap, Grid3X3, Move, RotateCcw } from "lucide-react";

type GameTab = "reaction" | "memory" | "balance";

/* ---------- Reaction Time ---------- */
const ReactionGame = () => {
  const { t } = useLang();
  const [phase, setPhase] = useState<"idle" | "wait" | "go" | "done" | "early">("idle");
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    setPhase("wait");
    const delay = 2000 + Math.random() * 4000;
    timerRef.current = setTimeout(() => {
      setPhase("go");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (phase === "idle" || phase === "done" || phase === "early") { start(); return; }
    if (phase === "wait") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const ms = Date.now() - startTime;
      setResult(ms);
      setResults((p) => [...p, ms]);
      setPhase("done");
    }
  };

  const avg = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;

  const bgColor =
    phase === "wait" ? "bg-red-500/20" :
    phase === "go" ? "bg-green-500/20" :
    phase === "early" ? "bg-yellow-500/20" :
    "bg-foreground/5";

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleClick}
        className={`liquid-glass flex h-52 w-full max-w-md flex-col items-center justify-center rounded-3xl transition-all ${bgColor}`}
      >
        {phase === "idle" && <><Zap className="mb-3 h-8 w-8 text-foreground/60" /><span className="text-sm text-foreground/80">{t.reactionTap}</span></>}
        {phase === "wait" && <span className="text-lg font-medium text-red-400">{t.reactionWait}</span>}
        {phase === "go" && <span className="text-lg font-medium text-green-400">{t.reactionNow}</span>}
        {phase === "early" && <><span className="text-lg font-medium text-yellow-400">{t.reactionEarly}</span><span className="mt-2 text-xs text-foreground/60">{t.reactionTapAgain}</span></>}
        {phase === "done" && <><span className="text-3xl font-bold text-foreground">{result}ms</span><span className="mt-2 text-xs text-foreground/60">{t.reactionTapAgain}</span></>}
      </button>
      {results.length > 0 && (
        <div className="liquid-glass rounded-2xl p-4 text-center">
          <p className="text-xs text-foreground/50">{t.reactionAvg}: <span className="font-medium text-foreground">{avg}ms</span> ({results.length} {t.reactionTrials})</p>
          <p className="mt-1 text-xs text-foreground/40">{avg < 250 ? t.reactionGood : avg < 400 ? t.reactionNormal : t.reactionSlow}</p>
        </div>
      )}
    </div>
  );
};

/* ---------- Memory Sequence ---------- */
const MemoryGame = () => {
  const { t } = useLang();
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "correct" | "wrong">("idle");
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [level, setLevel] = useState(0);

  const colors = ["bg-blue-500/60", "bg-red-500/60", "bg-green-500/60", "bg-yellow-500/60"];

  const startGame = useCallback(() => {
    const first = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setSequence(first);
    setLevel(1);
    setUserInput([]);
    showSequence(first);
  }, []);

  const showSequence = (seq: number[]) => {
    setPhase("showing");
    seq.forEach((cell, i) => {
      setTimeout(() => setActiveCell(cell), (i + 1) * 600);
      setTimeout(() => setActiveCell(null), (i + 1) * 600 + 400);
    });
    setTimeout(() => { setPhase("input"); setUserInput([]); }, (seq.length + 1) * 600);
  };

  const handleCellClick = (idx: number) => {
    if (phase !== "input") return;
    const newInput = [...userInput, idx];
    setUserInput(newInput);
    setActiveCell(idx);
    setTimeout(() => setActiveCell(null), 200);

    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setPhase("wrong");
      return;
    }
    if (newInput.length === sequence.length) {
      setPhase("correct");
      setTimeout(() => {
        const next = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(next);
        setLevel((l) => l + 1);
        showSequence(next);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === "idle" ? (
        <button onClick={startGame} className="liquid-glass-strong flex h-52 w-full max-w-md flex-col items-center justify-center rounded-3xl transition-transform hover:scale-105">
          <Grid3X3 className="mb-3 h-8 w-8 text-foreground/60" />
          <span className="text-sm text-foreground/80">{t.memoryStart}</span>
        </button>
      ) : (
        <>
          <p className="text-xs text-foreground/50">{t.memoryLevel}: {level} | {t.memorySeqLen}: {sequence.length}</p>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`h-24 w-24 rounded-2xl transition-all ${
                  activeCell === idx ? colors[idx] + " scale-95" : "liquid-glass"
                } ${phase === "input" ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
              />
            ))}
          </div>
          {phase === "correct" && <p className="text-sm font-medium text-green-400">{t.memoryCorrect}</p>}
          {phase === "wrong" && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-red-400">{t.memoryWrong} — {t.memoryLevel} {level}</p>
              <p className="text-xs text-foreground/40">{level >= 5 ? t.memoryGood : level >= 3 ? t.memoryNormal : t.memoryLow}</p>
              <button onClick={startGame} className="liquid-glass mt-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground hover:scale-105">
                <RotateCcw className="h-3 w-3" /> {t.tryAgain}
              </button>
            </div>
          )}
          {phase === "showing" && <p className="text-xs text-foreground/50">{t.memoryWatch}</p>}
          {phase === "input" && <p className="text-xs text-foreground/50">{t.memoryRepeat}</p>}
        </>
      )}
    </div>
  );
};

/* ---------- Balance / Steadiness ---------- */
const BalanceGame = () => {
  const { t } = useLang();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [motionData, setMotionData] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [supported, setSupported] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (!window.DeviceMotionEvent) { setSupported(false); return; }
    setMotionData([]);
    setPhase("running");

    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (a) {
        const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
        setMotionData((p) => [...p, Math.abs(mag - 9.81)]);
      }
    };
    window.addEventListener("devicemotion", handler);

    setTimeout(() => {
      window.removeEventListener("devicemotion", handler);
      setPhase("done");
    }, 10000);
  };

  useEffect(() => {
    if (phase === "done" && motionData.length > 0) {
      const avg = motionData.reduce((a, b) => a + b, 0) / motionData.length;
      setScore(Math.round(avg * 100) / 100);
    }
  }, [phase, motionData]);

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="liquid-glass rounded-2xl p-6 text-center">
          <Move className="mx-auto mb-3 h-8 w-8 text-foreground/40" />
          <p className="text-sm text-foreground/60">{t.balanceNotSupported}</p>
          <p className="mt-2 text-xs text-foreground/40">{t.balanceDesktop}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === "idle" && (
        <button onClick={start} className="liquid-glass-strong flex h-52 w-full max-w-md flex-col items-center justify-center rounded-3xl transition-transform hover:scale-105">
          <Move className="mb-3 h-8 w-8 text-foreground/60" />
          <span className="text-sm text-foreground/80">{t.balanceStart}</span>
          <span className="mt-1 text-xs text-foreground/40">{t.balanceHold}</span>
        </button>
      )}
      {phase === "running" && (
        <div className="liquid-glass flex h-52 w-full max-w-md flex-col items-center justify-center rounded-3xl">
          <div className="h-16 w-16 animate-pulse rounded-full bg-green-500/30" />
          <p className="mt-4 text-sm text-foreground/80">{t.balanceHolding}</p>
          <p className="text-xs text-foreground/40">{t.balanceKeep}</p>
        </div>
      )}
      {phase === "done" && (
        <div className="flex flex-col items-center gap-3">
          <div className="liquid-glass rounded-2xl p-6 text-center">
            <p className="text-2xl font-bold text-foreground">{score}</p>
            <p className="text-xs text-foreground/50">{t.balanceScore}</p>
            <p className="mt-2 text-xs text-foreground/40">
              {motionData.length === 0 ? t.balanceNoData : score < 1 ? t.balanceSteady : score < 3 ? t.balanceModerate : t.balanceUnsteady}
            </p>
          </div>
          <button onClick={() => { setPhase("idle"); setMotionData([]); }} className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground hover:scale-105">
            <RotateCcw className="h-3 w-3" /> {t.tryAgain}
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Main ---------- */
const Games = () => {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<GameTab>("reaction");

  const tabs: { key: GameTab; label: string; icon: any }[] = [
    { key: "reaction", label: t.gameReaction, icon: Zap },
    { key: "memory", label: t.gameMemory, icon: Grid3X3 },
    { key: "balance", label: t.gameBalance, icon: Move },
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

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            {t.gamesTitle} <span className="font-serif italic text-foreground/80">{t.gamesSubtitle}</span>
          </h1>
          <p className="mb-8 text-sm text-foreground/60">{t.gamesIntro}</p>

          <div className="mb-8 flex gap-2">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform hover:scale-105 ${
                  tab === tb.key ? "liquid-glass-strong text-foreground" : "text-foreground/60"
                }`}
              >
                <tb.icon className="h-3.5 w-3.5" /> {tb.label}
              </button>
            ))}
          </div>

          {tab === "reaction" && <ReactionGame />}
          {tab === "memory" && <MemoryGame />}
          {tab === "balance" && <BalanceGame />}

          <p className="mt-8 text-center text-xs text-foreground/40">{t.disclaimer}</p>
        </div>
      </div>
      <SettingsMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Games;
