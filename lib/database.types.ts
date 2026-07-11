export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_invites: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          revoked_at: string | null
          token: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          revoked_at?: string | null
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          revoked_at?: string | null
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_datetime: string
          estimated_hours: number
          id: string
          location: string | null
          slots: number
          start_datetime: string
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_datetime: string
          estimated_hours?: number
          id?: string
          location?: string | null
          slots?: number
          start_datetime: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_datetime?: string
          estimated_hours?: number
          id?: string
          location?: string | null
          slots?: number
          start_datetime?: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          no_show_count: number
          onboarded: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          total_hours: number
          tshirt_size: Database["public"]["Enums"]["tshirt_size"] | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id: string
          no_show_count?: number
          onboarded?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          total_hours?: number
          tshirt_size?: Database["public"]["Enums"]["tshirt_size"] | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          no_show_count?: number
          onboarded?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          total_hours?: number
          tshirt_size?: Database["public"]["Enums"]["tshirt_size"] | null
        }
        Relationships: []
      }
      signups: {
        Row: {
          created_at: string
          hours_awarded: number
          id: string
          opportunity_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["signup_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          hours_awarded?: number
          id?: string
          opportunity_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["signup_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          hours_awarded?: number
          id?: string
          opportunity_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["signup_status"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      redeem_admin_invite: { Args: { p_token: string }; Returns: boolean }
      review_signup: {
        Args: {
          p_hours?: number
          p_signup_id: string
          p_status: Database["public"]["Enums"]["signup_status"]
        }
        Returns: Database["public"]["Tables"]["signups"]["Row"]
      }
    }
    Enums: {
      opportunity_status: "open" | "closed" | "completed"
      signup_status: "pending" | "approved" | "no_show"
      tshirt_size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
      user_role: "member" | "admin"
    }
    CompositeTypes: Record<string, never>
  }
}

type PublicSchema = Database["public"]

export type Profile = PublicSchema["Tables"]["profiles"]["Row"]
export type Opportunity = PublicSchema["Tables"]["opportunities"]["Row"]
export type Signup = PublicSchema["Tables"]["signups"]["Row"]
export type AdminInvite = PublicSchema["Tables"]["admin_invites"]["Row"]
export type SignupStatus = PublicSchema["Enums"]["signup_status"]
export type OpportunityStatus = PublicSchema["Enums"]["opportunity_status"]
export type TshirtSize = PublicSchema["Enums"]["tshirt_size"]
export type UserRole = PublicSchema["Enums"]["user_role"]
