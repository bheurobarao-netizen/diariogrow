import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Leaf, Pencil, Trash2, Thermometer, Droplets, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Entry } from '@/lib/db';
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

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, deleteEntry } = useEntryStore();
  const { getPlant } = usePlantStore();
  const { getTent } = useTentStore();
  const { toast } = useToast();
  
  const [entry, setEntry] = useState<Entry | null>(null);
  const [plantName, setPlantName] = useState<string>('');
  const [tentName, setTentName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;
      
      try {
        const entryData = await getEntry(Number(id));
        if (!entryData) {
          toast({
            title: 'Erro',
            description: 'Entrada não encontrada',
            variant: 'destructive',
          });
          navigate('/timeline');
          return;
        }
        
        setEntry(entryData);
        
        if (entryData.plantId) {
          const plant = await getPlant(entryData.plantId);
          if (plant) {
            setPlantName(`${plant.apelido} (${plant.codigo})`);
          }
        }
        
        if (entryData.tentId) {
          const tent = await getTent(entryData.tentId);
          if (tent) {
            setTentName(tent.nome);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading entry:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a entrada',
          variant: 'destructive',
        });
        navigate('/timeline');
      }
    };
    
    loadEntry();
  }, [id, getEntry, getPlant, getTent, navigate, toast]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteEntry(Number(id));
      toast({
        title: 'Entrada excluída',
        description: 'Registro removido com sucesso',
      });
      navigate('/timeline');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a entrada',
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
  
  if (!entry) return null;
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              Entrada do Diário
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(entry.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/entry/edit/${entry.id}`)} className="gap-2">
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita.
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
      
      {/* Basic Info */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {plantName && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Planta</div>
              <div className="flex items-center gap-2 text-primary font-medium">
                <Leaf className="w-4 h-4" />
                {plantName}
              </div>
            </div>
          )}
          
          {tentName && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tenda</div>
              <div className="font-medium">📍 {tentName}</div>
            </div>
          )}
          
          {entry.fase && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Fase</div>
              <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium uppercase inline-block">
                {entry.fase}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Environment */}
      {(entry.temperaturaMin || entry.umidadeMin || entry.distanciaLuzCm) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ambiente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entry.temperaturaMin && entry.temperaturaMax && (
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Temperatura</div>
                  <div className="font-medium">{entry.temperaturaMin}-{entry.temperaturaMax}°C</div>
                </div>
              </div>
            )}
            
            {entry.umidadeMin && entry.umidadeMax && (
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Umidade</div>
                  <div className="font-medium">{entry.umidadeMin}-{entry.umidadeMax}%</div>
                </div>
              </div>
            )}
            
            {entry.distanciaLuzCm && (
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Distância Luz</div>
                  <div className="font-medium">{entry.distanciaLuzCm} cm</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Nutrient Solution */}
      {(entry.phAguaEntrada || entry.ecAguaEntrada || entry.volumeTotalLitros) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Solução Nutritiva</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {entry.volumeTotalLitros && (
              <div>
                <div className="text-sm text-muted-foreground">Volume Total</div>
                <div className="font-medium">{entry.volumeTotalLitros}L</div>
              </div>
            )}
            {entry.phAguaEntrada && (
              <div>
                <div className="text-sm text-muted-foreground">pH Entrada</div>
                <div className="font-medium">{entry.phAguaEntrada}</div>
              </div>
            )}
            {entry.ecAguaEntrada && (
              <div>
                <div className="text-sm text-muted-foreground">EC Entrada</div>
                <div className="font-medium">{entry.ecAguaEntrada}</div>
              </div>
            )}
            {entry.phAguaSaida && (
              <div>
                <div className="text-sm text-muted-foreground">pH Saída</div>
                <div className="font-medium">{entry.phAguaSaida}</div>
              </div>
            )}
            {entry.ecAguaSaida && (
              <div>
                <div className="text-sm text-muted-foreground">EC Saída</div>
                <div className="font-medium">{entry.ecAguaSaida}</div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Applied Nutrients */}
      {entry.nutrientesAplicados.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nutrientes Aplicados</h2>
          <div className="space-y-2">
            {entry.nutrientesAplicados.map((nutriente, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">{nutriente.nomeNutriente}</span>
                <span className="text-sm text-muted-foreground">
                  {nutriente.quantidade} {nutriente.unidade}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Actions & Health */}
      {(entry.acoesRealizadas.length > 0 || entry.problemasObservados.length > 0 || entry.acoesCorretivas.length > 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ações e Saúde</h2>
          <div className="space-y-4">
            {entry.acoesRealizadas.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Ações Realizadas</div>
                <div className="flex flex-wrap gap-2">
                  {entry.acoesRealizadas.map((acao, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {acao}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {entry.problemasObservados.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Problemas Observados</div>
                <div className="flex flex-wrap gap-2">
                  {entry.problemasObservados.map((problema, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                      {problema}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {entry.acoesCorretivas.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Ações Corretivas</div>
                <div className="flex flex-wrap gap-2">
                  {entry.acoesCorretivas.map((acao, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm">
                      {acao}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Content */}
      {entry.content && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Observações</h2>
          <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
        </Card>
      )}
      
      {/* Media */}
      {(entry.photos.length > 0 || entry.videos.length > 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mídia</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entry.photos.map((photo, index) => (
              <img
                key={`photo-${index}`}
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
            {entry.videos.map((video, index) => (
              <video
                key={`video-${index}`}
                src={video}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EntryDetail;
