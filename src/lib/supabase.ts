import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          position: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          position?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          position?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          client_id: string
          user_id: string
          type: string
          notes: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          user_id: string
          type: string
          notes?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          user_id?: string
          type?: string
          notes?: string | null
          date?: string
          created_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          client_id: string
          user_id: string
          title: string
          amount: number | null
          stage: string
          probability: number
          expected_close_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          user_id: string
          title: string
          amount?: number | null
          stage?: string
          probability?: number
          expected_close_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          user_id?: string
          title?: string
          amount?: number | null
          stage?: string
          probability?: number
          expected_close_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          opportunity_id: string | null
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          opportunity_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          opportunity_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
