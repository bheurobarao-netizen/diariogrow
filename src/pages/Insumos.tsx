import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsumoStore } from '@/stores/insumoStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
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

const Insumos = () => {
  const navigate = useNavigate();
  const { insumos, fetchInsumos, deleteInsumo, loading } = useInsumoStore();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchInsumos();
  }, [fetchInsumos]);
  
  const handleDelete = async (id: number, nome: string) => {
    try {
      await deleteInsumo(id);
      toast({
        title: 'Insumo excluído',
        description: `${nome} foi removido com sucesso`,
      });
    } catch (error) {
      console.error('Error deleting insumo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o insumo',
        variant: 'destructive',
      });
    }
  };
  
  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      nutriente: 'Nutriente',
      suplemento: 'Suplemento',
      pesticida: 'Pesticida',
      substrato: 'Substrato',
      outro: 'Outro',
    };
    return labels[tipo] || tipo;
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
            <Package className="w-8 h-8" />
            Insumos
          </h1>
          <p className="text-muted-foreground mt-1">Catálogo de produtos e materiais</p>
        </div>
        <Button onClick={() => navigate('/insumos/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Insumo
        </Button>
      </div>
      
      {insumos.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum insumo cadastrado</h2>
          <p className="text-muted-foreground mb-4">
            Adicione produtos ao seu catálogo
          </p>
          <Button onClick={() => navigate('/insumos/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Insumo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insumos.map((insumo) => (
            <Card key={insumo.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{insumo.nomeProduto}</h3>
                  {insumo.marca && (
                    <p className="text-sm text-muted-foreground">{insumo.marca}</p>
                  )}
                </div>
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  {getTipoLabel(insumo.tipo)}
                </span>
              </div>
              
              {insumo.observacoes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {insumo.observacoes}
                </p>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/insumos/edit/${insumo.id}`)}
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
                        Tem certeza que deseja excluir "{insumo.nomeProduto}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(insumo.id!, insumo.nomeProduto)}
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

export default Insumos;
