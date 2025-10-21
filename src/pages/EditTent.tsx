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

const tentSchema = z.object({
  nome: z.string().optional(),
  alturaCm: z.coerce.number().optional(),
  profundidadeCm: z.coerce.number().optional(),
  cumprimentoCm: z.coerce.number().optional(),
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
        nome: data.nome || '',
        alturaCm: data.alturaCm || 0,
        profundidadeCm: data.profundidadeCm || 0,
        cumprimentoCm: data.cumprimentoCm || 0,
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
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tenda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tenda Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dimensões (cm)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cumprimentoCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprimento</FormLabel>
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tents')}
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

export default EditTent;
