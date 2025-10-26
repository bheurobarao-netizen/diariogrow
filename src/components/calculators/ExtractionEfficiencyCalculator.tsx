import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExtractionEfficiencyCalculator() {
  const [materialWeight, setMaterialWeight] = useState(500);
  const [materialTHC, setMaterialTHC] = useState(25);
  const [extractWeight, setExtractWeight] = useState(96);
  const [extractTHC, setExtractTHC] = useState(85);
  const [showEquations, setShowEquations] = useState(false);

  const calculateEfficiency = () => {
    const weightYield = (extractWeight / materialWeight) * 100;
    const totalMaterialTHC = (materialTHC / 100) * materialWeight;
    const totalExtractTHC = (extractTHC / 100) * extractWeight;
    const extractionEfficiency = (totalExtractTHC / totalMaterialTHC) * 100;

    return {
      weightYield: weightYield.toFixed(1),
      totalMaterialTHC: totalMaterialTHC.toFixed(1),
      totalExtractTHC: totalExtractTHC.toFixed(1),
      extractionEfficiency: extractionEfficiency.toFixed(2)
    };
  };

  const results = calculateEfficiency();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eficiência de Extração</CardTitle>
        <CardDescription>
          Ao produzir extratos, a eficiência do processo (quanto extrato é produzido por unidade de matéria-prima) é importante, 
          mas é amplamente ofuscada pela eficiência da extração — quanto do THC presente na matéria-prima é incorporado ao extrato.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible open={showEquations} onOpenChange={setShowEquations}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            {showEquations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showEquations ? "Ocultar equações" : "Mostrar equações"}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2 text-sm font-mono bg-muted p-4 rounded-md">
            <div>Rendimento em peso = Peso do extrato / Peso da matéria-prima</div>
            <div>THC total da matéria-prima = Conteúdo de THC da matéria-prima * Peso da matéria-prima</div>
            <div>Extrato Total de THC = Conteúdo de THC do Extrato * Peso do Extrato</div>
            <div>Eficiência de Extração = THC Total do Extrato / THC Total da Matéria-Prima</div>
          </CollapsibleContent>
        </Collapsible>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="materialWeight">Peso da matéria-prima (g)</Label>
            <Input
              id="materialWeight"
              type="number"
              value={materialWeight}
              onChange={(e) => setMaterialWeight(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialTHC">Conteúdo de THC da matéria-prima (%)</Label>
            <Input
              id="materialTHC"
              type="number"
              value={materialTHC}
              onChange={(e) => setMaterialTHC(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extractWeight">Peso do extrato (g)</Label>
            <Input
              id="extractWeight"
              type="number"
              value={extractWeight}
              onChange={(e) => setExtractWeight(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extractTHC">Extrair conteúdo de THC (%)</Label>
            <Input
              id="extractTHC"
              type="number"
              value={extractTHC}
              onChange={(e) => setExtractTHC(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Rendimento de peso</div>
            <div className="text-2xl font-bold">{results.weightYield}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Eficiência de extração</div>
            <div className="text-2xl font-bold">{results.extractionEfficiency}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total de matéria-prima THC</div>
            <div className="text-xl font-bold">{results.totalMaterialTHC} g</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Extrato Total THC</div>
            <div className="text-xl font-bold">{results.totalExtractTHC} g</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
