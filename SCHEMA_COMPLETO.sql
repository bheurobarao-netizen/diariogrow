-- =====================================================
-- SCHEMA COMPLETO - Grow Diary App
-- Para execução em novo projeto Supabase
-- Organização: diariogrow
-- =====================================================

-- =====================================================
-- 1. TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de Profiles (dados adicionais de usuário)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Tendas/Espaços de Cultivo
CREATE TABLE public.tents (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  dimensions TEXT,
  lightingtype TEXT,
  lightingwatts INTEGER,
  ventilationdetails TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Plantas
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tent_id UUID,
  parent_plant_id UUID,
  father_plant_id UUID,
  breeding_event_id UUID,
  name TEXT NOT NULL,
  strain TEXT NOT NULL,
  code TEXT NOT NULL,
  genetics TEXT,
  breeder TEXT,
  batch TEXT,
  origin TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  phase_start_date TEXT,
  birth_date TEXT,
  germination_date TEXT,
  veg_start_date TEXT,
  flower_start_date TEXT,
  harvest_date TEXT,
  current_method TEXT,
  phenotype_notes TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  is_alive BOOLEAN DEFAULT TRUE,
  generation INTEGER DEFAULT 0,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Entradas/Diário
CREATE TABLE public.entries (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plant_id UUID NOT NULL,
  date TEXT NOT NULL,
  phase TEXT NOT NULL,
  day_in_phase INTEGER,
  height NUMERIC,
  water_amount NUMERIC,
  water_ph NUMERIC,
  nutrients JSONB,
  environmental_data JSONB,
  training_methods TEXT[],
  photos TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Equipamentos
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  purchase_date TEXT,
  warranty_info TEXT,
  price NUMERIC,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Insumos
CREATE TABLE public.insumos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  quantity NUMERIC,
  unit TEXT,
  purchase_date TEXT,
  expiration_date TEXT,
  price NUMERIC,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Colheitas
CREATE TABLE public.colheitas (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plant_id UUID NOT NULL,
  harvest_date TEXT NOT NULL,
  wet_weight NUMERIC,
  photos TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Cura
CREATE TABLE public.cura (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  colheita_id UUID NOT NULL,
  jar_number TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  temperature NUMERIC,
  humidity NUMERIC,
  current_weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Eventos de Breeding
CREATE TABLE public.breeding_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mother_plant_id UUID NOT NULL,
  father_plant_id UUID,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de Tarefas
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plant_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- =====================================================
-- 2. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colheitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. POLÍTICAS RLS - PROFILES
-- =====================================================

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (TRUE);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 4. POLÍTICAS RLS - TENTS
-- =====================================================

CREATE POLICY "Users can view own tents"
ON public.tents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tents"
ON public.tents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tents"
ON public.tents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tents"
ON public.tents FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 5. POLÍTICAS RLS - PLANTS
-- =====================================================

CREATE POLICY "Users can view own plants"
ON public.plants FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants"
ON public.plants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants"
ON public.plants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants"
ON public.plants FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 6. POLÍTICAS RLS - ENTRIES
-- =====================================================

CREATE POLICY "Users can view own entries"
ON public.entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
ON public.entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
ON public.entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
ON public.entries FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 7. POLÍTICAS RLS - EQUIPMENT
-- =====================================================

CREATE POLICY "Users can view own equipment"
ON public.equipment FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
ON public.equipment FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
ON public.equipment FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
ON public.equipment FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 8. POLÍTICAS RLS - INSUMOS
-- =====================================================

CREATE POLICY "Users can view own insumos"
ON public.insumos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insumos"
ON public.insumos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insumos"
ON public.insumos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insumos"
ON public.insumos FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 9. POLÍTICAS RLS - COLHEITAS
-- =====================================================

CREATE POLICY "Users can view own colheitas"
ON public.colheitas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own colheitas"
ON public.colheitas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own colheitas"
ON public.colheitas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own colheitas"
ON public.colheitas FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 10. POLÍTICAS RLS - CURA
-- =====================================================

CREATE POLICY "Users can view own cura"
ON public.cura FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cura"
ON public.cura FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cura"
ON public.cura FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cura"
ON public.cura FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 11. POLÍTICAS RLS - BREEDING EVENTS
-- =====================================================

CREATE POLICY "Users can view own breeding_events"
ON public.breeding_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own breeding_events"
ON public.breeding_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own breeding_events"
ON public.breeding_events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own breeding_events"
ON public.breeding_events FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 12. POLÍTICAS RLS - TASKS
-- =====================================================

CREATE POLICY "Users can view own tasks"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- 13. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Função para criar perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Triggers para atualizar updated_at em todas as tabelas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_tents_updated_at
  BEFORE UPDATE ON public.tents
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_plants_updated_at
  BEFORE UPDATE ON public.plants
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_insumos_updated_at
  BEFORE UPDATE ON public.insumos
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_colheitas_updated_at
  BEFORE UPDATE ON public.colheitas
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_cura_updated_at
  BEFORE UPDATE ON public.cura
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_breeding_events_updated_at
  BEFORE UPDATE ON public.breeding_events
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- =====================================================
-- 14. STORAGE BUCKETS
-- =====================================================

-- Bucket para avatares (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE);

-- Bucket para fotos de plantas (privado)
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-media', 'plant-media', FALSE);

-- =====================================================
-- 15. POLÍTICAS DE STORAGE - AVATARS
-- =====================================================

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

-- =====================================================
-- 16. POLÍTICAS DE STORAGE - PLANT MEDIA
-- =====================================================

CREATE POLICY "Users can view their own plant media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'plant-media'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own plant media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'plant-media'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own plant media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'plant-media'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own plant media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'plant-media'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
