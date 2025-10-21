export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      breeding_events: {
        Row: {
          created_at: string | null
          event_date: string
          event_type: string
          father_plant_id: string | null
          id: string
          mother_plant_id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_date: string
          event_type: string
          father_plant_id?: string | null
          id?: string
          mother_plant_id: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_date?: string
          event_type?: string
          father_plant_id?: string | null
          id?: string
          mother_plant_id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_events_father_plant_id_fkey"
            columns: ["father_plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_mother_plant_id_fkey"
            columns: ["mother_plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      colheitas: {
        Row: {
          created_at: string | null
          harvest_date: string
          id: string
          notes: string | null
          photos: string[] | null
          plant_id: string
          updated_at: string | null
          user_id: string
          wet_weight: number | null
        }
        Insert: {
          created_at?: string | null
          harvest_date: string
          id?: string
          notes?: string | null
          photos?: string[] | null
          plant_id: string
          updated_at?: string | null
          user_id: string
          wet_weight?: number | null
        }
        Update: {
          created_at?: string | null
          harvest_date?: string
          id?: string
          notes?: string | null
          photos?: string[] | null
          plant_id?: string
          updated_at?: string | null
          user_id?: string
          wet_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "colheitas_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      cura: {
        Row: {
          colheita_id: string
          created_at: string | null
          current_weight: number | null
          end_date: string | null
          humidity: number | null
          id: string
          jar_number: string | null
          notes: string | null
          start_date: string
          temperature: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          colheita_id: string
          created_at?: string | null
          current_weight?: number | null
          end_date?: string | null
          humidity?: number | null
          id?: string
          jar_number?: string | null
          notes?: string | null
          start_date: string
          temperature?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          colheita_id?: string
          created_at?: string | null
          current_weight?: number | null
          end_date?: string | null
          humidity?: number | null
          id?: string
          jar_number?: string | null
          notes?: string | null
          start_date?: string
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cura_colheita_id_fkey"
            columns: ["colheita_id"]
            isOneToOne: false
            referencedRelation: "colheitas"
            referencedColumns: ["id"]
          },
        ]
      }
      entries: {
        Row: {
          created_at: string | null
          date: string
          day_in_phase: number | null
          environmental_data: Json | null
          height: number | null
          id: string
          notes: string | null
          nutrients: Json | null
          phase: string
          photos: string[] | null
          plant_id: string
          training_methods: string[] | null
          updated_at: string | null
          user_id: string
          water_amount: number | null
          water_ph: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          day_in_phase?: number | null
          environmental_data?: Json | null
          height?: number | null
          id?: string
          notes?: string | null
          nutrients?: Json | null
          phase: string
          photos?: string[] | null
          plant_id: string
          training_methods?: string[] | null
          updated_at?: string | null
          user_id: string
          water_amount?: number | null
          water_ph?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          day_in_phase?: number | null
          environmental_data?: Json | null
          height?: number | null
          id?: string
          notes?: string | null
          nutrients?: Json | null
          phase?: string
          photos?: string[] | null
          plant_id?: string
          training_methods?: string[] | null
          updated_at?: string | null
          user_id?: string
          water_amount?: number | null
          water_ph?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entries_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          id: string
          model: string | null
          name: string
          notes: string | null
          photo_url: string | null
          price: number | null
          purchase_date: string | null
          updated_at: string | null
          user_id: string
          warranty_info: string | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          id?: string
          model?: string | null
          name: string
          notes?: string | null
          photo_url?: string | null
          price?: number | null
          purchase_date?: string | null
          updated_at?: string | null
          user_id: string
          warranty_info?: string | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          id?: string
          model?: string | null
          name?: string
          notes?: string | null
          photo_url?: string | null
          price?: number | null
          purchase_date?: string | null
          updated_at?: string | null
          user_id?: string
          warranty_info?: string | null
        }
        Relationships: []
      }
      insumos: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          expiration_date: string | null
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          price: number | null
          purchase_date: string | null
          quantity: number | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          price?: number | null
          purchase_date?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          price?: number | null
          purchase_date?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plants: {
        Row: {
          breeder: string | null
          code: string
          created_at: string | null
          current_phase: string
          flower_start_date: string | null
          genetics: string | null
          germination_date: string | null
          harvest_date: string | null
          id: string
          name: string
          notes: string | null
          origin: string
          parent_plant_id: string | null
          phase_start_date: string | null
          qr_code: string | null
          status: string | null
          strain: string
          tent_id: string | null
          updated_at: string | null
          user_id: string
          veg_start_date: string | null
        }
        Insert: {
          breeder?: string | null
          code: string
          created_at?: string | null
          current_phase: string
          flower_start_date?: string | null
          genetics?: string | null
          germination_date?: string | null
          harvest_date?: string | null
          id?: string
          name: string
          notes?: string | null
          origin: string
          parent_plant_id?: string | null
          phase_start_date?: string | null
          qr_code?: string | null
          status?: string | null
          strain: string
          tent_id?: string | null
          updated_at?: string | null
          user_id: string
          veg_start_date?: string | null
        }
        Update: {
          breeder?: string | null
          code?: string
          created_at?: string | null
          current_phase?: string
          flower_start_date?: string | null
          genetics?: string | null
          germination_date?: string | null
          harvest_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          origin?: string
          parent_plant_id?: string | null
          phase_start_date?: string | null
          qr_code?: string | null
          status?: string | null
          strain?: string
          tent_id?: string | null
          updated_at?: string | null
          user_id?: string
          veg_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plants_parent_plant_id_fkey"
            columns: ["parent_plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plants_tent_id_fkey"
            columns: ["tent_id"]
            isOneToOne: false
            referencedRelation: "tents"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          plant_id: string | null
          priority: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plant_id?: string | null
          priority?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plant_id?: string | null
          priority?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      tents: {
        Row: {
          created_at: string | null
          dimensions: string | null
          id: string
          lightingtype: string | null
          lightingwatts: number | null
          name: string
          updated_at: string | null
          user_id: string
          ventilationdetails: string | null
        }
        Insert: {
          created_at?: string | null
          dimensions?: string | null
          id?: string
          lightingtype?: string | null
          lightingwatts?: number | null
          name: string
          updated_at?: string | null
          user_id: string
          ventilationdetails?: string | null
        }
        Update: {
          created_at?: string | null
          dimensions?: string | null
          id?: string
          lightingtype?: string | null
          lightingwatts?: number | null
          name?: string
          updated_at?: string | null
          user_id?: string
          ventilationdetails?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
