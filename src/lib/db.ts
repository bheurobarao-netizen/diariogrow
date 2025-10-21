import Dexie, { Table } from 'dexie';
import { PlantPhase } from './phases';

export type { PlantPhase };

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
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id?: number;
  date: string;
  plantId?: number;
  fase?: PlantPhase;
  estufa?: string;
  cepa?: string;
  content: string;
  photos: string[];
  videos: string[];
  nutrientes?: string;
  ec?: number;
  ph?: number;
  temperatura?: number;
  umidade?: number;
  luz?: string;
  checklist: string[];
  problemas: string[];
  solucoes: string[];
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
  }
}

export const db = new GrowDiaryDB();
