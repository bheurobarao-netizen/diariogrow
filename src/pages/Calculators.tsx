import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import VPDCalculator from "@/components/calculators/VPDCalculator";
import GrowthScheduleCalculator from "@/components/calculators/GrowthScheduleCalculator";
import PlantLayoutCalculator from "@/components/calculators/PlantLayoutCalculator";
import DryWetYieldCalculator from "@/components/calculators/DryWetYieldCalculator";
import ExtractionEfficiencyCalculator from "@/components/calculators/ExtractionEfficiencyCalculator";
import OverallYieldCalculator from "@/components/calculators/OverallYieldCalculator";
import DewPointCalculator from "@/components/calculators/DewPointCalculator";

export default function Calculators() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Calculadoras</h1>
      </div>

      <Tabs defaultValue="vpd" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto">
          <TabsTrigger value="vpd">VPD</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="dry-wet">Seco/Úmido</TabsTrigger>
          <TabsTrigger value="extraction">Extração</TabsTrigger>
          <TabsTrigger value="overall">Rendimento</TabsTrigger>
          <TabsTrigger value="dewpoint">Ponto Orvalho</TabsTrigger>
        </TabsList>

        <TabsContent value="vpd">
          <VPDCalculator />
        </TabsContent>

        <TabsContent value="schedule">
          <GrowthScheduleCalculator />
        </TabsContent>

        <TabsContent value="layout">
          <PlantLayoutCalculator />
        </TabsContent>

        <TabsContent value="dry-wet">
          <DryWetYieldCalculator />
        </TabsContent>

        <TabsContent value="extraction">
          <ExtractionEfficiencyCalculator />
        </TabsContent>

        <TabsContent value="overall">
          <OverallYieldCalculator />
        </TabsContent>

        <TabsContent value="dewpoint">
          <DewPointCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
