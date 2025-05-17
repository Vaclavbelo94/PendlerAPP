export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      premium_features: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          key: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          key: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          key?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          is_premium: boolean | null
          premium_expiry: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          premium_expiry?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          premium_expiry?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          data: Json | null
          end_date: string | null
          id: string
          start_date: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          synced: boolean | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          synced?: boolean | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          synced?: boolean | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_certificates: {
        Row: {
          created_at: string
          id: string
          issuer: string
          name: string
          type: string | null
          updated_at: string
          url: string | null
          user_id: string
          year: string
        }
        Insert: {
          created_at?: string
          id?: string
          issuer: string
          name: string
          type?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
          year: string
        }
        Update: {
          created_at?: string
          id?: string
          issuer?: string
          name?: string
          type?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
          year?: string
        }
        Relationships: []
      }
      user_extended_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string | null
          email_notifications: boolean | null
          id: string
          language_reminders: boolean | null
          location: string | null
          preferred_language: string | null
          shift_notifications: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          language_reminders?: boolean | null
          location?: string | null
          preferred_language?: string | null
          shift_notifications?: boolean | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          language_reminders?: boolean | null
          location?: string | null
          preferred_language?: string | null
          shift_notifications?: boolean | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      user_social_links: {
        Row: {
          created_at: string
          facebook: string | null
          github: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          twitter: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          login_count: number | null
          shift_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          login_count?: number | null
          shift_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          login_count?: number | null
          shift_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_work_preferences: {
        Row: {
          carpool_driver: boolean | null
          carpool_passenger: boolean | null
          created_at: string
          id: string
          max_shifts_per_week: number | null
          notes: string | null
          preferred_locations: string[] | null
          preferred_shift_type: string | null
          updated_at: string
          user_id: string
          willing_to_travel_km: number | null
        }
        Insert: {
          carpool_driver?: boolean | null
          carpool_passenger?: boolean | null
          created_at?: string
          id?: string
          max_shifts_per_week?: number | null
          notes?: string | null
          preferred_locations?: string[] | null
          preferred_shift_type?: string | null
          updated_at?: string
          user_id: string
          willing_to_travel_km?: number | null
        }
        Update: {
          carpool_driver?: boolean | null
          carpool_passenger?: boolean | null
          created_at?: string
          id?: string
          max_shifts_per_week?: number | null
          notes?: string | null
          preferred_locations?: string[] | null
          preferred_shift_type?: string | null
          updated_at?: string
          user_id?: string
          willing_to_travel_km?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
