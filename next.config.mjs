/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Customer quote links (texted as handldhome.com/quote/<token>) open in
        // the quote viewer. /quote itself is the quote form and is not matched.
        source: '/quote/:token',
        destination: 'https://quote.handldhome.com/quote/:token',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
