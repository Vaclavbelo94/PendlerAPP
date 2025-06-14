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
      calculation_history: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          result: Json
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          result: Json
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          result?: Json
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      commute_analytics: {
        Row: {
          arrival_time: string | null
          cost_amount: number | null
          created_at: string | null
          departure_time: string
          distance_km: number | null
          duration_minutes: number | null
          id: string
          route_destination: string
          route_origin: string
          traffic_level: string | null
          transport_mode: string
          travel_date: string
          user_id: string
          weather_conditions: string | null
        }
        Insert: {
          arrival_time?: string | null
          cost_amount?: number | null
          created_at?: string | null
          departure_time: string
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          route_destination: string
          route_origin: string
          traffic_level?: string | null
          transport_mode: string
          travel_date: string
          user_id: string
          weather_conditions?: string | null
        }
        Update: {
          arrival_time?: string | null
          cost_amount?: number | null
          created_at?: string | null
          departure_time?: string
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          route_destination?: string
          route_origin?: string
          traffic_level?: string | null
          transport_mode?: string
          travel_date?: string
          user_id?: string
          weather_conditions?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          email_type: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          email_type: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email: string
          sent_at?: string | null
          status: string
          subject: string
          user_id?: string | null
        }
        Update: {
          email_type?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fuel_records: {
        Row: {
          amount_liters: number
          created_at: string
          date: string
          full_tank: boolean
          id: string
          mileage: string
          price_per_liter: number
          station: string
          total_cost: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          amount_liters: number
          created_at?: string
          date: string
          full_tank: boolean
          id?: string
          mileage: string
          price_per_liter: number
          station: string
          total_cost: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          amount_liters?: number
          created_at?: string
          date?: string
          full_tank?: boolean
          id?: string
          mileage?: string
          price_per_liter?: number
          station?: string
          total_cost?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      highway_vignettes: {
        Row: {
          cost: string
          country: string
          created_at: string
          id: string
          notes: string | null
          purchase_location: string | null
          updated_at: string
          valid_from: string
          valid_until: string
          vehicle_id: string
          vignette_type: string
        }
        Insert: {
          cost: string
          country: string
          created_at?: string
          id?: string
          notes?: string | null
          purchase_location?: string | null
          updated_at?: string
          valid_from: string
          valid_until: string
          vehicle_id: string
          vignette_type: string
        }
        Update: {
          cost?: string
          country?: string
          created_at?: string
          id?: string
          notes?: string | null
          purchase_location?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string
          vehicle_id?: string
          vignette_type?: string
        }
        Relationships: []
      }
      insurance_records: {
        Row: {
          coverage_type: string
          created_at: string
          id: string
          monthly_cost: string
          notes: string
          policy_number: string
          provider: string
          updated_at: string
          valid_from: string
          valid_until: string
          vehicle_id: string
        }
        Insert: {
          coverage_type: string
          created_at?: string
          id?: string
          monthly_cost: string
          notes: string
          policy_number: string
          provider: string
          updated_at?: string
          valid_from: string
          valid_until: string
          vehicle_id: string
        }
        Update: {
          coverage_type?: string
          created_at?: string
          id?: string
          monthly_cost?: string
          notes?: string
          policy_number?: string
          provider?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          related_to: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          related_to?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          related_to?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
          phone_number: string | null
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
          phone_number?: string | null
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
          phone_number?: string | null
          premium_expiry?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          discount: number
          duration: number
          id: string
          max_uses: number | null
          updated_at: string | null
          used_count: number
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string | null
          discount: number
          duration: number
          id?: string
          max_uses?: number | null
          updated_at?: string | null
          used_count?: number
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string | null
          discount?: number
          duration?: number
          id?: string
          max_uses?: number | null
          updated_at?: string | null
          used_count?: number
          valid_until?: string
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
      rideshare_contacts: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          offer_id: string | null
          rating: number | null
          requester_user_id: string
          review: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          offer_id?: string | null
          rating?: number | null
          requester_user_id: string
          review?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          offer_id?: string | null
          rating?: number | null
          requester_user_id?: string
          review?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rideshare_contacts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "rideshare_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      rideshare_messages: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          message: string
          sender_user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          message?: string
          sender_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rideshare_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rideshare_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      rideshare_offers: {
        Row: {
          completed_rides: number | null
          created_at: string | null
          departure_date: string
          departure_time: string
          destination_address: string
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          notes: string | null
          origin_address: string
          price_per_person: number | null
          rating: number | null
          recurring_days: number[] | null
          seats_available: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_rides?: number | null
          created_at?: string | null
          departure_date: string
          departure_time: string
          destination_address: string
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          origin_address: string
          price_per_person?: number | null
          rating?: number | null
          recurring_days?: number[] | null
          seats_available: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_rides?: number | null
          created_at?: string | null
          departure_date?: string
          departure_time?: string
          destination_address?: string
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          origin_address?: string
          price_per_person?: number | null
          rating?: number | null
          recurring_days?: number[] | null
          seats_available?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rideshare_requests: {
        Row: {
          created_at: string | null
          departure_date: string
          departure_time_from: string
          departure_time_to: string
          destination_address: string
          id: string
          is_active: boolean | null
          max_price_per_person: number | null
          notes: string | null
          origin_address: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          departure_date: string
          departure_time_from: string
          departure_time_to: string
          destination_address: string
          id?: string
          is_active?: boolean | null
          max_price_per_person?: number | null
          notes?: string | null
          origin_address: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          departure_date?: string
          departure_time_from?: string
          departure_time_to?: string
          destination_address?: string
          id?: string
          is_active?: boolean | null
          max_price_per_person?: number | null
          notes?: string | null
          origin_address?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      route_preferences: {
        Row: {
          avoid_highways: boolean | null
          avoid_tolls: boolean | null
          created_at: string | null
          destination_address: string
          id: string
          is_default: boolean | null
          origin_address: string
          preferred_departure_time: string | null
          transport_mode: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avoid_highways?: boolean | null
          avoid_tolls?: boolean | null
          created_at?: string | null
          destination_address: string
          id?: string
          is_default?: boolean | null
          origin_address: string
          preferred_departure_time?: string | null
          transport_mode?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avoid_highways?: boolean | null
          avoid_tolls?: boolean | null
          created_at?: string | null
          destination_address?: string
          id?: string
          is_default?: boolean | null
          origin_address?: string
          preferred_departure_time?: string | null
          transport_mode?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      route_search_history: {
        Row: {
          destination_address: string
          id: string
          origin_address: string
          search_date: string | null
          user_id: string
        }
        Insert: {
          destination_address: string
          id?: string
          origin_address: string
          search_date?: string | null
          user_id: string
        }
        Update: {
          destination_address?: string
          id?: string
          origin_address?: string
          search_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_routes: {
        Row: {
          created_at: string | null
          destination_address: string
          id: string
          name: string
          optimization_preference: string
          origin_address: string
          route_data: Json | null
          transport_modes: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          destination_address: string
          id?: string
          name: string
          optimization_preference: string
          origin_address: string
          route_data?: Json | null
          transport_modes: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          destination_address?: string
          id?: string
          name?: string
          optimization_preference?: string
          origin_address?: string
          route_data?: Json | null
          transport_modes?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_records: {
        Row: {
          cost: string
          created_at: string
          description: string
          id: string
          mileage: string
          provider: string
          service_date: string
          service_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost: string
          created_at?: string
          description: string
          id?: string
          mileage: string
          provider: string
          service_date: string
          service_type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost?: string
          created_at?: string
          description?: string
          id?: string
          mileage?: string
          provider?: string
          service_date?: string
          service_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
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
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
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
      tax_calculations: {
        Row: {
          calculation_type: string
          created_at: string
          id: string
          inputs: Json
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          calculation_type: string
          created_at?: string
          id?: string
          inputs: Json
          results: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          calculation_type?: string
          created_at?: string
          id?: string
          inputs?: Json
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_documents: {
        Row: {
          created_at: string
          document_data: Json
          document_type: string
          file_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_data: Json
          document_type: string
          file_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_data?: Json
          document_type?: string
          file_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_form_drafts: {
        Row: {
          created_at: string
          form_data: Json
          form_type: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_data: Json
          form_type: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_type?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      traffic_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string
          route_destination: string
          route_origin: string
          severity: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          route_destination: string
          route_origin: string
          severity?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          route_destination?: string
          route_origin?: string
          severity?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_appearance_settings: {
        Row: {
          color_scheme: string | null
          compact_mode: boolean | null
          created_at: string | null
          dark_mode: boolean | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color_scheme?: string | null
          compact_mode?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color_scheme?: string | null
          compact_mode?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          id?: string
          updated_at?: string | null
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
      user_notification_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          push_notifications: boolean
          reminder_time: string
          shift_reminders: boolean
          system_updates: boolean
          updated_at: string
          user_id: string
          weekly_summaries: boolean
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          reminder_time?: string
          shift_reminders?: boolean
          system_updates?: boolean
          updated_at?: string
          user_id: string
          weekly_summaries?: boolean
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          reminder_time?: string
          shift_reminders?: boolean
          system_updates?: boolean
          updated_at?: string
          user_id?: string
          weekly_summaries?: boolean
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
      user_sync_settings: {
        Row: {
          created_at: string
          enable_background_sync: boolean
          id: string
          last_sync_time: string | null
          show_sync_notifications: boolean
          sync_interval: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enable_background_sync?: boolean
          id?: string
          last_sync_time?: string | null
          show_sync_notifications?: boolean
          sync_interval?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enable_background_sync?: boolean
          id?: string
          last_sync_time?: string | null
          show_sync_notifications?: boolean
          sync_interval?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_travel_preferences: {
        Row: {
          created_at: string | null
          fuel_price_per_liter: number | null
          home_address: string | null
          id: string
          monthly_transport_budget: number | null
          preferred_transport: string | null
          updated_at: string | null
          user_id: string
          vehicle_consumption: number | null
          work_address: string | null
        }
        Insert: {
          created_at?: string | null
          fuel_price_per_liter?: number | null
          home_address?: string | null
          id?: string
          monthly_transport_budget?: number | null
          preferred_transport?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_consumption?: number | null
          work_address?: string | null
        }
        Update: {
          created_at?: string | null
          fuel_price_per_liter?: number | null
          home_address?: string | null
          id?: string
          monthly_transport_budget?: number | null
          preferred_transport?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_consumption?: number | null
          work_address?: string | null
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
      vehicle_documents: {
        Row: {
          created_at: string
          expiry_date: string | null
          file_path: string | null
          id: string
          name: string
          notes: string | null
          type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          name: string
          notes?: string | null
          type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_inspections: {
        Row: {
          cost: string
          created_at: string
          id: string
          inspection_date: string
          mileage: string
          next_inspection_date: string
          notes: string | null
          result: string
          station: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost: string
          created_at?: string
          id?: string
          inspection_date: string
          mileage: string
          next_inspection_date: string
          notes?: string | null
          result: string
          station: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost?: string
          created_at?: string
          id?: string
          inspection_date?: string
          mileage?: string
          next_inspection_date?: string
          notes?: string | null
          result?: string
          station?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          average_consumption: string | null
          brand: string
          color: string | null
          created_at: string
          engine: string | null
          fuel_type: string | null
          id: string
          insurance_monthly: string | null
          last_repair_cost: string | null
          last_service: string | null
          license_plate: string
          mileage: string | null
          model: string
          next_inspection: string | null
          power: string | null
          purchase_price: string | null
          tax_yearly: string | null
          transmission: string | null
          updated_at: string
          user_id: string
          vin: string
          year: string
        }
        Insert: {
          average_consumption?: string | null
          brand: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          insurance_monthly?: string | null
          last_repair_cost?: string | null
          last_service?: string | null
          license_plate: string
          mileage?: string | null
          model: string
          next_inspection?: string | null
          power?: string | null
          purchase_price?: string | null
          tax_yearly?: string | null
          transmission?: string | null
          updated_at?: string
          user_id: string
          vin: string
          year: string
        }
        Update: {
          average_consumption?: string | null
          brand?: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          insurance_monthly?: string | null
          last_repair_cost?: string | null
          last_service?: string | null
          license_plate?: string
          mileage?: string | null
          model?: string
          next_inspection?: string | null
          power?: string | null
          purchase_price?: string | null
          tax_yearly?: string | null
          transmission?: string | null
          updated_at?: string
          user_id?: string
          vin?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_related_to?: Json
        }
        Returns: string
      }
      get_current_user_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
