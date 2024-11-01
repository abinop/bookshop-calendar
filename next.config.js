module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  distDir: 'build',
  output: 'standalone'
} 