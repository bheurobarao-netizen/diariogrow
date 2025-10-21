import Dexie, { Table } from 'dexie';
import { PlantPhase } from './phases';

export type { PlantPhase };

export interface Tent {
  id?: number;
  nome: string;
  alturaCm: number;
  profundidadeCm: number;
  cumprimentoCm: number;
  iluminacao: {
    totalWatts: number;
    chipLed: string;
    driverLed: string;
  };
  outrosEquipamentos?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Insumo {
  id?: number;
  nomeProduto: string;
  marca?: string;
  tipo: 'nutriente' | 'suplemento' | 'pesticida' | 'substrato' | 'outro';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Colheita {
  id?: number;
  plantId: number;
  dataColheita: string;
  pesoUmidoManicurado?: number;
  dataInicioSecagem?: string;
  dataFimSecagem?: string;
  pesoSecoFinal?: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cura {
  id?: number;
  colheitaId: number;
  poteNome: string;
  pesoPote?: number;
  burpingRegistros: Array<{
    data: string;
    umidadePote?: number;
    notasAroma?: string;
  }>;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id?: number;
  codigo: string;
  apelido: string;
  especie: string;
  bancoSementes?: string;
  genetica: {
    indica: number;
    sativa: number;
    ruderalis: number;
  };
  origem: 'semente' | 'clone';
  maeId?: number;
  geracao: number;
  faseAtual?: PlantPhase;
  metodoAtual?: string;
  fenotipoNotas?: string;
  lote?: string;
  dataGerminacao?: string;
  dataNascimento?: string;
  viva: boolean;
  qrCodeData?: string;
  observacoes?: string;
  tentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id?: number;
  date: string;
  plantId?: number;
  tentId?: number;
  fase?: PlantPhase;
  
  // Ambiente
  temperaturaMin?: number;
  temperaturaMax?: number;
  umidadeMin?: number;
  umidadeMax?: number;
  distanciaLuzCm?: number;
  
  // Solução Nutritiva
  phAguaEntrada?: number;
  ecAguaEntrada?: number;
  volumeTotalLitros?: number;
  phAguaSaida?: number;
  ecAguaSaida?: number;
  
  // Nutrientes aplicados
  nutrientesAplicados: Array<{
    nomeNutriente: string;
    quantidade: number;
    unidade: 'g' | 'ml';
  }>;
  
  // Ações e Saúde
  acoesRealizadas: string[];
  problemasObservados: string[];
  acoesCorretivas: string[];
  
  // Mídia e observações
  content: string;
  photos: string[];
  videos: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface SharedLink {
  id?: number;
  token: string;
  entryId: number;
  expiresAt: string;
  createdAt: string;
}

export class GrowDiaryDB extends Dexie {
  plants!: Table<Plant>;
  entries!: Table<Entry>;
  sharedLinks!: Table<SharedLink>;
  tents!: Table<Tent>;
  insumos!: Table<Insumo>;
  colheitas!: Table<Colheita>;
  curas!: Table<Cura>;

  constructor() {
    super('GrowDiaryDB');
    this.version(1).stores({
      plants: '++id, codigo, maeId, viva, createdAt',
      entries: '++id, date, plantId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt'
    });
    
    // Version 2: Add origem index to plants table
    this.version(2).stores({
      plants: '++id, codigo, maeId, origem, viva, createdAt',
      entries: '++id, date, plantId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt'
    });
    
    // Version 3: Add tents table and tentId to plants
    this.version(3).stores({
      plants: '++id, codigo, maeId, origem, tentId, viva, createdAt',
      entries: '++id, date, plantId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt',
      tents: '++id, nome, createdAt'
    });
    
    // Version 4: Add insumos, colheitas, curas and update entries
    this.version(4).stores({
      plants: '++id, codigo, maeId, origem, tentId, viva, createdAt',
      entries: '++id, date, plantId, tentId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt',
      tents: '++id, nome, createdAt',
      insumos: '++id, nomeProduto, tipo, createdAt',
      colheitas: '++id, plantId, dataColheita, createdAt',
      curas: '++id, colheitaId, poteNome, createdAt'
    });
  }
}

export const db = new GrowDiaryDB();
