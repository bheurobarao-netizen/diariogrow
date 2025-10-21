-- Criar bucket para armazenar fotos e vídeos das plantas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('plant-media', 'plant-media', true);

-- Políticas de Storage: Usuários autenticados podem fazer upload
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'plant-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de Storage: Todos podem visualizar (bucket público)
CREATE POLICY "Todos podem visualizar mídias"
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'plant-media');

-- Políticas de Storage: Usuários podem atualizar seus próprios arquivos
CREATE POLICY "Usuários podem atualizar seus arquivos"
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'plant-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de Storage: Usuários podem deletar seus próprios arquivos
CREATE POLICY "Usuários podem deletar seus arquivos"
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'plant-media' AND auth.uid()::text = (storage.foldername(name))[1]);