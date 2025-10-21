import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { useEntryStore } from '@/stores/entryStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { getPhaseLabel } from '@/lib/phases';
import { Plant, Entry } from '@/lib/db';
import PlantGallery from '@/components/plants/PlantGallery';
import PlantLineage from '@/components/plants/PlantLineage';
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

const PlantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlant, deletePlant } = usePlantStore();
  const { getEntriesByPlant } = useEntryStore();
  const { tents, fetchTents } = useTentStore();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTents();
  }, [fetchTents]);

  useEffect(() => {
    const loadPlantData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const plantData = await getPlant(Number(id));
        if (plantData) {
          setPlant(plantData);
          const plantEntries = await getEntriesByPlant(Number(id));
          setEntries(plantEntries);
        }
      } catch (error) {
        console.error('Error loading plant data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlantData();
  }, [id, getPlant, getEntriesByPlant]);
  
  const getTentName = (tentId?: number) => {
    if (!tentId) return null;
    const tent = tents.find((t) => t.id === tentId);
    return tent?.nome;
  };

  const handleDelete = async () => {
    if (!plant?.id) return;
    
    try {
      await deletePlant(plant.id);
      toast({
        title: 'Planta excluída',
        description: 'A planta foi removida com sucesso',
      });
      navigate('/plants');
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a planta',
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

  if (!plant) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Planta não encontrada</h2>
          <Button onClick={() => navigate('/plants')} variant="outline">
            Voltar para Plantas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/plants')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Link to={`/new?plantId=${plant.id}`}>
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Registro
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/plants/edit/${plant.id}`)}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{plant.apelido}"? Esta ação não pode ser desfeita.
                  {plant.origem === 'semente' && ' Plantas mães com clones ativos não podem ser excluídas.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Plant Info Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">{plant.apelido}</h1>
                <Badge variant="outline" className="mt-1">
                  {plant.codigo}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground text-lg mb-3">
              {plant.especie}
              {plant.bancoSementes && ` • ${plant.bancoSementes}`}
            </p>
          </div>
          {plant.qrCodeData && (
            <img
              src={plant.qrCodeData}
              alt="QR Code"
              className="w-24 h-24 rounded-lg border"
            />
          )}
        </div>

        {/* Phase and Method */}
        {plant.faseAtual && (
          <div className="mb-4">
            <Badge variant="default" className="text-sm px-3 py-1">
              {getPhaseLabel(plant.faseAtual)}
              {plant.metodoAtual && ` • ${plant.metodoAtual}`}
            </Badge>
          </div>
        )}

        {/* Genetics */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            Indica: {plant.genetica.indica}%
          </Badge>
          <Badge variant="secondary">
            Sativa: {plant.genetica.sativa}%
          </Badge>
          {plant.genetica.ruderalis > 0 && (
            <Badge variant="secondary">
              Ruderalis: {plant.genetica.ruderalis}%
            </Badge>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {plant.tentId && getTentName(plant.tentId) && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">📍 {getTentName(plant.tentId)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Origem</p>
            <p className="font-medium capitalize">{plant.origem}</p>
          </div>
          {plant.geracao && (
            <div>
              <p className="text-sm text-muted-foreground">Geração</p>
              <p className="font-medium">G{plant.geracao}</p>
            </div>
          )}
          {plant.dataGerminacao && (
            <div>
              <p className="text-sm text-muted-foreground">Germinação</p>
              <p className="font-medium">
                {new Date(plant.dataGerminacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
          {plant.dataNascimento && (
            <div>
              <p className="text-sm text-muted-foreground">Nascimento</p>
              <p className="font-medium">
                {new Date(plant.dataNascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {plant.observacoes && (
          <div className="pt-4 border-t mt-4">
            <p className="text-sm text-muted-foreground mb-2">Observações</p>
            <p className="text-sm">{plant.observacoes}</p>
          </div>
        )}

        {/* Phenotype Notes */}
        {plant.fenotipoNotas && (
          <div className="pt-4 border-t mt-4">
            <p className="text-sm text-muted-foreground mb-2">Notas do Fenótipo</p>
            <p className="text-sm">{plant.fenotipoNotas}</p>
          </div>
        )}
      </Card>

      {/* Gallery Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Galeria</h2>
          <Badge variant="outline">
            {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
          </Badge>
        </div>
        
        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <Leaf className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum registro ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece a documentar o crescimento desta planta
            </p>
            <Link to={`/new?plantId=${plant.id}`}>
              <Button variant="gradient">Criar Primeiro Registro</Button>
            </Link>
          </Card>
        ) : (
          <PlantGallery entries={entries} />
        )}
      </div>

      {/* Lineage Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Linhagem</h2>
        <PlantLineage plantId={plant.id!} />
      </div>
    </div>
  );
};

export default PlantDetail;
