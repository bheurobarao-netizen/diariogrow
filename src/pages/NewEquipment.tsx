import { useNavigate } from 'react-router-dom';
import { useEquipmentStore } from '@/stores/equipmentStore';
import { useTentStore } from '@/stores/tentStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const equipmentSchema = z.object({
  nome: z.string().optional(),
  marca: z.string().optional(),
  tipo: z.enum([
    'climatizacao_exaustor', 'climatizacao_intrator', 'climatizacao_filtro', 'climatizacao_ventilador',
    'climatizacao_ar_condicionado', 'climatizacao_umidificador', 'climatizacao_desumidificador',
    'climatizacao_aquecedor', 'climatizacao_duto', 'climatizacao_controlador',
    'iluminacao_led', 'iluminacao_hps', 'iluminacao_mh', 'iluminacao_cmh', 'iluminacao_fluorescente',
    'iluminacao_reator', 'iluminacao_refletor', 'iluminacao_timer', 'iluminacao_medidor',
    'irrigacao_bomba_agua', 'irrigacao_bomba_ar', 'irrigacao_pedra_porosa', 'irrigacao_gotejamento',
    'irrigacao_reservatorio', 'irrigacao_filtro', 'irrigacao_chiller', 'irrigacao_medidor_ph',
    'irrigacao_medidor_ec', 'irrigacao_dosadora',
    'estrutura_tenda', 'estrutura_vaso', 'estrutura_hidroponico', 'estrutura_bandeja',
    'estrutura_rede_scrog', 'estrutura_suporte',
    'germinacao_domo', 'germinacao_bandeja', 'germinacao_manta', 'germinacao_clone_machine',
    'germinacao_tesoura',
    'sensor_temp_umidade', 'sensor_nivel_agua', 'sensor_ph', 'sensor_co2', 'sensor_camera',
    'iluminacao', 'climatizacao', 'irrigacao', 'outro' // Legado
  ]).optional(),
  tentId: z.coerce.number().optional(),
  consumoWatts: z.coerce.number().optional(),
  numeroTomadas: z.coerce.number().optional(),
  smartLife: z.boolean().default(false),
  smartLifeControlType: z.enum(['tomada', 'dimmer']).optional(),
  smartLifeControlModel: z.string().optional(),
  notas: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

const NewEquipment = () => {
  const navigate = useNavigate();
  const { createEquipment } = useEquipmentStore();
  const { tents, fetchTents } = useTentStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchTents();
  }, [fetchTents]);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      nome: '',
      marca: '',
      tipo: 'iluminacao_led',
      tentId: 0,
      consumoWatts: 0,
      numeroTomadas: 1,
      smartLife: false,
      smartLifeControlType: undefined,
      smartLifeControlModel: '',
      notas: '',
    },
  });

  const watchSmartLife = form.watch('smartLife');

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      await createEquipment({
        nome: data.nome || '',
        marca: data.marca,
        tipo: data.tipo || 'iluminacao_led',
        tentId: data.tentId || 0,
        consumoWatts: data.consumoWatts || 0,
        numeroTomadas: data.numeroTomadas || 1,
        smartLife: data.smartLife || false,
        smartLifeControlType: data.smartLifeControlType,
        smartLifeControlModel: data.smartLifeControlModel,
        notas: data.notas,
      });

      toast({
        title: 'Sucesso',
        description: 'Equipamento criado com sucesso!',
      });

      navigate('/equipment');
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o equipamento',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/equipment')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-primary">Novo Equipamento</h1>
        <p className="text-muted-foreground mt-1">Cadastre um novo equipamento</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Equipamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: LED Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marca */}
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Samsung, Mean Well..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Climatização</div>
                      <SelectItem value="climatizacao_exaustor">Exaustor (Saída)</SelectItem>
                      <SelectItem value="climatizacao_intrator">Intrator (Entrada)</SelectItem>
                      <SelectItem value="climatizacao_filtro">Filtro de Carvão</SelectItem>
                      <SelectItem value="climatizacao_ventilador">Ventilador de Circulação</SelectItem>
                      <SelectItem value="climatizacao_ar_condicionado">Ar Condicionado</SelectItem>
                      <SelectItem value="climatizacao_umidificador">Umidificador</SelectItem>
                      <SelectItem value="climatizacao_desumidificador">Desumidificador</SelectItem>
                      <SelectItem value="climatizacao_aquecedor">Aquecedor</SelectItem>
                      <SelectItem value="climatizacao_duto">Duto de Ar</SelectItem>
                      <SelectItem value="climatizacao_controlador">Controlador de Clima</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Iluminação</div>
                      <SelectItem value="iluminacao_led">Painel de LED</SelectItem>
                      <SelectItem value="iluminacao_hps">Lâmpada HPS</SelectItem>
                      <SelectItem value="iluminacao_mh">Lâmpada MH</SelectItem>
                      <SelectItem value="iluminacao_cmh">Lâmpada CMH</SelectItem>
                      <SelectItem value="iluminacao_fluorescente">Lâmpada Fluorescente</SelectItem>
                      <SelectItem value="iluminacao_reator">Reator</SelectItem>
                      <SelectItem value="iluminacao_refletor">Refletor</SelectItem>
                      <SelectItem value="iluminacao_timer">Timer</SelectItem>
                      <SelectItem value="iluminacao_medidor">Medidor de Luz</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Irrigação e Nutrição</div>
                      <SelectItem value="irrigacao_bomba_agua">Bomba de Água</SelectItem>
                      <SelectItem value="irrigacao_bomba_ar">Bomba de Ar</SelectItem>
                      <SelectItem value="irrigacao_pedra_porosa">Pedra Porosa</SelectItem>
                      <SelectItem value="irrigacao_gotejamento">Sistema de Gotejamento</SelectItem>
                      <SelectItem value="irrigacao_reservatorio">Reservatório de Água</SelectItem>
                      <SelectItem value="irrigacao_filtro">Filtro de Água</SelectItem>
                      <SelectItem value="irrigacao_chiller">Chiller de Água</SelectItem>
                      <SelectItem value="irrigacao_medidor_ph">Medidor de pH</SelectItem>
                      <SelectItem value="irrigacao_medidor_ec">Medidor de EC/TDS</SelectItem>
                      <SelectItem value="irrigacao_dosadora">Dosadora de Nutrientes</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Estrutura e Vasos</div>
                      <SelectItem value="estrutura_tenda">Tenda de Cultivo</SelectItem>
                      <SelectItem value="estrutura_vaso">Vaso</SelectItem>
                      <SelectItem value="estrutura_hidroponico">Sistema Hidropônico</SelectItem>
                      <SelectItem value="estrutura_bandeja">Bandeja de Drenagem</SelectItem>
                      <SelectItem value="estrutura_rede_scrog">Rede de SCROG</SelectItem>
                      <SelectItem value="estrutura_suporte">Suporte/Tutor</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Germinação e Clonagem</div>
                      <SelectItem value="germinacao_domo">Domo Propagador</SelectItem>
                      <SelectItem value="germinacao_bandeja">Bandeja de Células</SelectItem>
                      <SelectItem value="germinacao_manta">Manta Térmica</SelectItem>
                      <SelectItem value="germinacao_clone_machine">Clone Machine</SelectItem>
                      <SelectItem value="germinacao_tesoura">Lâmina/Tesoura de Clonagem</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Sensores e Medição</div>
                      <SelectItem value="sensor_temp_umidade">Sensor Temp/Umidade</SelectItem>
                      <SelectItem value="sensor_nivel_agua">Sensor de Nível de Água</SelectItem>
                      <SelectItem value="sensor_ph">Sensor de pH</SelectItem>
                      <SelectItem value="sensor_co2">Sensor de CO2</SelectItem>
                      <SelectItem value="sensor_camera">Câmera de Monitoramento</SelectItem>
                      
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Outros</div>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tenda */}
            <FormField
              control={form.control}
              name="tentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alocar na Tenda</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a tenda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tents.map((tent) => (
                        <SelectItem key={tent.id} value={tent.id!.toString()}>
                          {tent.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consumo e Tomadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="consumoWatts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumo (Watts)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroTomadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Tomadas</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Smart Life */}
            <FormField
              control={form.control}
              name="smartLife"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Smart Life</FormLabel>
                    <FormDescription>
                      Este equipamento é controlado por Smart Life?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Smart Life Control - Only show if smartLife is false */}
            {!watchSmartLife && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium text-sm">Controle Smart Life</h3>
                <FormField
                  control={form.control}
                  name="smartLifeControlType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Controle</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de controle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tomada">Tomada Smart Life</SelectItem>
                          <SelectItem value="dimmer">Dimmer Smart Life</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smartLifeControlModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo do Controle</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: TP-Link HS100, Sonoff..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Modelo da tomada ou dimmer Smart Life
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Notas */}
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o equipamento..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/equipment')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 gradient-primary gap-2">
                <Save className="w-4 h-4" />
                Criar Equipamento
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewEquipment;
