import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlantStore } from '@/stores/plantStore';
import { Plant } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MovePlantModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MovePlantModal({ plant, open, onOpenChange, onSuccess }: MovePlantModalProps) {
  const { plants, movePlant, canMove } = usePlantStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newParentId, setNewParentId] = useState<number | undefined>(undefined);
  const [canMoveResult, setCanMoveResult] = useState(true);

  const availableParents = plants.filter((p) => 
    p.id !== plant.id && 
    p.viva &&
    p.id !== plant.maeId
  );

  useEffect(() => {
    const checkCanMove = async () => {
      if (newParentId !== undefined) {
        const result = await canMove(plant.id!, newParentId || null);
        setCanMoveResult(result);
      } else {
        setCanMoveResult(true);
      }
    };
    checkCanMove();
  }, [newParentId, plant.id, canMove]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canMoveResult) {
      toast({
        title: 'Movimento inválido',
        description: 'Esta mudança criaria um loop na hierarquia.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await movePlant(plant.id!, newParentId || null);
      toast({
        title: 'Planta movida',
        description: 'A hierarquia foi atualizada com sucesso.',
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erro ao mover',
        description: error instanceof Error ? error.message : 'Não foi possível mover a planta.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentParent = plant.maeId 
    ? plants.find((p) => p.id === plant.maeId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mover Planta na Hierarquia</DialogTitle>
          <DialogDescription>
            Altere a planta mãe de <strong>{plant.apelido}</strong>. A geração será recalculada automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {currentParent && (
              <div className="rounded-lg border border-border p-3 bg-muted/50">
                <Label className="text-xs text-muted-foreground">Mãe Atual</Label>
                <p className="font-medium">{currentParent.apelido}</p>
                <p className="text-sm text-muted-foreground">
                  {currentParent.especie} • {currentParent.codigo} • G{currentParent.geracao}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="newParent">Nova Planta Mãe</Label>
              <Select
                value={newParentId?.toString() || ''}
                onValueChange={(value) => setNewParentId(value ? Number(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a nova mãe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma (tornar independente)</SelectItem>
                  {availableParents.map((p) => (
                    <SelectItem key={p.id} value={p.id!.toString()}>
                      {p.apelido} • {p.especie} • {p.codigo} • G{p.geracao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!canMoveResult && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Esta mudança criaria um loop na hierarquia. Escolha outro pai.
                </AlertDescription>
              </Alert>
            )}

            {newParentId && canMoveResult && (
              <Alert>
                <AlertDescription>
                  A geração da planta será recalculada automaticamente após a mudança.
                </AlertDescription>
              </Alert>
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
            <Button type="submit" disabled={loading || !canMoveResult}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mover Planta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
