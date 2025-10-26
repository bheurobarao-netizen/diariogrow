import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInsumoStore } from '@/stores/insumoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';

const EditInsumo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInsumo, updateInsumo } = useInsumoStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nomeProduto: '',
    marca: '',
    tipo: 'nutriente' as 'nutriente' | 'suplemento' | 'pesticida' | 'substrato' | 'outro',
    preco: '',
    observacoes: '',
  });
  
  useEffect(() => {
    const loadInsumo = async () => {
      if (!id) return;
      
      try {
        const insumo = await getInsumo(Number(id));
        if (!insumo) {
          toast({
            title: 'Erro',
            description: 'Insumo não encontrado',
            variant: 'destructive',
          });
          navigate('/insumos');
          return;
        }
        
        setFormData({
          nomeProduto: insumo.nomeProduto,
          marca: insumo.marca || '',
          tipo: insumo.tipo,
          preco: insumo.preco?.toString() || '',
          observacoes: insumo.observacoes || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading insumo:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o insumo',
          variant: 'destructive',
        });
        navigate('/insumos');
      }
    };
    
    loadInsumo();
  }, [id, getInsumo, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updateInsumo(Number(id), {
        nomeProduto: formData.nomeProduto,
        marca: formData.marca || undefined,
        tipo: formData.tipo,
        preco: formData.preco ? parseFloat(formData.preco) : undefined,
        observacoes: formData.observacoes || undefined,
      });
      
      toast({
        title: 'Insumo atualizado!',
        description: 'As alterações foram salvas com sucesso',
      });
      
      navigate('/insumos');
    } catch (error) {
      console.error('Error updating insumo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o insumo',
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
            <Package className="w-8 h-8" />
            Editar Insumo
          </h1>
          <p className="text-muted-foreground mt-1">Atualize as informações do produto</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input
              id="nome"
              value={formData.nomeProduto}
              onChange={(e) => setFormData({ ...formData, nomeProduto: e.target.value })}
              placeholder="Ex: Nitrato de Cálcio"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Ex: Haifa, Athena"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="nutriente">Nutriente</SelectItem>
                <SelectItem value="suplemento">Suplemento</SelectItem>
                <SelectItem value="pesticida">Pesticida</SelectItem>
                <SelectItem value="substrato">Substrato</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Notas sobre o produto..."
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

export default EditInsumo;
