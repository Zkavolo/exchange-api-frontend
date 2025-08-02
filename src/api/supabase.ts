import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
