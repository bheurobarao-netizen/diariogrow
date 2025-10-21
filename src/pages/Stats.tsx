import { useEffect, useState, useMemo } from 'react';
import { useEntryStore } from '@/stores/entryStore';
import { useColheitaStore } from '@/stores/colheitaStore';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Home, Leaf } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Stats = () => {
  const { entries, fetchEntries, loading: entriesLoading } = useEntryStore();
  const { colheitas, fetchColheitas, loading: colheitasLoading } = useColheitaStore();
  const { plants, fetchPlants, loading: plantsLoading } = usePlantStore();
  const { tents, fetchTents, loading: tentsLoading } = useTentStore();
  
  const [selectedPlantId, setSelectedPlantId] = useState<string>('all');

  useEffect(() => {
    fetchEntries();
    fetchColheitas();
    fetchPlants();
    fetchTents();
  }, [fetchEntries, fetchColheitas, fetchPlants, fetchTents]);

  // Environmental data over time (temperature, humidity, pH, EC)
  const environmentalData = useMemo(() => {
    const filteredEntries = selectedPlantId === 'all' 
      ? entries 
      : entries.filter(e => e.plantId === Number(selectedPlantId));

    return filteredEntries
      .filter(e => e.temperaturaMin || e.umidadeMin || e.phAguaSaida || e.ecAguaSaida)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: format(parseISO(entry.date), 'dd/MM', { locale: ptBR }),
        temperatura: entry.temperaturaMax || entry.temperaturaMin || null,
        umidade: entry.umidadeMax || entry.umidadeMin || null,
        ph: entry.phAguaSaida || null,
        ec: entry.ecAguaSaida || null,
      }));
  }, [entries, selectedPlantId]);

  // Harvest yield by plant
  const harvestByPlant = useMemo(() => {
    return colheitas
      .filter(c => c.pesoSecoFinal)
      .map(colheita => {
        const plant = plants.find(p => p.id === colheita.plantId);
        return {
          nome: plant ? `${plant.apelido} (${plant.codigo})` : 'Desconhecida',
          pesoSeco: colheita.pesoSecoFinal || 0,
          especie: plant?.especie || 'N/A',
        };
      })
      .sort((a, b) => b.pesoSeco - a.pesoSeco);
  }, [colheitas, plants]);

  // Yield by tent
  const yieldByTent = useMemo(() => {
    const tentYields: Record<number, { nome: string; total: number; count: number }> = {};

    colheitas.forEach(colheita => {
      const plant = plants.find(p => p.id === colheita.plantId);
      if (plant?.tentId && colheita.pesoSecoFinal) {
        if (!tentYields[plant.tentId]) {
          const tent = tents.find(t => t.id === plant.tentId);
          tentYields[plant.tentId] = {
            nome: tent?.nome || 'Tenda Desconhecida',
            total: 0,
            count: 0,
          };
        }
        tentYields[plant.tentId].total += colheita.pesoSecoFinal;
        tentYields[plant.tentId].count += 1;
      }
    });

    return Object.values(tentYields).map(tent => ({
      nome: tent.nome,
      rendimento: Math.round(tent.total),
      media: Math.round(tent.total / tent.count),
    }));
  }, [colheitas, plants, tents]);

  // Yield by genetics (species)
  const yieldByGenetics = useMemo(() => {
    const geneticsYields: Record<string, { total: number; count: number }> = {};

    colheitas.forEach(colheita => {
      const plant = plants.find(p => p.id === colheita.plantId);
      if (plant?.especie && colheita.pesoSecoFinal) {
        if (!geneticsYields[plant.especie]) {
          geneticsYields[plant.especie] = { total: 0, count: 0 };
        }
        geneticsYields[plant.especie].total += colheita.pesoSecoFinal;
        geneticsYields[plant.especie].count += 1;
      }
    });

    return Object.entries(geneticsYields)
      .map(([especie, data]) => ({
        especie,
        rendimentoTotal: Math.round(data.total),
        rendimentoMedio: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.rendimentoMedio - a.rendimentoMedio);
  }, [colheitas, plants]);

  const loading = entriesLoading || colheitasLoading || plantsLoading || tentsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Estatísticas e Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Análise de dados do seu cultivo</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Plantas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plants.filter(p => p.viva).length}</div>
            <p className="text-xs text-muted-foreground">Plantas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Colheitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colheitas.length}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rendimento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(colheitas.reduce((acc, c) => acc + (c.pesoSecoFinal || 0), 0))}g
            </div>
            <p className="text-xs text-muted-foreground">Peso seco</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">Registros</p>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Data Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Dados Ambientais ao Longo do Tempo
            </CardTitle>
            <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione a planta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plantas</SelectItem>
                {plants.map(plant => (
                  <SelectItem key={plant.id} value={plant.id!.toString()}>
                    {plant.apelido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {environmentalData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum dado ambiental registrado ainda
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={environmentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperatura"
                  stroke="hsl(var(--destructive))"
                  name="Temperatura (°C)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="umidade"
                  stroke="hsl(var(--primary))"
                  name="Umidade (%)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ph"
                  stroke="hsl(var(--secondary))"
                  name="pH"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ec"
                  stroke="hsl(var(--accent))"
                  name="EC"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Harvest Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Análise de Colheitas - Rendimento por Planta
          </CardTitle>
        </CardHeader>
        <CardContent>
          {harvestByPlant.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma colheita registrada ainda
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={harvestByPlant}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pesoSeco" fill="hsl(var(--primary))" name="Peso Seco (g)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Yield by Tent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Rendimento por Tenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {yieldByTent.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum dado de rendimento por tenda disponível
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldByTent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rendimento" fill="hsl(var(--primary))" name="Rendimento Total (g)" />
                <Bar dataKey="media" fill="hsl(var(--secondary))" name="Média por Planta (g)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Yield by Genetics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Rendimento por Genética
          </CardTitle>
        </CardHeader>
        <CardContent>
          {yieldByGenetics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum dado de rendimento por genética disponível
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldByGenetics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="especie" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="rendimentoTotal"
                  fill="hsl(var(--primary))"
                  name="Rendimento Total (g)"
                />
                <Bar
                  dataKey="rendimentoMedio"
                  fill="hsl(var(--accent))"
                  name="Rendimento Médio (g)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
