import { createClient } from '@supabase/supabase-js'

// Separate Supabase client for the Handld Home database (handld schema)
// Uses service_role key — server-side only, never expose to the browser
const handldUrl = process.env.HANDLD_SUPABASE_URL!
const handldServiceKey = process.env.HANDLD_SUPABASE_SERVICE_ROLE_KEY!

export const handldDb = createClient(handldUrl, handldServiceKey, {
  db: { schema: 'handld' },
})
