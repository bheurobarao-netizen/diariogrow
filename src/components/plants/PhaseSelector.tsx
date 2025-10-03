import { PlantPhase, PLANT_PHASES } from '@/lib/phases';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PhaseSelectorProps {
  phase?: PlantPhase;
  method?: string;
  onPhaseChange: (phase: PlantPhase) => void;
  onMethodChange: (method: string) => void;
}

export const PhaseSelector = ({
  phase,
  method,
  onPhaseChange,
  onMethodChange,
}: PhaseSelectorProps) => {
  const currentPhaseInfo = phase ? PLANT_PHASES[phase] : null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phase">Fase Atual</Label>
        <Select value={phase} onValueChange={(value) => onPhaseChange(value as PlantPhase)}>
          <SelectTrigger id="phase">
            <SelectValue placeholder="Selecione a fase" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLANT_PHASES).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                {info.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentPhaseInfo && (
          <p className="text-xs text-muted-foreground">{currentPhaseInfo.description}</p>
        )}
      </div>

      {phase && currentPhaseInfo && (
        <div className="space-y-2">
          <Label htmlFor="method">Método / Meio</Label>
          <Select value={method} onValueChange={onMethodChange}>
            <SelectTrigger id="method">
              <SelectValue placeholder="Selecione o método" />
            </SelectTrigger>
            <SelectContent>
              {currentPhaseInfo.methods.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
