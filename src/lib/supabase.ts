import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. " +
      "Verificá que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén definidas en .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Tipos que Supabase devuelve ───────────────────────────────────────────────
export interface SupabaseFeedbackRow {
  id: string;           // uuid
  created_at: string;   // ISO timestamp
  text: string;
  source: string;
  sentiment: string;
  category: string;
  insight: string;
  score: number;
}
