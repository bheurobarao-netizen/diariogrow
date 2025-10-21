import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlantStore } from '@/stores/plantStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Leaf } from 'lucide-react';
import { PhaseSelector } from '@/components/plants/PhaseSelector';
import { PlantPhase } from '@/lib/phases';

const EditPlant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlant, updatePlant } = usePlantStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    apelido: '',
    especie: '',
    bancoSementes: '',
    indica: 50,
    sativa: 50,
    ruderalis: 0,
    fenotipoNotas: '',
    observacoes: '',
    faseAtual: undefined as PlantPhase | undefined,
    metodoAtual: '',
    dataGerminacao: '',
    dataNascimento: '',
    viva: true,
  });
  
  useEffect(() => {
    const loadPlant = async () => {
      if (!id) return;
      
      try {
        const plant = await getPlant(Number(id));
        if (!plant) {
          toast({
            title: 'Erro',
            description: 'Planta não encontrada',
            variant: 'destructive',
          });
          navigate('/plants');
          return;
        }
        
        setFormData({
          apelido: plant.apelido,
          especie: plant.especie,
          bancoSementes: plant.bancoSementes || '',
          indica: plant.genetica.indica,
          sativa: plant.genetica.sativa,
          ruderalis: plant.genetica.ruderalis,
          fenotipoNotas: plant.fenotipoNotas || '',
          observacoes: plant.observacoes || '',
          faseAtual: plant.faseAtual,
          metodoAtual: plant.metodoAtual || '',
          dataGerminacao: plant.dataGerminacao || '',
          dataNascimento: plant.dataNascimento || '',
          viva: plant.viva,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading plant:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a planta',
          variant: 'destructive',
        });
        navigate('/plants');
      }
    };
    
    loadPlant();
  }, [id, getPlant, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updatePlant(Number(id), {
        apelido: formData.apelido,
        especie: formData.especie,
        bancoSementes: formData.bancoSementes || undefined,
        genetica: {
          indica: formData.indica,
          sativa: formData.sativa,
          ruderalis: formData.ruderalis,
        },
        faseAtual: formData.faseAtual,
        metodoAtual: formData.metodoAtual || undefined,
        fenotipoNotas: formData.fenotipoNotas || undefined,
        observacoes: formData.observacoes || undefined,
        dataGerminacao: formData.dataGerminacao || undefined,
        dataNascimento: formData.dataNascimento || undefined,
        viva: formData.viva,
      });
      
      toast({
        title: 'Planta atualizada!',
        description: 'As alterações foram salvas com sucesso',
      });
      
      navigate('/plants');
    } catch (error) {
      console.error('Error updating plant:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a planta',
        variant: 'destructive',
      });
    }
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
            Editar Planta
          </h1>
          <p className="text-muted-foreground mt-1">Atualize as informações da planta</p>
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
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="viva" className="text-base">Planta viva</Label>
              <p className="text-sm text-muted-foreground">
                Desmarque se a planta não está mais ativa
              </p>
            </div>
            <Switch
              id="viva"
              checked={formData.viva}
              onCheckedChange={(checked) => setFormData({ ...formData, viva: checked })}
            />
          </div>
          
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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditPlant;
