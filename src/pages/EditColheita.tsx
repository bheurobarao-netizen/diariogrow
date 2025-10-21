import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useColheitaStore } from '@/stores/colheitaStore';
import { usePlantStore } from '@/stores/plantStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Leaf } from 'lucide-react';

const EditColheita = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getColheita, updateColheita } = useColheitaStore();
  const { plants, fetchPlants } = usePlantStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plantId: undefined as number | undefined,
    dataColheita: new Date().toISOString().split('T')[0],
    pesoUmidoManicurado: '',
    dataInicioSecagem: '',
    dataFimSecagem: '',
    pesoSecoFinal: '',
    observacoes: '',
  });
  
  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);
  
  useEffect(() => {
    const loadColheita = async () => {
      if (!id) return;
      
      try {
        const colheita = await getColheita(Number(id));
        if (!colheita) {
          toast({
            title: 'Erro',
            description: 'Colheita não encontrada',
            variant: 'destructive',
          });
          navigate('/colheitas');
          return;
        }
        
        setFormData({
          plantId: colheita.plantId,
          dataColheita: colheita.dataColheita,
          pesoUmidoManicurado: colheita.pesoUmidoManicurado?.toString() || '',
          dataInicioSecagem: colheita.dataInicioSecagem || '',
          dataFimSecagem: colheita.dataFimSecagem || '',
          pesoSecoFinal: colheita.pesoSecoFinal?.toString() || '',
          observacoes: colheita.observacoes || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading colheita:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a colheita',
          variant: 'destructive',
        });
        navigate('/colheitas');
      }
    };
    
    loadColheita();
  }, [id, getColheita, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updateColheita(Number(id), {
        plantId: formData.plantId!,
        dataColheita: formData.dataColheita,
        pesoUmidoManicurado: formData.pesoUmidoManicurado ? Number(formData.pesoUmidoManicurado) : undefined,
        dataInicioSecagem: formData.dataInicioSecagem || undefined,
        dataFimSecagem: formData.dataFimSecagem || undefined,
        pesoSecoFinal: formData.pesoSecoFinal ? Number(formData.pesoSecoFinal) : undefined,
        observacoes: formData.observacoes || undefined,
      });
      
      toast({
        title: 'Colheita atualizada!',
        description: 'As alterações foram salvas com sucesso',
      });
      
      navigate('/colheitas');
    } catch (error) {
      console.error('Error updating colheita:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a colheita',
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
            Editar Colheita
          </h1>
          <p className="text-muted-foreground mt-1">Atualize os dados da colheita</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plant">Planta</Label>
            <Select
              value={formData.plantId?.toString()}
              onValueChange={(value) => setFormData({ ...formData, plantId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a planta" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id!.toString()}>
                    {plant.apelido} ({plant.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataColheita">Data da Colheita</Label>
            <Input
              id="dataColheita"
              type="date"
              value={formData.dataColheita}
              onChange={(e) => setFormData({ ...formData, dataColheita: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pesoUmido">Peso Úmido Manicurado (g)</Label>
            <Input
              id="pesoUmido"
              type="number"
              step="0.01"
              value={formData.pesoUmidoManicurado}
              onChange={(e) => setFormData({ ...formData, pesoUmidoManicurado: e.target.value })}
              placeholder="Peso das flores após manicura"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inicioSecagem">Início da Secagem</Label>
              <Input
                id="inicioSecagem"
                type="date"
                value={formData.dataInicioSecagem}
                onChange={(e) => setFormData({ ...formData, dataInicioSecagem: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fimSecagem">Fim da Secagem</Label>
              <Input
                id="fimSecagem"
                type="date"
                value={formData.dataFimSecagem}
                onChange={(e) => setFormData({ ...formData, dataFimSecagem: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pesoSeco">Peso Seco Final (g)</Label>
            <Input
              id="pesoSeco"
              type="number"
              step="0.01"
              value={formData.pesoSecoFinal}
              onChange={(e) => setFormData({ ...formData, pesoSecoFinal: e.target.value })}
              placeholder="Rendimento final"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Notas sobre a colheita..."
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

export default EditColheita;
