import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColheitaStore } from '@/stores/colheitaStore';
import { usePlantStore } from '@/stores/plantStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Leaf } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Colheitas = () => {
  const navigate = useNavigate();
  const { colheitas, fetchColheitas, deleteColheita, loading } = useColheitaStore();
  const { plants, fetchPlants } = usePlantStore();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchColheitas();
    fetchPlants();
  }, [fetchColheitas, fetchPlants]);
  
  const handleDelete = async (id: number) => {
    try {
      await deleteColheita(id);
      toast({
        title: 'Colheita excluída',
        description: 'Registro removido com sucesso',
      });
    } catch (error) {
      console.error('Error deleting colheita:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a colheita',
        variant: 'destructive',
      });
    }
  };
  
  const getPlantName = (plantId: number) => {
    const plant = plants.find(p => p.id === plantId);
    return plant ? `${plant.apelido} (${plant.codigo})` : 'Planta não encontrada';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            Colheitas
          </h1>
          <p className="text-muted-foreground mt-1">Registro de colheitas e secagem</p>
        </div>
        <Button onClick={() => navigate('/colheitas/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Colheita
        </Button>
      </div>
      
      {colheitas.length === 0 ? (
        <Card className="p-12 text-center">
          <Leaf className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma colheita registrada</h2>
          <p className="text-muted-foreground mb-4">
            Registre suas colheitas e acompanhe o processo de secagem
          </p>
          <Button onClick={() => navigate('/colheitas/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Registrar Primeira Colheita
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colheitas.map((colheita) => (
            <Card key={colheita.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-primary font-medium mb-2">
                    <Leaf className="w-4 h-4" />
                    {getPlantName(colheita.plantId)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Colhida em {format(new Date(colheita.dataColheita), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {colheita.pesoUmidoManicurado && (
                  <div>
                    <div className="text-muted-foreground">Peso Úmido</div>
                    <div className="font-medium">{colheita.pesoUmidoManicurado}g</div>
                  </div>
                )}
                
                {colheita.pesoSecoFinal && (
                  <div>
                    <div className="text-muted-foreground">Peso Seco</div>
                    <div className="font-medium text-primary">{colheita.pesoSecoFinal}g</div>
                  </div>
                )}
                
                {colheita.dataInicioSecagem && (
                  <div>
                    <div className="text-muted-foreground">Início Secagem</div>
                    <div className="font-medium">
                      {format(new Date(colheita.dataInicioSecagem), 'dd/MM/yyyy')}
                    </div>
                  </div>
                )}
                
                {colheita.dataFimSecagem && (
                  <div>
                    <div className="text-muted-foreground">Fim Secagem</div>
                    <div className="font-medium">
                      {format(new Date(colheita.dataFimSecagem), 'dd/MM/yyyy')}
                    </div>
                  </div>
                )}
              </div>
              
              {colheita.observacoes && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  {colheita.observacoes}
                </p>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/colheitas/edit/${colheita.id}`)}
                  className="flex-1 gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-1">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este registro de colheita? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(colheita.id!)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Colheitas;
