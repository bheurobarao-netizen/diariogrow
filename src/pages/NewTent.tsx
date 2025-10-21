import { useNavigate } from 'react-router-dom';
import { useTentStore } from '@/stores/tentStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const tentSchema = z.object({
  nome: z.string().optional(),
  alturaCm: z.coerce.number().optional(),
  profundidadeCm: z.coerce.number().optional(),
  cumprimentoCm: z.coerce.number().optional(),
  totalWatts: z.coerce.number().optional(),
  chipLed: z.string().optional(),
  driverLed: z.string().optional(),
  outrosEquipamentos: z.string().optional(),
  observacoes: z.string().optional(),
});

type TentFormData = z.infer<typeof tentSchema>;

const NewTent = () => {
  const navigate = useNavigate();
  const { createTent } = useTentStore();
  const { toast } = useToast();

  const form = useForm<TentFormData>({
    resolver: zodResolver(tentSchema),
    defaultValues: {
      nome: '',
      alturaCm: 0,
      profundidadeCm: 0,
      cumprimentoCm: 0,
      totalWatts: 0,
      chipLed: '',
      driverLed: '',
      outrosEquipamentos: '',
      observacoes: '',
    },
  });

  const onSubmit = async (data: TentFormData) => {
    try {
      await createTent({
        nome: data.nome || '',
        alturaCm: data.alturaCm || 0,
        profundidadeCm: data.profundidadeCm || 0,
        cumprimentoCm: data.cumprimentoCm || 0,
        iluminacao: {
          totalWatts: data.totalWatts || 0,
          chipLed: data.chipLed || '',
          driverLed: data.driverLed || '',
        },
        outrosEquipamentos: data.outrosEquipamentos,
        observacoes: data.observacoes,
      });

      toast({
        title: 'Sucesso',
        description: 'Tenda criada com sucesso!',
      });

      navigate('/tents');
    } catch (error) {
      console.error('Error creating tent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a tenda',
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
          onClick={() => navigate('/tents')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-primary">Nova Tenda</h1>
        <p className="text-muted-foreground mt-1">
          Cadastre uma nova tenda de cultivo
        </p>
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
                  <FormLabel>Nome da Tenda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tenda 1 (Veg)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dimensões (cm)</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cumprimentoCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cumprimento</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profundidadeCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alturaCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Lighting */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Iluminação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalWatts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potência Total (W)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chipLed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chip LED</FormLabel>
                      <FormControl>
                        <Input placeholder="Samsung LM301H" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driverLed"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Driver LED</FormLabel>
                      <FormControl>
                        <Input placeholder="Mean Well HLG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Observations */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionais sobre a tenda..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Other Equipment */}
            <FormField
              control={form.control}
              name="outrosEquipamentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outros Equipamentos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Exaustor 6 polegadas, Filtro de Carvão..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tents')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="gradient" className="flex-1 gap-2">
                <Save className="w-4 h-4" />
                Criar Tenda
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewTent;
