import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTentStore } from '@/stores/tentStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Tent } from '@/lib/db';

const tentSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  alturaCm: z.coerce.number().min(1, 'Altura deve ser maior que 0'),
  profundidadeCm: z.coerce.number().min(1, 'Profundidade deve ser maior que 0'),
  cumprimentoCm: z.coerce.number().min(1, 'Cumprimento deve ser maior que 0'),
  totalWatts: z.coerce.number().min(1, 'Potência deve ser maior que 0'),
  chipLed: z.string().min(1, 'Chip LED é obrigatório'),
  driverLed: z.string().min(1, 'Driver LED é obrigatório'),
  observacoes: z.string().optional(),
});

type TentFormData = z.infer<typeof tentSchema>;

const EditTent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTent, updateTent } = useTentStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<TentFormData>({
    resolver: zodResolver(tentSchema),
  });

  useEffect(() => {
    const loadTent = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const tent = await getTent(Number(id));
        if (tent) {
          form.reset({
            nome: tent.nome,
            alturaCm: tent.alturaCm,
            profundidadeCm: tent.profundidadeCm,
            cumprimentoCm: tent.cumprimentoCm,
            totalWatts: tent.iluminacao.totalWatts,
            chipLed: tent.iluminacao.chipLed,
            driverLed: tent.iluminacao.driverLed,
            observacoes: tent.observacoes || '',
          });
        }
      } catch (error) {
        console.error('Error loading tent:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a tenda',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTent();
  }, [id, getTent, form, toast]);

  const onSubmit = async (data: TentFormData) => {
    if (!id) return;

    try {
      await updateTent(Number(id), {
        nome: data.nome,
        alturaCm: data.alturaCm,
        profundidadeCm: data.profundidadeCm,
        cumprimentoCm: data.cumprimentoCm,
        iluminacao: {
          totalWatts: data.totalWatts,
          chipLed: data.chipLed,
          driverLed: data.driverLed,
        },
        observacoes: data.observacoes,
      });

      toast({
        title: 'Sucesso',
        description: 'Tenda atualizada com sucesso!',
      });

      navigate('/tents');
    } catch (error) {
      console.error('Error updating tent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a tenda',
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
          onClick={() => navigate('/tents')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-primary">Editar Tenda</h1>
        <p className="text-muted-foreground mt-1">
          Atualize as informações da tenda
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
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditTent;
