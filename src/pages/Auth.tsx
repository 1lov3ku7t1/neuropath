import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { Brain, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password, fullName);
        toast({ title: t.createAccount, description: "Check your email to verify your account." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="liquid-glass-strong w-full max-w-md rounded-3xl p-8">
          <div className="mb-8 flex flex-col items-center">
            <Brain className="mb-4 h-12 w-12 text-foreground" />
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              {isLogin ? t.welcomeBack : t.createAccount}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {isLogin ? t.signInDesc : t.signUpDesc}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1 block text-xs text-foreground/60">{t.fullName}</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin}
                  className="liquid-glass w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/30 outline-none" placeholder="Dr. Jane Smith" />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs text-foreground/60">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="liquid-glass w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/30 outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-foreground/60">{t.password}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="liquid-glass w-full rounded-xl px-4 py-3 pr-10 text-sm text-foreground placeholder-foreground/30 outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="liquid-glass-strong w-full rounded-xl py-3 text-sm font-medium text-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
              {loading ? t.pleaseWait : isLogin ? t.signIn : t.createAccountBtn}
            </button>
          </form>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-foreground/10" />
            <span className="text-[10px] uppercase tracking-widest text-foreground/30">{t.or}</span>
            <span className="h-px flex-1 bg-foreground/10" />
          </div>
          <button onClick={() => navigate("/dashboard?guest=true")}
            className="liquid-glass mt-4 w-full rounded-xl py-3 text-sm text-foreground/70 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            {t.continueGuest}
          </button>
          <p className="mt-6 text-center text-xs text-foreground/50">
            {isLogin ? t.noAccount : t.haveAccount}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-foreground/80 underline underline-offset-2 transition-colors hover:text-foreground">
              {isLogin ? t.signUp : t.signIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
