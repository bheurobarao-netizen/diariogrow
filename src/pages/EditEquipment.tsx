import { useNavigate, useParams } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
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
  notas: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

const EditEquipment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getEquipment, updateEquipment } = useEquipmentStore();
  const { tents, fetchTents } = useTentStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

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
      notas: '',
    },
  });

  useEffect(() => {
    fetchTents();
  }, [fetchTents]);

  useEffect(() => {
    const loadEquipment = async () => {
      if (!id) return;
      
      try {
        const equipment = await getEquipment(Number(id));
        if (equipment) {
          form.reset({
            nome: equipment.nome,
            marca: equipment.marca,
            tipo: equipment.tipo,
            tentId: equipment.tentId,
            consumoWatts: equipment.consumoWatts,
            numeroTomadas: equipment.numeroTomadas,
            smartLife: equipment.smartLife || false,
            notas: equipment.notas,
          });
        }
      } catch (error) {
        console.error('Error loading equipment:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o equipamento',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id, getEquipment, form, toast]);

  const onSubmit = async (data: EquipmentFormData) => {
    if (!id) return;

    try {
      await updateEquipment(Number(id), {
        nome: data.nome || '',
        marca: data.marca,
        tipo: data.tipo || 'iluminacao',
        tentId: data.tentId || 0,
        consumoWatts: data.consumoWatts || 0,
        numeroTomadas: data.numeroTomadas || 1,
        smartLife: data.smartLife || false,
        notas: data.notas,
      });

      toast({
        title: 'Sucesso',
        description: 'Equipamento atualizado com sucesso!',
      });

      navigate('/equipment');
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o equipamento',
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
        <h1 className="text-3xl font-bold text-primary">Editar Equipamento</h1>
        <p className="text-muted-foreground mt-1">Atualize as informações do equipamento</p>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                    value={field.value?.toString()}
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
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditEquipment;
