import { useEffect, useState } from 'react';
import { usePlantStore } from '@/stores/plantStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Plus, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Plants = () => {
  const { plants, fetchPlants, loading } = usePlantStore();
  const [showQR, setShowQR] = useState<number | null>(null);
  
  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);
  
  const mothers = plants.filter(p => p.origem === 'semente' && p.viva);
  const clones = plants.filter(p => p.origem === 'clone' && p.viva);
  
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
            Minhas Plantas
          </h1>
          <p className="text-muted-foreground mt-1">
            {mothers.length} mães • {clones.length} clones
          </p>
        </div>
        <Link to="/plants/new">
          <Button className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Planta
          </Button>
        </Link>
      </div>
      
      {mothers.length === 0 ? (
        <Card className="p-12 text-center">
          <Leaf className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma planta cadastrada</h2>
          <p className="text-muted-foreground mb-4">
            Comece adicionando suas plantas mães
          </p>
          <Link to="/plants/new">
            <Button className="gradient-primary">Adicionar Primeira Planta</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary">Plantas Mães</h2>
            <div className="space-y-3">
              {mothers.map((plant) => (
                <Card key={plant.id} className="p-4 hover:shadow-elegant transition-smooth">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{plant.apelido}</h3>
                        <Badge variant="outline" className="text-xs">
                          {plant.codigo}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plant.especie}
                        {plant.bancoSementes && ` • ${plant.bancoSementes}`}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="secondary">
                          I: {plant.genetica.indica}%
                        </Badge>
                        <Badge variant="secondary">
                          S: {plant.genetica.sativa}%
                        </Badge>
                        {plant.genetica.ruderalis > 0 && (
                          <Badge variant="secondary">
                            R: {plant.genetica.ruderalis}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQR(showQR === plant.id ? null : plant.id!)}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showQR === plant.id && plant.qrCodeData && (
                    <div className="mt-4 pt-4 border-t flex justify-center">
                      <img src={plant.qrCodeData} alt="QR Code" className="w-32 h-32" />
                    </div>
                  )}
                  
                  {plant.observacoes && (
                    <p className="text-sm mt-3 pt-3 border-t">{plant.observacoes}</p>
                  )}
                </Card>
              ))}
            </div>
          </section>
          
          {clones.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-primary">Clones</h2>
              <div className="space-y-3">
                {clones.map((clone) => {
                  const mother = plants.find(p => p.id === clone.maeId);
                  return (
                    <Card key={clone.id} className="p-4 hover:shadow-elegant transition-smooth">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{clone.apelido}</h3>
                            <Badge variant="outline" className="text-xs">
                              {clone.codigo}
                            </Badge>
                          </div>
                          {mother && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Clone de: {mother.apelido} ({mother.codigo})
                            </p>
                          )}
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Geração {clone.geracao}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowQR(showQR === clone.id ? null : clone.id!)}
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {showQR === clone.id && clone.qrCodeData && (
                        <div className="mt-4 pt-4 border-t flex justify-center">
                          <img src={clone.qrCodeData} alt="QR Code" className="w-32 h-32" />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Plants;
