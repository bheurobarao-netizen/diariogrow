import { useEffect } from 'react';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Leaf, Calendar as CalendarIcon, Droplets, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Timeline = () => {
  const { entries, fetchEntries, loading } = useEntryStore();
  const { plants, fetchPlants } = usePlantStore();
  
  useEffect(() => {
    fetchEntries();
    fetchPlants();
  }, [fetchEntries, fetchPlants]);
  
  const getPlantName = (plantId?: number) => {
    if (!plantId) return null;
    const plant = plants.find(p => p.id === plantId);
    return plant ? `${plant.apelido} (${plant.codigo})` : null;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            Timeline
          </h1>
          <p className="text-muted-foreground mt-1">Suas entradas recentes</p>
        </div>
        <Link to="/plants">
          <Button variant="outline" size="sm">
            Ver Plantas
          </Button>
        </Link>
      </div>
      
      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <Leaf className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma entrada ainda</h2>
          <p className="text-muted-foreground mb-4">
            Comece a documentar seu cultivo!
          </p>
          <Link to="/new">
            <Button className="gradient-primary">Criar Primeira Entrada</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const plantName = getPlantName(entry.plantId);
            
            return (
              <Card key={entry.id} className="p-4 hover:shadow-elegant transition-smooth">
                <Link to={`/entry/${entry.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <CalendarIcon className="w-4 h-4" />
                          {format(new Date(entry.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        {plantName && (
                          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                            <Leaf className="w-4 h-4" />
                            {plantName}
                          </div>
                        )}
                        {entry.fase && (
                          <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium uppercase">
                            {entry.fase}
                          </span>
                        )}
                      </div>
                      {entry.photos.length > 0 && (
                        <img
                          src={entry.photos[0]}
                          alt="Entry preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    
                    {entry.content && (
                      <p className="text-sm text-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {entry.temperatura && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {entry.temperatura}°C
                        </div>
                      )}
                      {entry.umidade && (
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {entry.umidade}%
                        </div>
                      )}
                      {entry.ph && (
                        <div className="flex items-center gap-1">
                          pH {entry.ph}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timeline;
