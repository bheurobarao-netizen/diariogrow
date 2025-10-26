import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VPDCalculator() {
  const [airTemp, setAirTemp] = useState(20);
  const [leafTemp, setLeafTemp] = useState(19);
  const [humidity, setHumidity] = useState(60);
  const [showEquations, setShowEquations] = useState(false);

  const calculateVPD = () => {
    const airVPSat = (610.78 * Math.exp((airTemp / (airTemp + 238.2)) * 17.2694)) / 1000;
    const leafVPSat = (610.78 * Math.exp((leafTemp / (leafTemp + 238.2)) * 17.2694)) / 1000;
    const naiveVPD = airVPSat * (1 - humidity / 100);
    const leafVPD = leafVPSat - airVPSat * humidity / 100;

    return {
      airVPSat: airVPSat.toFixed(4),
      leafVPSat: leafVPSat.toFixed(4),
      naiveVPD: naiveVPD.toFixed(4),
      leafVPD: leafVPD.toFixed(4)
    };
  };

  const results = calculateVPD();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Déficit de Pressão de Vapor (VPD)</CardTitle>
        <CardDescription>
          O déficit de pressão de vapor é a diferença entre o teor de umidade presente e saturado do ar e afeta a transpiração das plantas. 
          Para a maioria das plantas, um VPD entre 0,4 kPa e 1,25 kPa é o ideal; as condições ideais para a cannabis variam muito dependendo 
          da fonte, mas geralmente ficam em torno de 0,8 kPa a 1,2 kPa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible open={showEquations} onOpenChange={setShowEquations}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            {showEquations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showEquations ? "Ocultar equações" : "Mostrar equações"}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2 text-sm font-mono bg-muted p-4 rounded-md">
            <div>AirVPSat = 610,78 * e^(ambienteTempC / (ambienteTempC + 238,2) * 17,2694) / 1000</div>
            <div>FolhaVPSat = 610,78 * e^(folhaTempC / (folhaTempC + 238,2) * 17,2694) / 1000</div>
            <div>VPD ingênuo = AirVPSat * (1 - relHumidity / 100)</div>
            <div>Folha VPD = FolhaVPSat - ArVPSat * relUmidade / 100</div>
            <div className="text-xs text-muted-foreground mt-2">Fonte: https://getpulse.co/blog/vpd</div>
          </CollapsibleContent>
        </Collapsible>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="airTemp">Temperatura do ar (°C)</Label>
            <Input
              id="airTemp"
              type="number"
              value={airTemp}
              onChange={(e) => setAirTemp(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leafTemp">Temperatura da folha (°C)</Label>
            <Input
              id="leafTemp"
              type="number"
              value={leafTemp}
              onChange={(e) => setLeafTemp(Number(e.target.value))}
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

        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Ar VPSat</div>
            <div className="text-2xl font-bold">{results.airVPSat} kPa</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Folha VPSat</div>
            <div className="text-2xl font-bold">{results.leafVPSat} kPa</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">VPD ingênuo</div>
            <div className="text-2xl font-bold">{results.naiveVPD} kPa</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Folha VPD</div>
            <div className="text-2xl font-bold">{results.leafVPD} kPa</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
