import { useEffect, useState, useMemo } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEntryStore } from '@/stores/entryStore';
import { usePlantStore } from '@/stores/plantStore';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Leaf, Droplets, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { entries, fetchEntries, loading } = useEntryStore();
  const { plants, fetchPlants } = usePlantStore();

  useEffect(() => {
    fetchEntries();
    fetchPlants();
  }, [fetchEntries, fetchPlants]);

  // Filter entries for selected date
  const entriesForSelectedDate = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = parseISO(entry.date);
      return isSameDay(entryDate, selectedDate);
    });
  }, [entries, selectedDate]);

  // Get dates that have entries (for dots)
  const datesWithEntries = useMemo(() => {
    return entries.map((entry) => parseISO(entry.date));
  }, [entries]);

  const getPlantName = (plantId?: number) => {
    if (!plantId) return 'Planta não especificada';
    const plant = plants.find((p) => p.id === plantId);
    return plant ? `${plant.apelido} (${plant.codigo})` : 'Planta desconhecida';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <CalendarIcon className="w-8 h-8" />
          Calendário
        </h1>
        <p className="text-muted-foreground mt-1">Visualize suas entradas por data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar Component */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecione uma data</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                hasEntry: datesWithEntries,
              }}
              modifiersStyles={{
                hasEntry: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'hsl(var(--primary))',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {entriesForSelectedDate.length === 0 ? (
                <p>Nenhum registro encontrado para este dia.</p>
              ) : (
                <p>{entriesForSelectedDate.length} registro(s) encontrado(s)</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries for Selected Date */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Registros do Dia</h2>

        {entriesForSelectedDate.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum registro para este dia</h3>
            <p className="text-muted-foreground">
              Selecione outra data ou crie um novo registro.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entriesForSelectedDate.map((entry) => {
              const plantName = getPlantName(entry.plantId);

              return (
                <Card key={entry.id} className="hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6 space-y-4">
                    {/* Plant Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Leaf className="w-5 h-5" />
                        {plantName}
                      </div>
                      {entry.fase && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
                          {entry.fase}
                        </span>
                      )}
                    </div>

                    {/* Entry Content */}
                    {entry.content && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground">{entry.content}</p>
                      </div>
                    )}

                    {/* Photos Gallery */}
                    {entry.photos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Fotos</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {entry.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {entry.videos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Vídeos</h4>
                        <div className="space-y-2">
                          {entry.videos.map((video, index) => (
                            <video
                              key={index}
                              src={video}
                              controls
                              className="w-full rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Environmental Data */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {entry.temperaturaMin && entry.temperaturaMax && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4" />
                          <span>
                            Temp: {entry.temperaturaMin}-{entry.temperaturaMax}°C
                          </span>
                        </div>
                      )}
                      {entry.umidadeMin && entry.umidadeMax && (
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4" />
                          <span>
                            Umidade: {entry.umidadeMin}-{entry.umidadeMax}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nutrient Solution Data */}
                    {(entry.phAguaEntrada ||
                      entry.ecAguaEntrada ||
                      entry.nutrientesAplicados.length > 0) && (
                      <div className="border-t pt-4 space-y-2">
                        <h4 className="text-sm font-medium">Solução Nutritiva</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {entry.phAguaEntrada && (
                            <div>
                              <span className="text-muted-foreground">pH Entrada: </span>
                              <span className="font-medium">{entry.phAguaEntrada}</span>
                            </div>
                          )}
                          {entry.phAguaSaida && (
                            <div>
                              <span className="text-muted-foreground">pH Saída: </span>
                              <span className="font-medium">{entry.phAguaSaida}</span>
                            </div>
                          )}
                          {entry.ecAguaEntrada && (
                            <div>
                              <span className="text-muted-foreground">EC Entrada: </span>
                              <span className="font-medium">{entry.ecAguaEntrada}</span>
                            </div>
                          )}
                          {entry.ecAguaSaida && (
                            <div>
                              <span className="text-muted-foreground">EC Saída: </span>
                              <span className="font-medium">{entry.ecAguaSaida}</span>
                            </div>
                          )}
                        </div>

                        {entry.nutrientesAplicados.length > 0 && (
                          <div>
                            <span className="text-muted-foreground text-sm">
                              Nutrientes Aplicados:{' '}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.nutrientesAplicados.map((nutriente, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                                >
                                  {nutriente.nomeNutriente} - {nutriente.quantidade}
                                  {nutriente.unidade}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions and Problems */}
                    {(entry.acoesRealizadas.length > 0 ||
                      entry.problemasObservados.length > 0 ||
                      entry.acoesCorretivas.length > 0) && (
                      <div className="border-t pt-4 space-y-3">
                        {entry.acoesRealizadas.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Ações Realizadas</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {entry.acoesRealizadas.map((acao, index) => (
                                <li key={index}>{acao}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {entry.problemasObservados.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Problemas Observados</h4>
                            <ul className="list-disc list-inside text-sm text-destructive">
                              {entry.problemasObservados.map((problema, index) => (
                                <li key={index}>{problema}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {entry.acoesCorretivas.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Ações Corretivas</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {entry.acoesCorretivas.map((acao, index) => (
                                <li key={index}>{acao}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link to full entry */}
                    <div className="border-t pt-4">
                      <Link
                        to={`/entry/${entry.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Ver detalhes completos →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
