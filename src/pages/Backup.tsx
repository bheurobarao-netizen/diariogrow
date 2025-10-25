import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  exportBackup,
  downloadBackup,
  importBackup,
  readBackupFile,
  validateBackup,
  BackupData,
} from '@/lib/backup';
import {
  ArrowLeft,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Loader2,
} from 'lucide-react';

const Backup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [backupInfo, setBackupInfo] = useState<BackupData | null>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const backup = await exportBackup();
      downloadBackup(backup);

      toast({
        title: 'Backup criado com sucesso',
        description: `${backup.data.plants.length} plantas, ${backup.data.entries.length} entradas exportadas`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar backup',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const backup = await readBackupFile(file);
      
      if (!validateBackup(backup)) {
        throw new Error('Arquivo de backup inválido ou corrompido');
      }

      setBackupInfo(backup);
      toast({
        title: 'Backup carregado',
        description: 'Revise as informações e escolha o modo de importação',
      });
    } catch (error) {
      toast({
        title: 'Erro ao ler arquivo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      setBackupInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!backupInfo) return;

    setLoading(true);
    try {
      await importBackup(backupInfo, importMode);
      
      toast({
        title: 'Backup importado com sucesso',
        description: 'Os dados foram restaurados',
      });

      // Recarrega a página para atualizar todos os dados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        title: 'Erro ao importar backup',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Backup e Restauração</h1>
          <p className="text-muted-foreground">
            Faça backup dos seus dados para uso offline ou restaure de um backup anterior
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Exportar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Backup
            </CardTitle>
            <CardDescription>
              Baixe todos os seus dados em um arquivo JSON para backup offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                O backup incluirá todas as plantas, entradas, equipamentos, insumos, colheitas,
                tarefas e eventos de breeding.
              </AlertDescription>
            </Alert>
            <Button onClick={handleExport} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando backup...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Importar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Backup
            </CardTitle>
            <CardDescription>
              Restaure seus dados de um arquivo de backup anterior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> A importação pode sobrescrever seus dados atuais.
                Recomendamos fazer um backup antes de importar.
              </AlertDescription>
            </Alert>

            <div>
              <Label
                htmlFor="backup-file"
                className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/25 hover:border-primary"
              >
                <div className="text-center">
                  <FileJson className="mx-auto h-12 w-12 text-muted-foreground" />
                  <span className="mt-2 block text-sm font-medium">
                    {backupInfo ? backupInfo.userEmail : 'Selecione um arquivo de backup'}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Arquivo JSON (*.json)
                  </span>
                </div>
                <input
                  id="backup-file"
                  type="file"
                  className="hidden"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  disabled={loading}
                />
              </Label>
            </div>

            {backupInfo && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-semibold mb-2">Informações do Backup</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Data:</dt>
                      <dd className="font-medium">
                        {new Date(backupInfo.timestamp).toLocaleString('pt-BR')}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Usuário:</dt>
                      <dd className="font-medium">{backupInfo.userEmail}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plantas:</dt>
                      <dd className="font-medium">{backupInfo.data.plants.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Entradas:</dt>
                      <dd className="font-medium">{backupInfo.data.entries.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Equipamentos:</dt>
                      <dd className="font-medium">{backupInfo.data.equipment.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Insumos:</dt>
                      <dd className="font-medium">{backupInfo.data.insumos.length}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <Label className="mb-3 block">Modo de Importação</Label>
                  <RadioGroup value={importMode} onValueChange={(v: any) => setImportMode(v)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="merge" id="merge" />
                      <Label htmlFor="merge" className="font-normal cursor-pointer">
                        <strong>Mesclar:</strong> Adiciona os dados do backup aos dados existentes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replace" id="replace" />
                      <Label htmlFor="replace" className="font-normal cursor-pointer">
                        <strong>Substituir:</strong> Remove todos os dados atuais e substitui pelo
                        backup
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleImport}
                  disabled={loading}
                  variant={importMode === 'replace' ? 'destructive' : 'default'}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar Backup ({importMode === 'merge' ? 'Mesclar' : 'Substituir'})
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Backup;
