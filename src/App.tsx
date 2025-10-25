import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen />} 
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Timeline />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/plants"
              element={
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
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
                isAuthenticated ? (
                  <Layout>
                    <Backup />
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
