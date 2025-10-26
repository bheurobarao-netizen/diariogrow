import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";

export default function GrowthScheduleCalculator() {
  const [plantDate, setPlantDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [daysToSprout, setDaysToSprout] = useState(6);
  const [daysVegetative, setDaysVegetative] = useState(28);
  const [daysFlowering, setDaysFlowering] = useState(49);
  const [daysDrying, setDaysDrying] = useState(7);
  const [daysCuring, setDaysCuring] = useState(28);
  const [daysProcessing, setDaysProcessing] = useState(0);

  const calculateDates = () => {
    const start = new Date(plantDate);
    const sprouted = addDays(start, daysToSprout);
    const floweringStart = addDays(sprouted, daysVegetative);
    const harvest = addDays(floweringStart, daysFlowering);
    const dryingComplete = addDays(harvest, daysDrying);
    const curingComplete = addDays(dryingComplete, daysCuring);
    const processingComplete = addDays(curingComplete, daysProcessing);

    return {
      sprouted: format(sprouted, "yyyy-MM-dd"),
      floweringStart: format(floweringStart, "yyyy-MM-dd"),
      harvest: format(harvest, "yyyy-MM-dd"),
      dryingComplete: format(dryingComplete, "yyyy-MM-dd"),
      curingComplete: format(curingComplete, "yyyy-MM-dd"),
      processingComplete: format(processingComplete, "yyyy-MM-dd")
    };
  };

  const dates = calculateDates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma/Calendário de Crescimento Projetado</CardTitle>
        <CardDescription>
          Determine datas no calendário para momentos importantes na vida de suas plantas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="plantDate">Data da planta (AAAA-MM-DD)</Label>
            <Input
              id="plantDate"
              type="date"
              value={plantDate}
              onChange={(e) => setPlantDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysToSprout">Dias para brotar</Label>
            <Input
              id="daysToSprout"
              type="number"
              value={daysToSprout}
              onChange={(e) => setDaysToSprout(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysVegetative">Dias Vegetativos</Label>
            <Input
              id="daysVegetative"
              type="number"
              value={daysVegetative}
              onChange={(e) => setDaysVegetative(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysFlowering">Dias de floração</Label>
            <Input
              id="daysFlowering"
              type="number"
              value={daysFlowering}
              onChange={(e) => setDaysFlowering(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysDrying">Dias de secagem</Label>
            <Input
              id="daysDrying"
              type="number"
              value={daysDrying}
              onChange={(e) => setDaysDrying(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysCuring">Dias de cura</Label>
            <Input
              id="daysCuring"
              type="number"
              value={daysCuring}
              onChange={(e) => setDaysCuring(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysProcessing">Dias de processamento</Label>
            <Input
              id="daysProcessing"
              type="number"
              value={daysProcessing}
              onChange={(e) => setDaysProcessing(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Brotou</div>
            <div className="text-xl font-bold">{dates.sprouted}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Início da floração</div>
            <div className="text-xl font-bold">{dates.floweringStart}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Colheita</div>
            <div className="text-xl font-bold">{dates.harvest}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Secagem concluída</div>
            <div className="text-xl font-bold">{dates.dryingComplete}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Cura concluída</div>
            <div className="text-xl font-bold">{dates.curingComplete}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Processamento concluído</div>
            <div className="text-xl font-bold">{dates.processingComplete}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
