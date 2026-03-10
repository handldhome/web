import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Separate Supabase client for the Handld Home database (handld schema)
// Uses service_role key — server-side only, never expose to the browser
// Lazy-initialized to avoid build-time errors when env vars aren't available

let _handldDb: SupabaseClient | null = null

export function getHandldDb(): SupabaseClient {
  if (!_handldDb) {
    _handldDb = createClient(
      process.env.HANDLD_SUPABASE_URL!,
      process.env.HANDLD_SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'handld' } }
    )
  }
  return _handldDb
}
