import { db } from './db';

export interface BackupData {
  version: number;
  timestamp: string;
  userEmail: string;
  data: {
    plants: any[];
    entries: any[];
    sharedLinks: any[];
    tents: any[];
    insumos: any[];
    colheitas: any[];
    curas: any[];
    tasks: any[];
    breedingEvents: any[];
    equipment: any[];
  };
}

/**
 * Exporta todos os dados do banco local para um objeto JSON
 */
export async function exportBackup(userEmail: string): Promise<BackupData> {
  const [
    plants,
    entries,
    sharedLinks,
    tents,
    insumos,
    colheitas,
    curas,
    tasks,
    breedingEvents,
    equipment,
  ] = await Promise.all([
    db.plants.toArray(),
    db.entries.toArray(),
    db.sharedLinks.toArray(),
    db.tents.toArray(),
    db.insumos.toArray(),
    db.colheitas.toArray(),
    db.curas.toArray(),
    db.tasks.toArray(),
    db.breedingEvents.toArray(),
    db.equipment.toArray(),
  ]);

  return {
    version: 1,
    timestamp: new Date().toISOString(),
    userEmail,
    data: {
      plants,
      entries,
      sharedLinks,
      tents,
      insumos,
      colheitas,
      curas,
      tasks,
      breedingEvents,
      equipment,
    },
  };
}

/**
 * Baixa o backup como arquivo JSON
 */
export function downloadBackup(backup: BackupData): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `grow-diary-backup-${backup.timestamp.split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importa dados de um backup
 * @param backup - Dados do backup a serem importados
 * @param mode - 'merge' (mesclar) ou 'replace' (substituir tudo)
 */
export async function importBackup(
  backup: BackupData,
  mode: 'merge' | 'replace' = 'merge'
): Promise<void> {
  if (backup.version !== 1) {
    throw new Error('Versão de backup incompatível');
  }

  if (mode === 'replace') {
    // Limpa todos os dados existentes
    await Promise.all([
      db.plants.clear(),
      db.entries.clear(),
      db.sharedLinks.clear(),
      db.tents.clear(),
      db.insumos.clear(),
      db.colheitas.clear(),
      db.curas.clear(),
      db.tasks.clear(),
      db.breedingEvents.clear(),
      db.equipment.clear(),
    ]);
  }

  // Importa os dados
  await Promise.all([
    db.plants.bulkPut(backup.data.plants),
    db.entries.bulkPut(backup.data.entries),
    db.sharedLinks.bulkPut(backup.data.sharedLinks),
    db.tents.bulkPut(backup.data.tents),
    db.insumos.bulkPut(backup.data.insumos),
    db.colheitas.bulkPut(backup.data.colheitas),
    db.curas.bulkPut(backup.data.curas),
    db.tasks.bulkPut(backup.data.tasks),
    db.breedingEvents.bulkPut(backup.data.breedingEvents),
    db.equipment.bulkPut(backup.data.equipment),
  ]);
}

/**
 * Lê um arquivo de backup
 */
export async function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        resolve(backup);
      } catch (error) {
        reject(new Error('Arquivo de backup inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}

/**
 * Valida um arquivo de backup
 */
export function validateBackup(backup: any): backup is BackupData {
  return (
    backup &&
    typeof backup === 'object' &&
    backup.version === 1 &&
    backup.timestamp &&
    backup.userEmail &&
    backup.data &&
    Array.isArray(backup.data.plants) &&
    Array.isArray(backup.data.entries)
  );
}
