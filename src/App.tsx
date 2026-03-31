import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LangProvider } from "@/contexts/LangContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SpiralTest from "./pages/SpiralTest";
import VoiceTest from "./pages/VoiceTest";
import SymptomTest from "./pages/SymptomTest";
import TappingTest from "./pages/TappingTest";
import Learn from "./pages/Learn";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LangProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/test/spiral" element={<SpiralTest />} />
                <Route path="/test/voice" element={<VoiceTest />} />
                <Route path="/test/symptoms" element={<SymptomTest />} />
                <Route path="/test/tapping" element={<TappingTest />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/games" element={<Games />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
