/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/unisat/:slug*",
        destination: "https://api.unisat.io/query-v4/brc20/:slug*",
      },
      {
        source: "/coinranking/:slug*",
        destination: "https://coinranking.com/api/:slug*", // api-coinranking
      },
      {
        source: "/api-coinranking/:slug*",
        destination: "https://api.coinranking.com/:slug*",
      },
      {
        source: "/blocks/:slug*",
        destination: "https://blockchain.info/:slug*",
      },
      {
        source: "/ipfs/:slug*",
        destination: "https://ipfs.io/ipfs/:slug*",
      },
      {
        source: "/1inch/:slug*",
        destination: "https://api.1inch.dev/:slug*",
      },
      {
        source: '/api-llama/:slug*',
        destination: 'https://api.llama.fi/:slug*',
      },
    ];
  },
};

module.exports = nextConfig;
