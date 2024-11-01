module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  images: {
    domains: ['localhost', 'bookshop-calendar.vercel.app'],
  },
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  }
} 