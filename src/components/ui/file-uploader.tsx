import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFilesUploaded: (urls: string[]) => void;
  accept?: string;
  maxFiles?: number;
  existingFiles?: string[];
}

const FileUploader = ({
  onFilesUploaded,
  accept = 'image/*,video/*',
  maxFiles = 10,
  existingFiles = [],
}: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>(existingFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: 'Limite excedido',
        description: `Você pode enviar no máximo ${maxFiles} arquivos.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const uploadedUrls: string[] = [];

      for (const file of Array.from(selectedFiles)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('plant-media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('plant-media')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      const newFiles = [...files, ...uploadedUrls];
      setFiles(newFiles);
      onFilesUploaded(newFiles);

      toast({
        title: 'Upload concluído',
        description: `${uploadedUrls.length} arquivo(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível fazer upload dos arquivos.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const getFileType = (url: string): 'image' | 'video' => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))
      ? 'video'
      : 'image';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Enviando...' : 'Selecionar Arquivos'}
        </Button>
        <span className="text-sm text-muted-foreground">
          {files.length} / {maxFiles}
        </span>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {files.map((fileUrl, index) => {
            const fileType = getFileType(fileUrl);
            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border group"
              >
                {fileType === 'image' ? (
                  <img
                    src={fileUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Video className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
