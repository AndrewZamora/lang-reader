/** @type {import('next').NextConfig} */
// https://nextjs.org/docs/api-reference/next.config.js/rewrites
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/definition/:keyword',
        destination: 'https://jisho.org/api/v1/search/words?keyword=:keyword',
      },
    ]
  },
}
