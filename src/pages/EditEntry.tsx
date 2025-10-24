import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { useInsumoStore } from '@/stores/insumoStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Leaf, Plus, X } from 'lucide-react';
import { PhaseSelector } from '@/components/plants/PhaseSelector';
import { PlantPhase } from '@/lib/phases';
import FileUploader from '@/components/ui/file-uploader';

const EditEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, updateEntry } = useEntryStore();
  const { plants, fetchPlants } = usePlantStore();
  const { tents, fetchTents } = useTentStore();
  const { insumos, fetchInsumos } = useInsumoStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    plantId: undefined as number | undefined,
    plantIds: [] as number[],
    tentId: undefined as number | undefined,
    fase: undefined as PlantPhase | undefined,
    
    // Ambiente
    temperaturaMin: undefined as number | undefined,
    temperaturaMax: undefined as number | undefined,
    umidadeMin: undefined as number | undefined,
    umidadeMax: undefined as number | undefined,
    distanciaLuzCm: undefined as number | undefined,
    
    // Solução Nutritiva
    phAguaEntrada: undefined as number | undefined,
    ecAguaEntrada: undefined as number | undefined,
    volumeTotalLitros: undefined as number | undefined,
    phAguaSaida: undefined as number | undefined,
    ecAguaSaida: undefined as number | undefined,
    
    // Nutrientes aplicados
    nutrientesAplicados: [] as Array<{
      nomeNutriente: string;
      quantidade: number;
      unidade: 'g' | 'ml';
    }>,
    
    // Ações e Saúde
    acoesRealizadas: [] as string[],
    problemasObservados: [] as string[],
    acoesCorretivas: [] as string[],
    
    // Mídia e observações
    content: '',
    photos: [] as string[],
    videos: [] as string[],
  });
  
  const [newNutriente, setNewNutriente] = useState({ nome: '', quantidade: '', unidade: 'g' as 'g' | 'ml' });
  const [newAcao, setNewAcao] = useState('');
  const [newProblema, setNewProblema] = useState('');
  const [newCorretiva, setNewCorretiva] = useState('');
  
  useEffect(() => {
    fetchPlants();
    fetchTents();
    fetchInsumos();
  }, [fetchPlants, fetchTents, fetchInsumos]);
  
  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;
      
      try {
        const entry = await getEntry(Number(id));
        if (!entry) {
          toast({
            title: 'Erro',
            description: 'Entrada não encontrada',
            variant: 'destructive',
          });
          navigate('/timeline');
          return;
        }
        
        setFormData({
          date: entry.date,
          plantId: entry.plantId,
          plantIds: entry.plantIds || (entry.plantId ? [entry.plantId] : []),
          tentId: entry.tentId,
          fase: entry.fase,
          temperaturaMin: entry.temperaturaMin,
          temperaturaMax: entry.temperaturaMax,
          umidadeMin: entry.umidadeMin,
          umidadeMax: entry.umidadeMax,
          distanciaLuzCm: entry.distanciaLuzCm,
          phAguaEntrada: entry.phAguaEntrada,
          ecAguaEntrada: entry.ecAguaEntrada,
          volumeTotalLitros: entry.volumeTotalLitros,
          phAguaSaida: entry.phAguaSaida,
          ecAguaSaida: entry.ecAguaSaida,
          nutrientesAplicados: entry.nutrientesAplicados || [],
          acoesRealizadas: entry.acoesRealizadas || [],
          problemasObservados: entry.problemasObservados || [],
          acoesCorretivas: entry.acoesCorretivas || [],
          content: entry.content || '',
          photos: entry.photos || [],
          videos: entry.videos || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading entry:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a entrada',
          variant: 'destructive',
        });
        navigate('/timeline');
      }
    };
    
    loadEntry();
  }, [id, getEntry, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updateEntry(Number(id), {
        date: formData.date,
        plantId: formData.plantIds.length > 0 ? formData.plantIds[0] : undefined,
        plantIds: formData.plantIds,
        tentId: formData.tentId,
        fase: formData.fase,
        temperaturaMin: formData.temperaturaMin,
        temperaturaMax: formData.temperaturaMax,
        umidadeMin: formData.umidadeMin,
        umidadeMax: formData.umidadeMax,
        distanciaLuzCm: formData.distanciaLuzCm,
        phAguaEntrada: formData.phAguaEntrada,
        ecAguaEntrada: formData.ecAguaEntrada,
        volumeTotalLitros: formData.volumeTotalLitros,
        phAguaSaida: formData.phAguaSaida,
        ecAguaSaida: formData.ecAguaSaida,
        nutrientesAplicados: formData.nutrientesAplicados,
        acoesRealizadas: formData.acoesRealizadas,
        problemasObservados: formData.problemasObservados,
        acoesCorretivas: formData.acoesCorretivas,
        content: formData.content,
        photos: formData.photos,
        videos: formData.videos,
      });
      
      toast({
        title: 'Entrada atualizada!',
        description: 'Registro salvo com sucesso',
      });
      
      navigate(`/entry/${id}`);
    } catch (error) {
      console.error('Error updating entry:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a entrada',
        variant: 'destructive',
      });
    }
  };
  
  const handleMediaUpload = (urls: string[]) => {
    // Remove query parameters from URL before checking extension
    const getPathWithoutQuery = (url: string) => url.split('?')[0];
    
    const photos = urls.filter((url) => {
      const path = getPathWithoutQuery(url).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some((ext) =>
        path.endsWith(ext)
      );
    });
    
    const videos = urls.filter((url) => {
      const path = getPathWithoutQuery(url).toLowerCase();
      return ['.mp4', '.mov', '.avi', '.webm', '.mkv'].some((ext) =>
        path.endsWith(ext)
      );
    });

    setFormData((prev) => ({
      ...prev,
      photos,
      videos,
    }));
  };
  
  const addNutriente = () => {
    if (newNutriente.nome && newNutriente.quantidade) {
      setFormData({
        ...formData,
        nutrientesAplicados: [
          ...formData.nutrientesAplicados,
          {
            nomeNutriente: newNutriente.nome,
            quantidade: Number(newNutriente.quantidade),
            unidade: newNutriente.unidade,
          },
        ],
      });
      setNewNutriente({ nome: '', quantidade: '', unidade: 'g' });
    }
  };
  
  const removeNutriente = (index: number) => {
    setFormData({
      ...formData,
      nutrientesAplicados: formData.nutrientesAplicados.filter((_, i) => i !== index),
    });
  };
  
  const addTag = (field: 'acoesRealizadas' | 'problemasObservados' | 'acoesCorretivas', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
    }
  };
  
  const removeTag = (field: 'acoesRealizadas' | 'problemasObservados' | 'acoesCorretivas', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            Editar Entrada
          </h1>
          <p className="text-muted-foreground mt-1">Atualize o registro do diário</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Plantas (selecione uma ou mais)</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-background">
                {plants
                  .filter((p) => p.viva)
                  .map((plant) => (
                    <div key={plant.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plant-${plant.id}`}
                        checked={formData.plantIds.includes(plant.id!)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              plantIds: [...formData.plantIds, plant.id!],
                              plantId: plant.id
                            });
                          } else {
                            setFormData({
                              ...formData,
                              plantIds: formData.plantIds.filter(id => id !== plant.id),
                              plantId: formData.plantIds.find(id => id !== plant.id)
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={`plant-${plant.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {plant.apelido} ({plant.codigo})
                      </label>
                    </div>
                  ))}
                {plants.filter((p) => p.viva).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Nenhuma planta ativa encontrada
                  </p>
                )}
              </div>
              {formData.plantIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.plantIds.length} planta(s) selecionada(s)
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tent">Tenda</Label>
            <Select
              value={formData.tentId?.toString()}
              onValueChange={(value) => setFormData({ ...formData, tentId: value ? Number(value) : undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tenda" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {tents.map((tent) => (
                  <SelectItem key={tent.id} value={tent.id!.toString()}>
                    {tent.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <PhaseSelector
            phase={formData.fase}
            method=""
            onPhaseChange={(phase) => setFormData({ ...formData, fase: phase })}
            onMethodChange={() => {}}
          />
          
          {/* Environment Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ambiente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tempMin">Temperatura Mín (°C)</Label>
                <Input
                  id="tempMin"
                  type="number"
                  step="0.1"
                  value={formData.temperaturaMin || ''}
                  onChange={(e) => setFormData({ ...formData, temperaturaMin: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempMax">Temperatura Máx (°C)</Label>
                <Input
                  id="tempMax"
                  type="number"
                  step="0.1"
                  value={formData.temperaturaMax || ''}
                  onChange={(e) => setFormData({ ...formData, temperaturaMax: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="umidMin">Umidade Mín (%)</Label>
                <Input
                  id="umidMin"
                  type="number"
                  value={formData.umidadeMin || ''}
                  onChange={(e) => setFormData({ ...formData, umidadeMin: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="umidMax">Umidade Máx (%)</Label>
                <Input
                  id="umidMax"
                  type="number"
                  value={formData.umidadeMax || ''}
                  onChange={(e) => setFormData({ ...formData, umidadeMax: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distLuz">Distância Luz (cm)</Label>
                <Input
                  id="distLuz"
                  type="number"
                  value={formData.distanciaLuzCm || ''}
                  onChange={(e) => setFormData({ ...formData, distanciaLuzCm: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
          
          {/* Nutrient Solution Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Solução Nutritiva</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volumeTotal">Volume Total (L)</Label>
                <Input
                  id="volumeTotal"
                  type="number"
                  step="0.1"
                  value={formData.volumeTotalLitros || ''}
                  onChange={(e) => setFormData({ ...formData, volumeTotalLitros: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phEntrada">pH Entrada</Label>
                <Input
                  id="phEntrada"
                  type="number"
                  step="0.1"
                  value={formData.phAguaEntrada || ''}
                  onChange={(e) => setFormData({ ...formData, phAguaEntrada: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecEntrada">EC Entrada</Label>
                <Input
                  id="ecEntrada"
                  type="number"
                  step="0.1"
                  value={formData.ecAguaEntrada || ''}
                  onChange={(e) => setFormData({ ...formData, ecAguaEntrada: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phSaida">pH Saída (Runoff)</Label>
                <Input
                  id="phSaida"
                  type="number"
                  step="0.1"
                  value={formData.phAguaSaida || ''}
                  onChange={(e) => setFormData({ ...formData, phAguaSaida: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecSaida">EC Saída (Runoff)</Label>
                <Input
                  id="ecSaida"
                  type="number"
                  step="0.1"
                  value={formData.ecAguaSaida || ''}
                  onChange={(e) => setFormData({ ...formData, ecAguaSaida: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
          
          {/* Applied Nutrients Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nutrientes Aplicados</h3>
            
            {formData.nutrientesAplicados.length > 0 && (
              <div className="space-y-2">
                {formData.nutrientesAplicados.map((nutriente, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">{nutriente.nomeNutriente}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {nutriente.quantidade} {nutriente.unidade}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNutriente(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Input
                  list="insumos-list"
                  placeholder="Nome do produto"
                  value={newNutriente.nome}
                  onChange={(e) => setNewNutriente({ ...newNutriente, nome: e.target.value })}
                />
                <datalist id="insumos-list">
                  {insumos.filter(i => i.tipo === 'nutriente' || i.tipo === 'suplemento').map((insumo) => (
                    <option key={insumo.id} value={insumo.nomeProduto} />
                  ))}
                </datalist>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Qtd"
                  value={newNutriente.quantidade}
                  onChange={(e) => setNewNutriente({ ...newNutriente, quantidade: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={newNutriente.unidade}
                  onValueChange={(value: 'g' | 'ml') => setNewNutriente({ ...newNutriente, unidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Button type="button" onClick={addNutriente} size="sm" className="w-full">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Actions & Health Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ações e Saúde</h3>
            
            <div className="space-y-2">
              <Label>Ações Realizadas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.acoesRealizadas.map((acao, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1"
                  >
                    {acao}
                    <button
                      type="button"
                      onClick={() => removeTag('acoesRealizadas', index)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Poda Top, LST, Transplante"
                  value={newAcao}
                  onChange={(e) => setNewAcao(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('acoesRealizadas', newAcao);
                      setNewAcao('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addTag('acoesRealizadas', newAcao);
                    setNewAcao('');
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Problemas Observados</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.problemasObservados.map((problema, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm flex items-center gap-1"
                  >
                    {problema}
                    <button
                      type="button"
                      onClick={() => removeTag('problemasObservados', index)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Spider Mites, Oídio"
                  value={newProblema}
                  onChange={(e) => setNewProblema(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('problemasObservados', newProblema);
                      setNewProblema('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addTag('problemasObservados', newProblema);
                    setNewProblema('');
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Ações Corretivas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.acoesCorretivas.map((acao, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm flex items-center gap-1"
                  >
                    {acao}
                    <button
                      type="button"
                      onClick={() => removeTag('acoesCorretivas', index)}
                      className="hover:bg-green-500/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Apliquei Óleo de Neem"
                  value={newCorretiva}
                  onChange={(e) => setNewCorretiva(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('acoesCorretivas', newCorretiva);
                      setNewCorretiva('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addTag('acoesCorretivas', newCorretiva);
                    setNewCorretiva('');
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mídia</h3>
            <FileUploader
              onFilesUploaded={handleMediaUpload}
              accept="image/*,video/*"
              maxFiles={10}
              existingFiles={[...formData.photos, ...formData.videos]}
            />
          </div>
          
          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="content">Observações Gerais</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Anotações sobre o dia..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditEntry;
