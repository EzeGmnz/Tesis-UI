/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['localhost', 'skyserver.sdss.org'],
  }
}

module.exports = nextConfig
