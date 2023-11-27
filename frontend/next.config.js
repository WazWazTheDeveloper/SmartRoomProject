/** @type {import('next').NextConfig} */

const BACKEND_URL = process.env.BACKEND_URL
const BACKEND_PORT = process.env.BACKEND_PORT
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL

const nextConfig = {
    async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `http://${BACKEND_INTERNAL_URL}:${BACKEND_PORT}/api/:path*`,
			},
		]
	},
	
	env: {
		BACKEND_URL: BACKEND_URL,
		BACKEND_PORT: BACKEND_PORT,
		BACKEND_INTERNAL_URL: BACKEND_INTERNAL_URL,
	  },

	  webpack: (config, context) => {
		// Enable polling based on env variable being set
		if(process.env.NEXT_WEBPACK_USEPOLLING) {
		  config.watchOptions = {
			poll: 800,
			aggregateTimeout: 300
		  }
		}
		return config
	}
}

module.exports = nextConfig
