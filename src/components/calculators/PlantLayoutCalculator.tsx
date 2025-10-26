import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlantLayoutCalculator() {
  const [spaceWidth, setSpaceWidth] = useState(10);
  const [spaceLength, setSpaceLength] = useState(7);
  const [plantWidth, setPlantWidth] = useState(3);
  const [plantLength, setPlantLength] = useState(1);

  const calculateLayout = () => {
    const plantsWide = Math.floor(spaceWidth / plantWidth);
    const plantsLong = Math.floor(spaceLength / plantLength);
    const totalPlants = plantsWide * plantsLong;
    
    const roomAreaSqFt = spaceWidth * spaceLength * 10.7639; // m² to ft²
    const usedAreaSqFt = (plantsWide * plantWidth) * (plantsLong * plantLength) * 10.7639;
    const wastedSpace = roomAreaSqFt - usedAreaSqFt;
    const efficiency = (usedAreaSqFt / roomAreaSqFt) * 100;

    return {
      plantsWide,
      plantsLong,
      totalPlants,
      roomAreaSqFt: roomAreaSqFt.toFixed(2),
      usedAreaSqFt: usedAreaSqFt.toFixed(2),
      wastedSpace: wastedSpace.toFixed(2),
      efficiency: efficiency.toFixed(0)
    };
  };

  const results = calculateLayout();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout da Planta</CardTitle>
        <CardDescription>
          Esta calculadora fornece layouts quase ideais para plantas retangulares.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="spaceWidth">Largura do espaço de cultivo (m)</Label>
            <Input
              id="spaceWidth"
              type="number"
              value={spaceWidth}
              onChange={(e) => setSpaceWidth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spaceLength">Comprimento do espaço de cultivo (m)</Label>
            <Input
              id="spaceLength"
              type="number"
              value={spaceLength}
              onChange={(e) => setSpaceLength(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plantWidth">Largura da planta* (m)</Label>
            <Input
              id="plantWidth"
              type="number"
              value={plantWidth}
              onChange={(e) => setPlantWidth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plantLength">Comprimento da planta* (m)</Label>
            <Input
              id="plantLength"
              type="number"
              value={plantLength}
              onChange={(e) => setPlantLength(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          *Lembre-se de adicionar o espaçamento adequado entre as plantas, que é contado como parte do seu tamanho
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Layout da grade</div>
            <div className="text-xl font-bold">
              {results.plantsWide} plantas largas por {results.plantsLong} plantas longas
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total de plantas</div>
              <div className="text-2xl font-bold">{results.totalPlants} plantas</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Eficiência de espaço</div>
              <div className="text-2xl font-bold">{results.efficiency}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Área da sala</div>
              <div className="text-xl font-bold">{results.roomAreaSqFt} pés²</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Área utilizada</div>
              <div className="text-xl font-bold">{results.usedAreaSqFt} pés²</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Espaço desperdiçado</div>
              <div className="text-xl font-bold">{results.wastedSpace} pés²</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
