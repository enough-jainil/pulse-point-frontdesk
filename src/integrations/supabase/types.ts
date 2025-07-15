export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          amount: number
          appointment_date: string
          appointment_id: string
          appointment_status: string | null
          appointment_time: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          package_id: string | null
          payment_status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_date: string
          appointment_id: string
          appointment_status?: string | null
          appointment_time: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          package_id?: string | null
          payment_status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_date?: string
          appointment_id?: string
          appointment_status?: string | null
          appointment_time?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          package_id?: string | null
          payment_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "wellness_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          convert_status: string | null
          created_at: string
          email: string | null
          id: string
          inquiry_date: string
          mobile: string
          name: string
          notes: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          convert_status?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inquiry_date?: string
          mobile: string
          name: string
          notes?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          convert_status?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inquiry_date?: string
          mobile?: string
          name?: string
          notes?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          balance_due: number | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          due_date: string
          id: string
          invoice_date: string
          invoice_no: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          balance_due?: number | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          due_date: string
          id?: string
          invoice_date: string
          invoice_no: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          balance_due?: number | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_no?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      member_memberships: {
        Row: {
          amount_paid: number
          created_at: string
          end_date: string
          id: string
          member_id: string
          package_id: string
          payment_status: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          end_date: string
          id?: string
          member_id: string
          package_id: string
          payment_status?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          end_date?: string
          id?: string
          member_id?: string
          package_id?: string
          payment_status?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_memberships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "membership_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          goals: string | null
          id: string
          last_name: string
          member_id: string
          phone: string
          pincode: string | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          goals?: string | null
          id?: string
          last_name: string
          member_id: string
          phone: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          goals?: string | null
          id?: string
          last_name?: string
          member_id?: string
          phone?: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      membership_packages: {
        Row: {
          created_at: string
          description: string | null
          discount: number | null
          duration_days: number
          id: string
          name: string
          price: number
          selling_price: number
          status: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount?: number | null
          duration_days: number
          id?: string
          name: string
          price: number
          selling_price: number
          status?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount?: number | null
          duration_days?: number
          id?: string
          name?: string
          price?: number
          selling_price?: number
          status?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          balance_due: number | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          invoice_id: string | null
          invoice_no: string
          payment_date: string
          payment_mode: string
          reference_no: string | null
          remark: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          balance_due?: number | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          invoice_id?: string | null
          invoice_no: string
          payment_date: string
          payment_mode: string
          reference_no?: string | null
          remark?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          balance_due?: number | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          invoice_id?: string | null
          invoice_no?: string
          payment_date?: string
          payment_mode?: string
          reference_no?: string | null
          remark?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          created_at: string
          id: string
          meta_description: string
          meta_keywords: string
          meta_title: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description: string
          meta_keywords: string
          meta_title: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wellness_packages: {
        Row: {
          created_at: string
          discount: number | null
          duration_minutes: number
          id: string
          mrp: number
          selling_price: number
          service_id: string | null
          sessions: number
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount?: number | null
          duration_minutes: number
          id?: string
          mrp: number
          selling_price: number
          service_id?: string | null
          sessions: number
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount?: number | null
          duration_minutes?: number
          id?: string
          mrp?: number
          selling_price?: number
          service_id?: string | null
          sessions?: number
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
