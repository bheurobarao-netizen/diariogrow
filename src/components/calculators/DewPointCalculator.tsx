import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DewPointCalculator() {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(65);
  const [showEquations, setShowEquations] = useState(false);

  const calculateDewPoint = () => {
    // Magnus formula constants (Bolton/Monthly Weather)
    const a = 6.112;
    const b = 17.67;
    const c = 243.5;

    const vaporPressureHelper = Math.log(humidity / 100) + ((b * temperature) / (c + temperature));
    const dewPoint = (c * vaporPressureHelper) / (b - vaporPressureHelper);

    return dewPoint.toFixed(3);
  };

  const dewPoint = calculateDewPoint();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ponto de Orvalho</CardTitle>
        <CardDescription>
          Determinar o ponto de orvalho usando a fórmula de Magnus.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible open={showEquations} onOpenChange={setShowEquations}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            {showEquations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showEquations ? "Ocultar equações" : "Mostrar equações"}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2 text-sm font-mono bg-muted p-4 rounded-md">
            <div className="font-bold mb-2">Fórmula de Magnus:</div>
            <div>Constantes: a = 6,112 mb, b = 17,67, c = 243,5 °C (Bolton/Monthly Weather)</div>
            <div className="mt-2">[ValorAuxiliarDePressãoDeVapor = ln(Hum.Rel. / 100) + ((b * Temp) / (c + Temp))]</div>
            <div>Ponto de orvalho/geada = (c * VaporPressureHelperValue) / (b - VaporPressureHelperValue)</div>
          </CollapsibleContent>
        </Collapsible>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="humidity">Umidade relativa (%)</Label>
            <Input
              id="humidity"
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Ponto de orvalho</div>
            <div className="text-3xl font-bold">{dewPoint} °C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
