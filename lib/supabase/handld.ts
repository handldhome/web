import { createClient } from '@supabase/supabase-js'

// Separate Supabase client for the Handld Home database (handld schema)
// Uses service_role key — server-side only, never expose to the browser
// Lazy-initialized to avoid build-time errors when env vars aren't available

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _handldDb: ReturnType<typeof createClient> | null = null

export function getHandldDb() {
  if (!_handldDb) {
    _handldDb = createClient(
      process.env.HANDLD_SUPABASE_URL!,
      process.env.HANDLD_SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'handld' } }
    )
  }
  return _handldDb
}
