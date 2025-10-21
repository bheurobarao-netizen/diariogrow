import { useEffect, useState } from 'react';
import { useTentStore } from '@/stores/tentStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, Pencil, Trash2, Lightbulb, Ruler } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Tents = () => {
  const navigate = useNavigate();
  const { tents, fetchTents, deleteTent, loading } = useTentStore();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  useEffect(() => {
    fetchTents();
  }, [fetchTents]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteTent(deleteId);
      toast({
        title: 'Sucesso',
        description: 'Tenda excluída com sucesso',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir a tenda',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Home className="w-8 h-8" />
            Tendas de Cultivo
          </h1>
          <p className="text-muted-foreground mt-1">
            {tents.length} {tents.length === 1 ? 'tenda cadastrada' : 'tendas cadastradas'}
          </p>
        </div>
        <Link to="/tents/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tenda
          </Button>
        </Link>
      </div>
      
      {tents.length === 0 ? (
        <Card className="p-12 text-center">
          <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma tenda cadastrada</h2>
          <p className="text-muted-foreground mb-4">
            Comece adicionando suas tendas de cultivo
          </p>
          <Link to="/tents/new">
            <Button variant="gradient">Adicionar Primeira Tenda</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tents.map((tent) => (
            <Card key={tent.id} className="p-5 hover:shadow-elegant transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-1">{tent.nome}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="gap-1">
                      <Ruler className="w-3 h-3" />
                      {tent.cumprimentoCm} × {tent.profundidadeCm} × {tent.alturaCm} cm
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/tents/edit/${tent.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(tent.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {tent.observacoes && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  {tent.observacoes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tenda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tents;
