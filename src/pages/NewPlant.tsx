import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Leaf } from 'lucide-react';
import { PhaseSelector } from '@/components/plants/PhaseSelector';
import { PlantPhase } from '@/lib/phases';

const NewPlant = () => {
  const navigate = useNavigate();
  const { createPlant, getMotherPlants } = usePlantStore();
  const { tents, fetchTents } = useTentStore();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTents();
  }, [fetchTents]);
  
  const [formData, setFormData] = useState({
    apelido: '',
    especie: '',
    bancoSementes: '',
    origem: 'semente' as 'semente' | 'clone',
    maeId: undefined as number | undefined,
    indica: 50,
    sativa: 50,
    ruderalis: 0,
    fenotipoNotas: '',
    observacoes: '',
    faseAtual: undefined as PlantPhase | undefined,
    metodoAtual: '',
    seraMae: false,
    dataGerminacao: '',
    dataNascimento: '',
    tentId: undefined as number | undefined,
  });
  
  const [motherPlants, setMotherPlants] = useState<any[]>([]);
  
  useEffect(() => {
    const loadMotherPlants = async () => {
      const mothers = await getMotherPlants();
      setMotherPlants(mothers);
    };
    loadMotherPlants();
  }, [getMotherPlants]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.origem === 'clone' && !formData.maeId) {
      toast({
        title: 'Erro',
        description: 'Selecione a planta mãe para clones',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log('Submitting form with data:', formData);
      
      const plantToCreate = {
        apelido: formData.apelido,
        especie: formData.especie,
        bancoSementes: formData.bancoSementes || undefined,
        origem: formData.origem,
        maeId: formData.origem === 'clone' ? formData.maeId : undefined,
        genetica: {
          indica: formData.indica,
          sativa: formData.sativa,
          ruderalis: formData.ruderalis,
        },
        geracao: formData.origem === 'semente' ? 0 : 0, // Will be calculated by store
        faseAtual: formData.faseAtual,
        metodoAtual: formData.metodoAtual || undefined,
        fenotipoNotas: formData.fenotipoNotas || undefined,
        observacoes: formData.observacoes || undefined,
        viva: true,
        dataGerminacao: formData.dataGerminacao || undefined,
        dataNascimento: formData.dataNascimento || undefined,
        tentId: formData.tentId,
      };
      
      console.log('Creating plant:', plantToCreate);
      await createPlant(plantToCreate);
      
      toast({
        title: 'Planta criada!',
        description: 'Sua planta foi adicionada com sucesso',
      });
      
      navigate('/plants');
    } catch (error) {
      console.error('Error creating plant:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível criar a planta',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            Nova Planta
          </h1>
          <p className="text-muted-foreground mt-1">Adicione uma nova planta mãe</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apelido">Apelido / Nome *</Label>
            <Input
              id="apelido"
              value={formData.apelido}
              onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
              placeholder="Ex: Green Queen"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especie">Espécie / Cepa *</Label>
            <Input
              id="especie"
              value={formData.especie}
              onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
              placeholder="Ex: OG Kush"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="banco">Banco de Sementes</Label>
            <Input
              id="banco"
              value={formData.bancoSementes}
              onChange={(e) => setFormData({ ...formData, bancoSementes: e.target.value })}
              placeholder="Ex: Royal Queen Seeds"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="origem">Origem *</Label>
            <Select
              value={formData.origem}
              onValueChange={(value: 'semente' | 'clone') => 
                setFormData({ ...formData, origem: value, maeId: undefined })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="semente">Semente</SelectItem>
                <SelectItem value="clone">Clone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.origem === 'clone' && (
            <div className="space-y-2">
              <Label htmlFor="mae">Planta Mãe *</Label>
              <Select
                value={formData.maeId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, maeId: Number(value) })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a planta mãe" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {motherPlants.map((mother) => (
                    <SelectItem key={mother.id} value={mother.id!.toString()}>
                      {mother.apelido} ({mother.codigo}) - G{mother.geracao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {formData.origem === 'semente' && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="sera-mae" className="text-base">Será usada como mãe</Label>
                <p className="text-sm text-muted-foreground">
                  Marque se esta planta será mantida para clonagem
                </p>
              </div>
              <Switch
                id="sera-mae"
                checked={formData.seraMae}
                onCheckedChange={(checked) => setFormData({ ...formData, seraMae: checked })}
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-germinacao">Data de Germinação</Label>
              <Input
                id="data-germinacao"
                type="date"
                value={formData.dataGerminacao}
                onChange={(e) => setFormData({ ...formData, dataGerminacao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-nascimento">Data de Nascimento</Label>
              <Input
                id="data-nascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Genética (%)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="indica" className="text-sm">Indica</Label>
                <Input
                  id="indica"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.indica}
                  onChange={(e) => setFormData({ ...formData, indica: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sativa" className="text-sm">Sativa</Label>
                <Input
                  id="sativa"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sativa}
                  onChange={(e) => setFormData({ ...formData, sativa: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruderalis" className="text-sm">Ruderalis</Label>
                <Input
                  id="ruderalis"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.ruderalis}
                  onChange={(e) => setFormData({ ...formData, ruderalis: Number(e.target.value) })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {formData.indica + formData.sativa + formData.ruderalis}%
            </p>
          </div>
          
          <PhaseSelector
            phase={formData.faseAtual}
            method={formData.metodoAtual}
            onPhaseChange={(phase) => setFormData({ ...formData, faseAtual: phase, metodoAtual: '' })}
            onMethodChange={(method) => setFormData({ ...formData, metodoAtual: method })}
          />
          
          <div className="space-y-2">
            <Label htmlFor="tent">Alocar na Tenda</Label>
            <Select
              value={formData.tentId?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, tentId: value ? Number(value) : undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tenda (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="">Nenhuma tenda</SelectItem>
                {tents.map((tent) => (
                  <SelectItem key={tent.id} value={tent.id!.toString()}>
                    {tent.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fenotipo">Notas de Fenótipo</Label>
            <Textarea
              id="fenotipo"
              value={formData.fenotipoNotas}
              onChange={(e) => setFormData({ ...formData, fenotipoNotas: e.target.value })}
              placeholder="Características observadas..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Gerais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Anotações adicionais..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Criar Planta
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewPlant;
