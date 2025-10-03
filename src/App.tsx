import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import LoginScreen from "@/components/auth/LoginScreen";
import Layout from "@/components/Layout";
import Timeline from "./pages/Timeline";
import Plants from "./pages/Plants";
import NewPlant from "./pages/NewPlant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Timeline />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/plants/new" element={<NewPlant />} />
              <Route path="/calendar" element={<div className="p-4">Calendário (em breve)</div>} />
              <Route path="/new" element={<div className="p-4">Nova Entrada (em breve)</div>} />
              <Route path="/gallery" element={<div className="p-4">Galeria (em breve)</div>} />
              <Route path="/stats" element={<div className="p-4">Estatísticas (em breve)</div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
