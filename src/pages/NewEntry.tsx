import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { PlantPhase } from '@/lib/db';
import { getPhaseLabel } from '@/lib/phases';
import FileUploader from '@/components/ui/file-uploader';

const NewEntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlantId = searchParams.get('plantId');
  
  const { createEntry } = useEntryStore();
  const { plants, fetchPlants } = usePlantStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    plantId: preselectedPlantId ? Number(preselectedPlantId) : undefined,
    fase: '' as PlantPhase | '',
    content: '',
    photos: [] as string[],
    videos: [] as string[],
    nutrientes: '',
    ec: '',
    ph: '',
    temperatura: '',
    umidade: '',
    luz: '',
  });

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.plantId) {
      toast({
        title: 'Erro',
        description: 'Selecione uma planta',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createEntry({
        date: formData.date,
        plantId: formData.plantId,
        fase: formData.fase || undefined,
        content: formData.content,
        photos: formData.photos,
        videos: formData.videos,
        nutrientes: formData.nutrientes || undefined,
        ec: formData.ec ? parseFloat(formData.ec) : undefined,
        ph: formData.ph ? parseFloat(formData.ph) : undefined,
        temperatura: formData.temperatura ? parseFloat(formData.temperatura) : undefined,
        umidade: formData.umidade ? parseFloat(formData.umidade) : undefined,
        luz: formData.luz || undefined,
        checklist: [],
        problemas: [],
        solucoes: [],
      });

      toast({
        title: 'Sucesso',
        description: 'Registro criado com sucesso!',
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating entry:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o registro',
        variant: 'destructive',
      });
    }
  };

  const handleMediaUpload = (urls: string[]) => {
    const photos = urls.filter((url) =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some((ext) =>
        url.toLowerCase().endsWith(ext)
      )
    );
    const videos = urls.filter((url) =>
      ['.mp4', '.mov', '.avi', '.webm', '.mkv'].some((ext) =>
        url.toLowerCase().endsWith(ext)
      )
    );

    setFormData((prev) => ({
      ...prev,
      photos,
      videos,
    }));
  };

  const phases: PlantPhase[] = [
    'germinacao_1',
    'germinacao_2',
    'germinacao_3',
    'muda',
    'vegetativo',
    'floracao',
    'flush',
    'secagem',
    'cura',
    'colhida',
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-primary">Nova Entrada no Diário</h1>
        <p className="text-muted-foreground mt-1">
          Documente o progresso das suas plantas
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Plant Selection */}
          <div className="space-y-2">
            <Label htmlFor="plant">Planta</Label>
            <Select
              value={formData.plantId?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, plantId: Number(value) })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma planta" />
              </SelectTrigger>
              <SelectContent>
                {plants
                  .filter((p) => p.viva)
                  .map((plant) => (
                    <SelectItem key={plant.id} value={plant.id!.toString()}>
                      {plant.apelido} ({plant.codigo})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phase */}
          <div className="space-y-2">
            <Label htmlFor="fase">Fase</Label>
            <Select
              value={formData.fase}
              onValueChange={(value) =>
                setFormData({ ...formData, fase: value as PlantPhase })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {getPhaseLabel(phase)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Observações</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Descreva o que observou hoje..."
              rows={4}
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Fotos e Vídeos</Label>
            <FileUploader
              onFilesUploaded={handleMediaUpload}
              accept="image/*,video/*"
              maxFiles={10}
              existingFiles={[...formData.photos, ...formData.videos]}
            />
          </div>

          {/* Environmental Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={formData.temperatura}
                onChange={(e) =>
                  setFormData({ ...formData, temperatura: e.target.value })
                }
                placeholder="25.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="umidade">Umidade (%)</Label>
              <Input
                id="umidade"
                type="number"
                step="0.1"
                value={formData.umidade}
                onChange={(e) =>
                  setFormData({ ...formData, umidade: e.target.value })
                }
                placeholder="60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                value={formData.ph}
                onChange={(e) =>
                  setFormData({ ...formData, ph: e.target.value })
                }
                placeholder="6.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ec">EC (mS/cm)</Label>
              <Input
                id="ec"
                type="number"
                step="0.1"
                value={formData.ec}
                onChange={(e) =>
                  setFormData({ ...formData, ec: e.target.value })
                }
                placeholder="1.5"
              />
            </div>
          </div>

          {/* Nutrients */}
          <div className="space-y-2">
            <Label htmlFor="nutrientes">Nutrientes</Label>
            <Textarea
              id="nutrientes"
              value={formData.nutrientes}
              onChange={(e) =>
                setFormData({ ...formData, nutrientes: e.target.value })
              }
              placeholder="Descreva os nutrientes aplicados..."
              rows={2}
            />
          </div>

          {/* Light */}
          <div className="space-y-2">
            <Label htmlFor="luz">Luz</Label>
            <Input
              id="luz"
              value={formData.luz}
              onChange={(e) =>
                setFormData({ ...formData, luz: e.target.value })
              }
              placeholder="18/6, LED 300W"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Salvar Registro
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewEntry;
