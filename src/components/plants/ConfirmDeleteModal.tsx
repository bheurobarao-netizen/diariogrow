import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePlantStore } from '@/stores/plantStore';
import { Plant } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConfirmDeleteModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ConfirmDeleteModal({ plant, open, onOpenChange, onSuccess }: ConfirmDeleteModalProps) {
  const { deletePlant, getClonesByMother } = usePlantStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasDescendants, setHasDescendants] = useState(false);

  const checkDescendants = async () => {
    const clones = await getClonesByMother(plant.id!);
    setHasDescendants(clones.length > 0);
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deletePlant(plant.id!);
      toast({
        title: 'Planta excluída',
        description: 'A planta foi removida com sucesso.',
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a planta.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      checkDescendants();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {hasDescendants ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Não é possível excluir esta planta.</strong>
                <br />
                Ela possui clones/descendentes ativos. Exclua os descendentes primeiro ou mova-os para outra mãe.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <p>Você está prestes a excluir:</p>
              <div className="rounded-lg border border-border p-3 bg-muted/50">
                <p className="font-semibold text-lg">{plant.apelido}</p>
                <p className="text-sm text-muted-foreground">
                  {plant.especie} • {plant.codigo}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Geração {plant.geracao} • {plant.faseAtual}
                </p>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tem certeza que deseja excluir esta planta permanentemente?
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          {!hasDescendants && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir Planta
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
