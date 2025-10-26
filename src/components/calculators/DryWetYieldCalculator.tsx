import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DryWetYieldCalculator() {
  const [minWetYield, setMinWetYield] = useState(40);
  const [avgWetYield, setAvgWetYield] = useState(55);
  const [maxWetYield, setMaxWetYield] = useState(80);
  const [plantCount, setPlantCount] = useState(10);
  const [dryingLoss, setDryingLoss] = useState(65);

  const calculateYield = () => {
    const retentionPercent = (100 - dryingLoss) / 100;
    const minYield = minWetYield * plantCount * retentionPercent;
    const avgYield = avgWetYield * plantCount * retentionPercent;
    const maxYield = maxWetYield * plantCount * retentionPercent;

    return {
      minYield: minYield.toFixed(1),
      avgYield: avgYield.toFixed(1),
      maxYield: maxYield.toFixed(1)
    };
  };

  const results = calculateYield();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimento Seco/Úmido</CardTitle>
        <CardDescription>
          Calcule os rendimentos teóricos mínimo, médio e máximo, dado um número de plantas com base nos pesos no momento da colheita.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minWetYield">Rendimento úmido mínimo/planta (g)</Label>
            <Input
              id="minWetYield"
              type="number"
              value={minWetYield}
              onChange={(e) => setMinWetYield(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgWetYield">Rendimento médio úmido/planta (g)</Label>
            <Input
              id="avgWetYield"
              type="number"
              value={avgWetYield}
              onChange={(e) => setAvgWetYield(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxWetYield">Rendimento máximo úmido/planta (g)</Label>
            <Input
              id="maxWetYield"
              type="number"
              value={maxWetYield}
              onChange={(e) => setMaxWetYield(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plantCount">Contagem de plantas</Label>
            <Input
              id="plantCount"
              type="number"
              value={plantCount}
              onChange={(e) => setPlantCount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dryingLoss">Perda por secagem* (%)</Label>
            <Input
              id="dryingLoss"
              type="number"
              value={dryingLoss}
              onChange={(e) => setDryingLoss(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          *Esta porcentagem representa a quantidade de matéria vegetal seca em comparação com a úmida — por exemplo, 
          30 gramas de matéria seca em 100 gramas de matéria úmida representariam uma perda de 70% por secagem.
        </div>

        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Rendimento mínimo</div>
            <div className="text-2xl font-bold">{results.minYield} g</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Rendimento médio</div>
            <div className="text-2xl font-bold">{results.avgYield} g</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Rendimento máximo</div>
            <div className="text-2xl font-bold">{results.maxYield} g</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
