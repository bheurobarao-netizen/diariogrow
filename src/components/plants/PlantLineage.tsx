import { useEffect, useState } from 'react';
import { usePlantStore } from '@/stores/plantStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plant } from '@/lib/db';
import { getPhaseLabel } from '@/lib/phases';
import { ChevronRight, Sprout } from 'lucide-react';

interface PlantLineageProps {
  plantId: number;
}

const PlantLineage = ({ plantId }: PlantLineageProps) => {
  const { plants, fetchPlants } = usePlantStore();
  const [ancestors, setAncestors] = useState<Plant[]>([]);
  const [descendants, setDescendants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    const currentPlant = plants.find((p) => p.id === plantId);
    if (!currentPlant) return;

    // Build ancestors chain
    const buildAncestors = (plant: Plant): Plant[] => {
      if (!plant.maeId) return [];
      const mae = plants.find((p) => p.id === plant.maeId);
      if (!mae) return [];
      return [...buildAncestors(mae), mae];
    };

    // Get direct descendants (children)
    const getDescendants = (plant: Plant): Plant[] => {
      return plants.filter((p) => p.maeId === plant.id);
    };

    setAncestors(buildAncestors(currentPlant));
    setDescendants(getDescendants(currentPlant));
    setLoading(false);
  }, [plants, plantId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando linhagem...
      </div>
    );
  }

  const currentPlant = plants.find((p) => p.id === plantId);
  if (!currentPlant) return null;

  return (
    <div className="space-y-6">
      {/* Ancestors */}
      {ancestors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Ancestrais
          </h3>
          <div className="space-y-3">
            {ancestors.map((ancestor, index) => (
              <div key={ancestor.id} className="flex items-center gap-3">
                <div className="text-muted-foreground text-sm w-16">
                  G{ancestor.geracao}
                </div>
                <Link to={`/plants/${ancestor.id}`} className="flex-1">
                  <Card className="p-4 hover:shadow-elegant transition-smooth">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sprout className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{ancestor.apelido}</span>
                          <Badge variant="outline" className="text-xs">
                            {ancestor.codigo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ancestor.especie}
                        </p>
                        {ancestor.faseAtual && (
                          <Badge variant="secondary" className="text-xs mt-2">
                            {getPhaseLabel(ancestor.faseAtual)}
                          </Badge>
                        )}
                      </div>
                      {index < ancestors.length - 1 && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Plant Highlight */}
      <div className="border-2 border-primary/50 rounded-lg p-1">
        <Card className="p-4 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{currentPlant.apelido}</span>
            <Badge variant="default" className="text-xs">
              {currentPlant.codigo}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Geração {currentPlant.geracao}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{currentPlant.especie}</p>
        </Card>
      </div>

      {/* Descendants */}
      {descendants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5" />
            Descendentes Diretos ({descendants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {descendants.map((descendant) => (
              <Link key={descendant.id} to={`/plants/${descendant.id}`}>
                <Card className="p-4 hover:shadow-elegant transition-smooth h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{descendant.apelido}</span>
                    <Badge variant="outline" className="text-xs">
                      {descendant.codigo}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {descendant.especie}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Geração {descendant.geracao}
                    </Badge>
                    {descendant.faseAtual && (
                      <Badge variant="outline" className="text-xs">
                        {getPhaseLabel(descendant.faseAtual)}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {ancestors.length === 0 && descendants.length === 0 && (
        <Card className="p-12 text-center">
          <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem linhagem registrada</h3>
          <p className="text-muted-foreground">
            Esta planta não tem ancestrais nem descendentes cadastrados
          </p>
        </Card>
      )}

      {/* View Full Tree Link */}
      <div className="flex justify-center pt-4">
        <Link to="/lineage">
          <Button variant="outline" className="gap-2">
            <Sprout className="w-4 h-4" />
            Ver Árvore Genealógica Completa
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PlantLineage;
