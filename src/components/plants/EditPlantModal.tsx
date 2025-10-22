import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlantStore } from '@/stores/plantStore';
import { Plant } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditPlantModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PHASES = [
  'Germinação',
  'Plântula',
  'Vegetativo',
  'Pré-Floração',
  'Floração',
  'Colhida',
];

export function EditPlantModal({ plant, open, onOpenChange, onSuccess }: EditPlantModalProps) {
  const { updatePlant } = usePlantStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    apelido: plant.apelido,
    especie: plant.especie,
    faseAtual: plant.faseAtual,
    observacoes: plant.observacoes || '',
    fenotipoNotas: plant.fenotipoNotas || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePlant(plant.id!, formData);
      toast({
        title: 'Planta atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Planta: {plant.apelido}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apelido">Nome/Apelido</Label>
              <Input
                id="apelido"
                value={formData.apelido}
                onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="especie">Strain/Espécie</Label>
              <Input
                id="especie"
                value={formData.especie}
                onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fase">Fase Atual</Label>
              <Select
                value={formData.faseAtual}
                onValueChange={(value: any) => setFormData({ ...formData, faseAtual: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fenotipoNotas">Notas de Fenótipo</Label>
              <Textarea
                id="fenotipoNotas"
                value={formData.fenotipoNotas}
                onChange={(e) => setFormData({ ...formData, fenotipoNotas: e.target.value })}
                placeholder="Descreva características observadas..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Notas adicionais..."
                rows={3}
              />
            </div>
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
