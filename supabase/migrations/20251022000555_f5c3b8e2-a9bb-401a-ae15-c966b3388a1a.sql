-- Add missing fields to plants table for complete plant management
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS father_plant_id uuid REFERENCES public.plants(id);
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS breeding_event_id uuid REFERENCES public.breeding_events(id);
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS generation integer DEFAULT 0;
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS current_method text;
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS phenotype_notes text;
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS batch text;
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS birth_date text;
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS is_alive boolean DEFAULT true;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_plants_father_plant_id ON public.plants(father_plant_id);
CREATE INDEX IF NOT EXISTS idx_plants_breeding_event_id ON public.plants(breeding_event_id);
CREATE INDEX IF NOT EXISTS idx_plants_generation ON public.plants(generation);
CREATE INDEX IF NOT EXISTS idx_plants_is_alive ON public.plants(is_alive);

-- Add comments for documentation
COMMENT ON COLUMN public.plants.father_plant_id IS 'ID da planta pai (para breeding/cruzamento)';
COMMENT ON COLUMN public.plants.breeding_event_id IS 'Referência ao evento de breeding que criou esta planta';
COMMENT ON COLUMN public.plants.generation IS 'Geração da planta (0 = original, 1+ = clones)';
COMMENT ON COLUMN public.plants.current_method IS 'Método de cultivo atual (ex: LST, SCROG, etc)';
COMMENT ON COLUMN public.plants.phenotype_notes IS 'Notas sobre o fenótipo observado';
COMMENT ON COLUMN public.plants.batch IS 'Lote da semente ou clone';
COMMENT ON COLUMN public.plants.birth_date IS 'Data de nascimento da planta';
COMMENT ON COLUMN public.plants.is_alive IS 'Indica se a planta está viva ou foi removida/morreu';