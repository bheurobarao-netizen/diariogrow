import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import LoginScreen from "@/components/auth/LoginScreen";
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
import Equipment from "./pages/Equipment";
import NewEquipment from "./pages/NewEquipment";
import EditEquipment from "./pages/EditEquipment";
import Backup from "./pages/Backup";
import Calculators from "./pages/Calculators";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

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
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={!session ? <LoginScreen /> : <Navigate to="/" replace />} 
            />
            <Route
              path="/"
              element={
                session ? (
                  <Layout>
                    <Timeline />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                session ? (
                  <Layout>
                    <Profile />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/equipment"
              element={
                session ? (
                  <Layout>
                    <Equipment />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/equipment/new"
              element={
                session ? (
                  <Layout>
                    <NewEquipment />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/equipment/edit/:id"
              element={
                session ? (
                  <Layout>
                    <EditEquipment />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
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
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/backup"
              element={
                session ? (
                  <Layout>
                    <Backup />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/calculators"
              element={
                session ? (
                  <Layout>
                    <Calculators />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
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
