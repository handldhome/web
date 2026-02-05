/** @type {import('next').NextConfig} */

// Log during build so we can verify in Vercel build logs
console.log('[next.config] BUILD-TIME ENV CHECK:');
console.log('  AIRTABLE_PAT exists:', !!process.env.AIRTABLE_PAT, 'length:', (process.env.AIRTABLE_PAT || '').length);
console.log('  AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID, 'length:', (process.env.AIRTABLE_BASE_ID || '').length);

const nextConfig = {
  reactStrictMode: true,
  env: {
    AIRTABLE_PAT: process.env.AIRTABLE_PAT,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  },
};

export default nextConfig;
