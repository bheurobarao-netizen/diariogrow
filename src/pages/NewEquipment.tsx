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
  tipo: z.enum(['iluminacao', 'climatizacao', 'irrigacao', 'outro']).optional(),
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
      tipo: 'iluminacao',
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
        tipo: data.tipo || 'iluminacao',
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
                    <SelectContent>
                      <SelectItem value="iluminacao">Iluminação</SelectItem>
                      <SelectItem value="climatizacao">Climatização</SelectItem>
                      <SelectItem value="irrigacao">Irrigação</SelectItem>
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
