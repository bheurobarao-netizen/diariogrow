export type PlantPhase = 
  | 'germinacao_1'
  | 'germinacao_2'
  | 'germinacao_3'
  | 'muda'
  | 'vegetativo'
  | 'floracao'
  | 'flush'
  | 'secagem'
  | 'cura'
  | 'colhida';

export interface PhaseInfo {
  label: string;
  description: string;
  methods: string[];
}

export const PLANT_PHASES: Record<PlantPhase, PhaseInfo> = {
  germinacao_1: {
    label: 'Germinação - Fase 1',
    description: 'Primeira fase de germinação',
    methods: [
      'Copo de água 24h',
      'Copo de água 48h',
      'Hidratação direta',
      'Outro',
    ],
  },
  germinacao_2: {
    label: 'Germinação - Fase 2',
    description: 'Segunda fase de germinação',
    methods: [
      'Papel toalha',
      'Algodão úmido',
      'Esponja',
      'Outro',
    ],
  },
  germinacao_3: {
    label: 'Germinação - Fase 3',
    description: 'Terceira fase de germinação',
    methods: [
      'Aeroclonador',
      'Fibra de coco',
      'Jiffys',
      'Substrato leve',
      'Outro',
    ],
  },
  muda: {
    label: 'Muda',
    description: 'Fase de muda',
    methods: [
      'Aeroponia',
      'Fibra de coco',
      'Turfa',
      'Lã de rocha',
      'Substrato comercial',
      'Mix caseiro',
      'Outro',
    ],
  },
  vegetativo: {
    label: 'Vegetativo',
    description: 'Crescimento vegetativo',
    methods: [
      'Solo',
      'Hidroponia',
      'Aeroponia',
      'Coco',
      'Mix solo/coco',
      'Outdoor',
      'Outro',
    ],
  },
  floracao: {
    label: 'Floração',
    description: 'Período de floração',
    methods: [
      'Solo',
      'Hidroponia',
      'Aeroponia',
      'Coco',
      'Mix solo/coco',
      'Outdoor',
      'Outro',
    ],
  },
  flush: {
    label: 'Flush',
    description: 'Limpeza final',
    methods: [
      'Água pura',
      'Solução flush',
      'Outro',
    ],
  },
  secagem: {
    label: 'Secagem',
    description: 'Período de secagem',
    methods: [
      'Cabine de secagem',
      'Ambiente controlado',
      'Pendurado',
      'Em rede',
      'Outro',
    ],
  },
  cura: {
    label: 'Cura',
    description: 'Processo de cura',
    methods: [
      'Potes de vidro',
      'Bags especiais',
      'Boveda packs',
      'Outro',
    ],
  },
  colhida: {
    label: 'Colhida',
    description: 'Planta já colhida',
    methods: ['Finalizada'],
  },
};

export const getPhaseLabel = (phase: PlantPhase): string => {
  return PLANT_PHASES[phase]?.label || phase;
};

export const getPhaseColor = (phase: PlantPhase): string => {
  const colors: Record<PlantPhase, string> = {
    germinacao_1: 'bg-blue-500',
    germinacao_2: 'bg-blue-400',
    germinacao_3: 'bg-cyan-500',
    muda: 'bg-green-400',
    vegetativo: 'bg-green-600',
    floracao: 'bg-purple-500',
    flush: 'bg-orange-400',
    secagem: 'bg-amber-600',
    cura: 'bg-yellow-600',
    colhida: 'bg-gray-500',
  };
  return colors[phase] || 'bg-gray-400';
};
