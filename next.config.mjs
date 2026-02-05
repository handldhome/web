/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AIRTABLE_PAT: process.env.AIRTABLE_PAT,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  },
};

export default nextConfig;
