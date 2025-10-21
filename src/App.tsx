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
import Insumos from "./pages/Insumos";
import NewInsumo from "./pages/NewInsumo";
import EditInsumo from "./pages/EditInsumo";
import EntryDetail from "./pages/EntryDetail";
import EditEntry from "./pages/EditEntry";
import Colheitas from "./pages/Colheitas";
import NewColheita from "./pages/NewColheita";
import EditColheita from "./pages/EditColheita";
import Calendar from "./pages/Calendar";
import Stats from "./pages/Stats";
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
                    <Calendar />
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
              path="/insumos"
              element={
                session ? (
                  <Layout>
                    <Insumos />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/insumos/new"
              element={
                session ? (
                  <Layout>
                    <NewInsumo />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/insumos/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditInsumo />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/entry/:id"
              element={
                session ? (
                  <Layout>
                    <EntryDetail />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/entry/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditEntry />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/colheitas"
              element={
                session ? (
                  <Layout>
                    <Colheitas />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/colheitas/new"
              element={
                session ? (
                  <Layout>
                    <NewColheita />
                  </Layout>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/colheitas/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditColheita />
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
                    <Stats />
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
