import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Auth from "./pages/Auth";
import Layout from "@/components/Layout";
import Timeline from "./pages/Timeline";
import Plants from "./pages/Plants";
import PlantDetail from "./pages/PlantDetail";
import NewPlant from "./pages/NewPlant";
import EditPlant from "./pages/EditPlant";
import NewEntry from "./pages/NewEntry";
import Tents from "./pages/Tents";
import NewTent from "./pages/NewTent";
import EditTent from "./pages/EditTent";
import Lineage from "./pages/Lineage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/auth" 
              element={session ? <Navigate to="/" replace /> : <Auth />} 
            />
            <Route
              path="/"
              element={
                session ? (
                  <Layout>
                    <Timeline />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/plants"
              element={
                session ? (
                  <Layout>
                    <Plants />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/plants/:id"
              element={
                session ? (
                  <Layout>
                    <PlantDetail />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/plants/new"
              element={
                session ? (
                  <Layout>
                    <NewPlant />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/plants/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditPlant />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/calendar"
              element={
                session ? (
                  <Layout>
                    <div className="p-4">Calendário (em breve)</div>
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/new"
              element={
                session ? (
                  <Layout>
                    <NewEntry />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/tents"
              element={
                session ? (
                  <Layout>
                    <Tents />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/tents/new"
              element={
                session ? (
                  <Layout>
                    <NewTent />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/tents/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditTent />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/lineage"
              element={
                session ? (
                  <Layout>
                    <Lineage />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/gallery"
              element={
                session ? (
                  <Layout>
                    <div className="p-4">Galeria (em breve)</div>
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/stats"
              element={
                session ? (
                  <Layout>
                    <div className="p-4">Estatísticas (em breve)</div>
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
