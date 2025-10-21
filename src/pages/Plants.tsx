import { useEffect, useState } from 'react';
import { usePlantStore } from '@/stores/plantStore';
import { useTentStore } from '@/stores/tentStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Plus, QrCode, Printer, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { getPhaseLabel } from '@/lib/phases';
import { Plant } from '@/lib/db';
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

const Plants = () => {
  const navigate = useNavigate();
  const { plants, fetchPlants, deletePlant, loading } = usePlantStore();
  const { tents, fetchTents } = useTentStore();
  const [showQR, setShowQR] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPlants();
    fetchTents();
  }, [fetchPlants, fetchTents]);
  
  const getTentName = (tentId?: number) => {
    if (!tentId) return null;
    const tent = tents.find((t) => t.id === tentId);
    return tent?.nome;
  };
  
  const handleDelete = async (plantId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deletePlant(plantId);
      toast({
        title: 'Planta excluída',
        description: 'A planta foi removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a planta',
        variant: 'destructive',
      });
    }
  };
  
  const printLabel = (plant: Plant) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Etiqueta - ${plant.codigo}</title>
          <style>
            @page {
              size: 100mm 30mm;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              width: 100mm;
              height: 30mm;
              padding: 2mm;
              font-family: Arial, sans-serif;
              font-size: 8pt;
              display: flex;
              gap: 2mm;
              background: white;
            }
            .qr-section {
              flex-shrink: 0;
              width: 26mm;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-section img {
              width: 24mm;
              height: 24mm;
            }
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 1mm;
            }
            .codigo {
              font-size: 11pt;
              font-weight: bold;
              margin-bottom: 0.5mm;
            }
            .apelido {
              font-size: 9pt;
              font-weight: bold;
            }
            .detail {
              font-size: 7pt;
              color: #333;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-section">
            ${plant.qrCodeData ? `<img src="${plant.qrCodeData}" alt="QR Code" />` : ''}
          </div>
          <div class="info-section">
            <div class="codigo">${plant.codigo}</div>
            <div class="apelido">${plant.apelido}</div>
            <div class="detail">${plant.especie}</div>
            ${plant.faseAtual ? `<div class="detail">${getPhaseLabel(plant.faseAtual)}</div>` : ''}
            <div class="detail">I:${plant.genetica.indica}% S:${plant.genetica.sativa}% ${plant.genetica.ruderalis > 0 ? `R:${plant.genetica.ruderalis}%` : ''}</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };
  
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
          <Button variant="gradient">
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
            <Button variant="gradient">Adicionar Primeira Planta</Button>
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
                    <Link to={`/plants/${plant.id}`} className="flex-1 hover:opacity-80 transition-opacity">
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
                      {getTentName(plant.tentId) && (
                        <p className="text-sm text-primary/80 mb-2">
                          📍 {getTentName(plant.tentId)}
                        </p>
                      )}
                      {plant.faseAtual && (
                        <div className="mb-2">
                          <Badge variant="default" className="text-xs">
                            {getPhaseLabel(plant.faseAtual)}
                            {plant.metodoAtual && ` • ${plant.metodoAtual}`}
                          </Badge>
                        </div>
                      )}
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
                    </Link>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/plants/edit/${plant.id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => printLabel(plant)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQR(showQR === plant.id ? null : plant.id!)}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{plant.apelido}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => handleDelete(plant.id!, e)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
                        <Link to={`/plants/${clone.id}`} className="flex-1 hover:opacity-80 transition-opacity">
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
                          {getTentName(clone.tentId) && (
                            <p className="text-sm text-primary/80 mb-2">
                              📍 {getTentName(clone.tentId)}
                            </p>
                          )}
                          {clone.faseAtual && (
                            <div className="mb-2">
                              <Badge variant="default" className="text-xs">
                                {getPhaseLabel(clone.faseAtual)}
                                {clone.metodoAtual && ` • ${clone.metodoAtual}`}
                              </Badge>
                            </div>
                          )}
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Geração {clone.geracao}</Badge>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/plants/edit/${clone.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => printLabel(clone)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQR(showQR === clone.id ? null : clone.id!)}
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{clone.apelido}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => handleDelete(clone.id!, e)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
