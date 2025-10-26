import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipmentStore } from '@/stores/equipmentStore';
import { useTentStore } from '@/stores/tentStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Zap, Home } from 'lucide-react';
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

const Equipment = () => {
  const navigate = useNavigate();
  const { equipment, fetchEquipment, deleteEquipment, loading } = useEquipmentStore();
  const { tents, fetchTents } = useTentStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
    fetchTents();
  }, [fetchEquipment, fetchTents]);

  const getTentName = (tentId: number) => {
    const tent = tents.find((t) => t.id === tentId);
    return tent?.nome || 'Tenda não encontrada';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      // Climatização
      climatizacao_exaustor: 'Exaustor',
      climatizacao_intrator: 'Intrator',
      climatizacao_filtro: 'Filtro de Carvão',
      climatizacao_ventilador: 'Ventilador',
      climatizacao_ar_condicionado: 'Ar Condicionado',
      climatizacao_umidificador: 'Umidificador',
      climatizacao_desumidificador: 'Desumidificador',
      climatizacao_aquecedor: 'Aquecedor',
      climatizacao_duto: 'Duto de Ar',
      climatizacao_controlador: 'Controlador Clima',
      // Iluminação
      iluminacao_led: 'LED',
      iluminacao_hps: 'HPS',
      iluminacao_mh: 'MH',
      iluminacao_cmh: 'CMH',
      iluminacao_fluorescente: 'Fluorescente',
      iluminacao_reator: 'Reator',
      iluminacao_refletor: 'Refletor',
      iluminacao_timer: 'Timer',
      iluminacao_medidor: 'Medidor Luz',
      // Irrigação
      irrigacao_bomba_agua: 'Bomba Água',
      irrigacao_bomba_ar: 'Bomba Ar',
      irrigacao_pedra_porosa: 'Pedra Porosa',
      irrigacao_gotejamento: 'Gotejamento',
      irrigacao_reservatorio: 'Reservatório',
      irrigacao_filtro: 'Filtro Água',
      irrigacao_chiller: 'Chiller',
      irrigacao_medidor_ph: 'Medidor pH',
      irrigacao_medidor_ec: 'Medidor EC',
      irrigacao_dosadora: 'Dosadora',
      // Estrutura
      estrutura_tenda: 'Tenda',
      estrutura_vaso: 'Vaso',
      estrutura_hidroponico: 'Hidropônico',
      estrutura_bandeja: 'Bandeja',
      estrutura_rede_scrog: 'SCROG',
      estrutura_suporte: 'Suporte',
      // Germinação
      germinacao_domo: 'Domo',
      germinacao_bandeja: 'Bandeja',
      germinacao_manta: 'Manta Térmica',
      germinacao_clone_machine: 'Clone Machine',
      germinacao_tesoura: 'Tesoura',
      // Sensores
      sensor_temp_umidade: 'Termo-Higrômetro',
      sensor_nivel_agua: 'Nível Água',
      sensor_ph: 'Sensor pH',
      sensor_co2: 'Sensor CO2',
      sensor_camera: 'Câmera',
      // Legado/Outros
      iluminacao: 'Iluminação',
      climatizacao: 'Climatização',
      irrigacao: 'Irrigação',
      outro: 'Outro',
    };
    return labels[tipo] || tipo;
  };

  const handleDelete = async (id: number, nome: string) => {
    try {
      await deleteEquipment(id);
      toast({
        title: 'Equipamento excluído',
        description: `${nome} foi removido com sucesso`,
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o equipamento',
        variant: 'destructive',
      });
    }
  };

  // Group equipment by tent
  const equipmentByTent = tents.map((tent) => ({
    tent,
    items: equipment.filter((e) => e.tentId === tent.id),
  }));

  // Calculate total price of all equipment
  const totalPrice = equipment.reduce((sum, item) => sum + (item.preco || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Zap className="w-8 h-8" />
            Equipamentos
          </h1>
          <p className="text-muted-foreground mt-1">Gerenciamento de hardware</p>
          {equipment.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-semibold">Investimento Total:</span> R$ {totalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <Button onClick={() => navigate('/equipment/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Equipamento
        </Button>
      </div>

      {equipment.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum equipamento cadastrado</h2>
          <p className="text-muted-foreground mb-4">
            Adicione os equipamentos das suas tendas
          </p>
          <Button onClick={() => navigate('/equipment/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Equipamento
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {equipmentByTent.map(({ tent, items }) => {
            if (items.length === 0) return null;

            const totalWatts = items.reduce((sum, item) => sum + item.consumoWatts, 0);
            const totalTomadas = items.reduce((sum, item) => sum + item.numeroTomadas, 0);

            return (
              <div key={tent.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">{tent.nome}</h2>
                    <Badge variant="secondary">
                      {totalWatts}W • {totalTomadas} tomada{totalTomadas !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.nome}</h3>
                          {item.marca && (
                            <p className="text-sm text-muted-foreground">{item.marca}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            {getTipoLabel(item.tipo)}
                          </span>
                          {item.smartLife && (
                            <Badge variant="secondary" className="text-xs">
                              Smart Life
                            </Badge>
                          )}
                          {!item.smartLife && item.smartLifeControlType && (
                            <Badge variant="outline" className="text-xs">
                              {item.smartLifeControlType === 'tomada' ? 'Tomada' : 'Dimmer'} Smart Life
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Consumo</p>
                          <p className="font-medium">{item.consumoWatts}W</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Tomadas</p>
                          <p className="font-medium">{item.numeroTomadas}</p>
                        </div>
                        {item.preco && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground text-xs">Preço</p>
                            <p className="font-medium">R$ {item.preco.toFixed(2)}</p>
                          </div>
                        )}
                      </div>

                      {!item.smartLife && item.smartLifeControlModel && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Controle:</span> {item.smartLifeControlModel}
                        </div>
                      )}

                      {item.notas && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.notas}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/equipment/edit/${item.id}`)}
                          className="flex-1 gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-1">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{item.nome}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id!, item.nome)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Equipment;
