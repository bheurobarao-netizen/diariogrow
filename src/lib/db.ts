import Dexie, { Table } from 'dexie';
import { PlantPhase } from './phases';

export type { PlantPhase };

export interface Tent {
  id?: number;
  nome: string;
  alturaCm: number;
  profundidadeCm: number;
  cumprimentoCm: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id?: number;
  nome: string;
  marca?: string;
  tipo: 'iluminacao' | 'climatizacao' | 'irrigacao' | 'outro';
  tentId: number;
  consumoWatts: number;
  numeroTomadas: number;
  smartLife: boolean;
  notas?: string;
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
  paiId?: number; // NEW: Para breeding
  breedingEventId?: number; // NEW: Vincula à breeding event que gerou esta planta
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

export interface Task {
  id?: number;
  title: string;
  details?: string;
  dueDate: string;
  isComplete: boolean;
  plantId?: number;
  tentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BreedingEvent {
  id?: number;
  dataCruzamento: string;
  maeId: number;
  paiId: number;
  tipoResultado: 'semente' | 'polen';
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export class GrowDiaryDB extends Dexie {
  plants!: Table<Plant>;
  entries!: Table<Entry>;
  sharedLinks!: Table<SharedLink>;
  tents!: Table<Tent>;
  insumos!: Table<Insumo>;
  colheitas!: Table<Colheita>;
  curas!: Table<Cura>;
  tasks!: Table<Task>;
  breedingEvents!: Table<BreedingEvent>;
  equipment!: Table<Equipment>;

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
    
    // Version 5: Add tasks, breedingEvents and update plants with paiId
    this.version(5).stores({
      plants: '++id, codigo, maeId, paiId, origem, tentId, viva, createdAt',
      entries: '++id, date, plantId, tentId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt',
      tents: '++id, nome, createdAt',
      insumos: '++id, nomeProduto, tipo, createdAt',
      colheitas: '++id, plantId, dataColheita, createdAt',
      curas: '++id, colheitaId, poteNome, createdAt',
      tasks: '++id, dueDate, isComplete, plantId, tentId, createdAt',
      breedingEvents: '++id, dataCruzamento, maeId, paiId, createdAt'
    });
    
    // Version 6: Add equipment table and simplify tents (remove iluminacao)
    this.version(6).stores({
      plants: '++id, codigo, maeId, paiId, origem, tentId, viva, createdAt',
      entries: '++id, date, plantId, tentId, fase, createdAt',
      sharedLinks: '++id, token, entryId, expiresAt',
      tents: '++id, nome, createdAt',
      insumos: '++id, nomeProduto, tipo, createdAt',
      colheitas: '++id, plantId, dataColheita, createdAt',
      curas: '++id, colheitaId, poteNome, createdAt',
      tasks: '++id, dueDate, isComplete, plantId, tentId, createdAt',
      breedingEvents: '++id, dataCruzamento, maeId, paiId, createdAt',
      equipment: '++id, tentId, tipo, nome, createdAt'
    });
  }
}

export const db = new GrowDiaryDB();
