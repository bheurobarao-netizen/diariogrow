import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { useInsumoStore } from '@/stores/insumoStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { PlantPhase } from '@/lib/db';
import { getPhaseLabel } from '@/lib/phases';
import FileUploader from '@/components/ui/file-uploader';

const NewEntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlantId = searchParams.get('plantId');
  
  const { createEntry } = useEntryStore();
  const { plants, fetchPlants } = usePlantStore();
  const { tents, fetchTents } = useTentStore();
  const { insumos, fetchInsumos } = useInsumoStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    plantId: preselectedPlantId ? Number(preselectedPlantId) : undefined,
    tentId: undefined as number | undefined,
    fase: '' as PlantPhase | '',
    content: '',
    photos: [] as string[],
    videos: [] as string[],
    
    // Ambiente
    temperaturaMin: '',
    temperaturaMax: '',
    umidadeMin: '',
    umidadeMax: '',
    distanciaLuzCm: '',
    
    // Solução Nutritiva
    phAguaEntrada: '',
    ecAguaEntrada: '',
    volumeTotalLitros: '',
    phAguaSaida: '',
    ecAguaSaida: '',
    
    // Nutrientes
    nutrientesAplicados: [] as Array<{ nomeNutriente: string; quantidade: number; unidade: 'g' | 'ml' }>,
    
    // Ações e Saúde
    acoesRealizadas: [] as string[],
    problemasObservados: [] as string[],
    acoesCorretivas: [] as string[],
  });

  const [newAcao, setNewAcao] = useState('');
  const [newProblema, setNewProblema] = useState('');
  const [newCorretiva, setNewCorretiva] = useState('');

  useEffect(() => {
    fetchPlants();
    fetchTents();
    fetchInsumos();
  }, [fetchPlants, fetchTents, fetchInsumos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.plantId) {
      toast({
        title: 'Erro',
        description: 'Selecione uma planta',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createEntry({
        date: formData.date,
        plantId: formData.plantId,
        tentId: formData.tentId,
        fase: formData.fase || undefined,
        content: formData.content,
        photos: formData.photos,
        videos: formData.videos,
        
        temperaturaMin: formData.temperaturaMin ? parseFloat(formData.temperaturaMin) : undefined,
        temperaturaMax: formData.temperaturaMax ? parseFloat(formData.temperaturaMax) : undefined,
        umidadeMin: formData.umidadeMin ? parseFloat(formData.umidadeMin) : undefined,
        umidadeMax: formData.umidadeMax ? parseFloat(formData.umidadeMax) : undefined,
        distanciaLuzCm: formData.distanciaLuzCm ? parseFloat(formData.distanciaLuzCm) : undefined,
        
        phAguaEntrada: formData.phAguaEntrada ? parseFloat(formData.phAguaEntrada) : undefined,
        ecAguaEntrada: formData.ecAguaEntrada ? parseFloat(formData.ecAguaEntrada) : undefined,
        volumeTotalLitros: formData.volumeTotalLitros ? parseFloat(formData.volumeTotalLitros) : undefined,
        phAguaSaida: formData.phAguaSaida ? parseFloat(formData.phAguaSaida) : undefined,
        ecAguaSaida: formData.ecAguaSaida ? parseFloat(formData.ecAguaSaida) : undefined,
        
        nutrientesAplicados: formData.nutrientesAplicados,
        acoesRealizadas: formData.acoesRealizadas,
        problemasObservados: formData.problemasObservados,
        acoesCorretivas: formData.acoesCorretivas,
      });

      toast({
        title: 'Sucesso',
        description: 'Registro criado com sucesso!',
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating entry:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o registro',
        variant: 'destructive',
      });
    }
  };

  const handleMediaUpload = (urls: string[]) => {
    const photos = urls.filter((url) =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some((ext) =>
        url.toLowerCase().endsWith(ext)
      )
    );
    const videos = urls.filter((url) =>
      ['.mp4', '.mov', '.avi', '.webm', '.mkv'].some((ext) =>
        url.toLowerCase().endsWith(ext)
      )
    );

    setFormData((prev) => ({
      ...prev,
      photos,
      videos,
    }));
  };

  const addNutriente = () => {
    setFormData((prev) => ({
      ...prev,
      nutrientesAplicados: [
        ...prev.nutrientesAplicados,
        { nomeNutriente: '', quantidade: 0, unidade: 'ml' as 'ml' | 'g' },
      ],
    }));
  };

  const removeNutriente = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nutrientesAplicados: prev.nutrientesAplicados.filter((_, i) => i !== index),
    }));
  };

  const updateNutriente = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      nutrientesAplicados: prev.nutrientesAplicados.map((n, i) =>
        i === index ? { ...n, [field]: value } : n
      ),
    }));
  };

  const phases: PlantPhase[] = [
    'germinacao_1',
    'germinacao_2',
    'germinacao_3',
    'muda',
    'vegetativo',
    'floracao',
    'flush',
    'secagem',
    'cura',
    'colhida',
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-primary">Nova Entrada no Diário</h1>
        <p className="text-muted-foreground mt-1">
          Documente o progresso das suas plantas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plant">Planta *</Label>
                <Select
                  value={formData.plantId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, plantId: Number(value) })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma planta" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {plants
                      .filter((p) => p.viva)
                      .map((plant) => (
                        <SelectItem key={plant.id} value={plant.id!.toString()}>
                          {plant.apelido} ({plant.codigo})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tent">Tenda</Label>
                <Select
                  value={formData.tentId?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tentId: value ? Number(value) : undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tenda" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="">Nenhuma</SelectItem>
                    {tents.map((tent) => (
                      <SelectItem key={tent.id} value={tent.id!.toString()}>
                        {tent.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fase">Fase</Label>
                <Select
                  value={formData.fase}
                  onValueChange={(value) => setFormData({ ...formData, fase: value as PlantPhase })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fase" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {getPhaseLabel(phase)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Ambiente */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Condições Ambientais</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempMin">Temp. Mín (°C)</Label>
              <Input
                id="tempMin"
                type="number"
                step="0.1"
                value={formData.temperaturaMin}
                onChange={(e) => setFormData({ ...formData, temperaturaMin: e.target.value })}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempMax">Temp. Máx (°C)</Label>
              <Input
                id="tempMax"
                type="number"
                step="0.1"
                value={formData.temperaturaMax}
                onChange={(e) => setFormData({ ...formData, temperaturaMax: e.target.value })}
                placeholder="28"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="umidMin">Umid. Mín (%)</Label>
              <Input
                id="umidMin"
                type="number"
                step="0.1"
                value={formData.umidadeMin}
                onChange={(e) => setFormData({ ...formData, umidadeMin: e.target.value })}
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="umidMax">Umid. Máx (%)</Label>
              <Input
                id="umidMax"
                type="number"
                step="0.1"
                value={formData.umidadeMax}
                onChange={(e) => setFormData({ ...formData, umidadeMax: e.target.value })}
                placeholder="70"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="distLuz">Distância da Luz (cm)</Label>
              <Input
                id="distLuz"
                type="number"
                step="1"
                value={formData.distanciaLuzCm}
                onChange={(e) => setFormData({ ...formData, distanciaLuzCm: e.target.value })}
                placeholder="40"
              />
            </div>
          </div>
        </Card>

        {/* Solução Nutritiva */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Solução Nutritiva (Reservatório)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phEntrada">pH Entrada</Label>
              <Input
                id="phEntrada"
                type="number"
                step="0.1"
                value={formData.phAguaEntrada}
                onChange={(e) => setFormData({ ...formData, phAguaEntrada: e.target.value })}
                placeholder="6.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecEntrada">EC Entrada (mS/cm)</Label>
              <Input
                id="ecEntrada"
                type="number"
                step="0.1"
                value={formData.ecAguaEntrada}
                onChange={(e) => setFormData({ ...formData, ecAguaEntrada: e.target.value })}
                placeholder="1.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume Total (L)</Label>
              <Input
                id="volume"
                type="number"
                step="0.1"
                value={formData.volumeTotalLitros}
                onChange={(e) => setFormData({ ...formData, volumeTotalLitros: e.target.value })}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phSaida">pH Saída (Runoff)</Label>
              <Input
                id="phSaida"
                type="number"
                step="0.1"
                value={formData.phAguaSaida}
                onChange={(e) => setFormData({ ...formData, phAguaSaida: e.target.value })}
                placeholder="6.2"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ecSaida">EC Saída (Runoff) (mS/cm)</Label>
              <Input
                id="ecSaida"
                type="number"
                step="0.1"
                value={formData.ecAguaSaida}
                onChange={(e) => setFormData({ ...formData, ecAguaSaida: e.target.value })}
                placeholder="1.8"
              />
            </div>
          </div>
        </Card>

        {/* Nutrientes Aplicados */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Nutrientes Aplicados</h2>
            <Button type="button" variant="outline" size="sm" onClick={addNutriente} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-3">
            {formData.nutrientesAplicados.map((nutriente, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-2">
                  <Label className="text-xs">Produto</Label>
                  <Input
                    value={nutriente.nomeNutriente}
                    onChange={(e) => updateNutriente(index, 'nomeNutriente', e.target.value)}
                    placeholder="Ex: Nitrato de Cálcio"
                    list={`insumos-${index}`}
                  />
                  <datalist id={`insumos-${index}`}>
                    {insumos.filter(i => i.tipo === 'nutriente').map((insumo) => (
                      <option key={insumo.id} value={insumo.nomeProduto} />
                    ))}
                  </datalist>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Quantidade</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={nutriente.quantidade}
                    onChange={(e) => updateNutriente(index, 'quantidade', parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Unidade</Label>
                  <Select
                    value={nutriente.unidade}
                    onValueChange={(value) => updateNutriente(index, 'unidade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNutriente(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {formData.nutrientesAplicados.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum nutriente adicionado
              </p>
            )}
          </div>
        </Card>

        {/* Ações e Saúde */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ações e Observações de Saúde</h2>
          <div className="space-y-4">
            {/* Ações Realizadas */}
            <div className="space-y-2">
              <Label>Ações Realizadas</Label>
              <div className="flex gap-2">
                <Input
                  value={newAcao}
                  onChange={(e) => setNewAcao(e.target.value)}
                  placeholder="Ex: Poda Top, LST, Desfoliação..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newAcao.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          acoesRealizadas: [...prev.acoesRealizadas, newAcao.trim()]
                        }));
                        setNewAcao('');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newAcao.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        acoesRealizadas: [...prev.acoesRealizadas, newAcao.trim()]
                      }));
                      setNewAcao('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.acoesRealizadas.map((acao, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {acao}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          acoesRealizadas: prev.acoesRealizadas.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Problemas Observados */}
            <div className="space-y-2">
              <Label>Problemas Observados</Label>
              <div className="flex gap-2">
                <Input
                  value={newProblema}
                  onChange={(e) => setNewProblema(e.target.value)}
                  placeholder="Ex: Spider Mites, Oídio, Deficiência de N..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newProblema.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          problemasObservados: [...prev.problemasObservados, newProblema.trim()]
                        }));
                        setNewProblema('');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newProblema.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        problemasObservados: [...prev.problemasObservados, newProblema.trim()]
                      }));
                      setNewProblema('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.problemasObservados.map((problema, index) => (
                  <Badge key={index} variant="destructive" className="gap-2">
                    {problema}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          problemasObservados: prev.problemasObservados.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-xs hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ações Corretivas */}
            <div className="space-y-2">
              <Label>Ações Corretivas</Label>
              <div className="flex gap-2">
                <Input
                  value={newCorretiva}
                  onChange={(e) => setNewCorretiva(e.target.value)}
                  placeholder="Ex: Apliquei Óleo de Neem, Ajustei pH..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCorretiva.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          acoesCorretivas: [...prev.acoesCorretivas, newCorretiva.trim()]
                        }));
                        setNewCorretiva('');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newCorretiva.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        acoesCorretivas: [...prev.acoesCorretivas, newCorretiva.trim()]
                      }));
                      setNewCorretiva('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.acoesCorretivas.map((corretiva, index) => (
                  <Badge key={index} variant="outline" className="gap-2">
                    {corretiva}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          acoesCorretivas: prev.acoesCorretivas.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Mídia */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Fotos e Vídeos do Dia</h2>
          <FileUploader
            onFilesUploaded={handleMediaUpload}
            accept="image/*,video/*"
            maxFiles={10}
            existingFiles={[...formData.photos, ...formData.videos]}
          />
        </Card>

        {/* Observações Gerais */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Observações Gerais</h2>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Anotações adicionais sobre o dia..."
            rows={4}
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="gradient" className="flex-1 gap-2">
            <Save className="w-4 h-4" />
            Salvar Registro
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEntry;
