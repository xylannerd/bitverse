
module.exports = {
    images: {
      domains: ['ipfs.io', 'localhost', '127.0.0.1', 'dweb.link', 'gateway.pinata.cloud'],
    },

    async redirects() {
      return [
        {
          source: '/',
          destination: '/nft',
          permanent: true,
        },
      ]
    },

  }