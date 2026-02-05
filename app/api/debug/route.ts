import { NextResponse } from 'next/server';

export async function GET() {
  // List all env var NAMES that contain "AIRTABLE" (no values for security)
  const airtableKeys = Object.keys(process.env).filter((k) =>
    k.toUpperCase().includes('AIRTABLE')
  );

  return NextResponse.json({
    found_airtable_keys: airtableKeys,
    pat_exists: !!process.env.AIRTABLE_PAT,
    pat_length: process.env.AIRTABLE_PAT?.length ?? 0,
    base_id_exists: !!process.env.AIRTABLE_BASE_ID,
    base_id_length: process.env.AIRTABLE_BASE_ID?.length ?? 0,
    node_env: process.env.NODE_ENV,
    total_env_keys: Object.keys(process.env).length,
  });
}
