import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OverallYieldCalculator() {
  const [minYieldPerPlant, setMinYieldPerPlant] = useState(40);
  const [avgYieldPerPlant, setAvgYieldPerPlant] = useState(55);
  const [maxYieldPerPlant, setMaxYieldPerPlant] = useState(80);
  const [plantCount, setPlantCount] = useState(10);

  const calculateYield = () => {
    const minYield = minYieldPerPlant * plantCount;
    const avgYield = avgYieldPerPlant * plantCount;
    const maxYield = maxYieldPerPlant * plantCount;

    return {
      minYield,
      avgYield,
      maxYield
    };
  };

  const results = calculateYield();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimento Geral da Cultura</CardTitle>
        <CardDescription>
          Calcule os rendimentos teóricos mínimo, médio e máximo, dado um número de plantas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minYieldPerPlant">Rendimento mínimo/planta (g)</Label>
            <Input
              id="minYieldPerPlant"
              type="number"
              value={minYieldPerPlant}
              onChange={(e) => setMinYieldPerPlant(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgYieldPerPlant">Rendimento médio/planta (g)</Label>
            <Input
              id="avgYieldPerPlant"
              type="number"
              value={avgYieldPerPlant}
              onChange={(e) => setAvgYieldPerPlant(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxYieldPerPlant">Rendimento máximo/planta (g)</Label>
            <Input
              id="maxYieldPerPlant"
              type="number"
              value={maxYieldPerPlant}
              onChange={(e) => setMaxYieldPerPlant(Number(e.target.value))}
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
