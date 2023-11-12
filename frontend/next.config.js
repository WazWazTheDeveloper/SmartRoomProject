/** @type {import('next').NextConfig} */

const API_URL = process.env.API_URL

const nextConfig = {
    async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `http://${API_URL}/api/:path*`,
			},
		]
	},
	env: {
		API_URL: API_URL,
	  },
}

module.exports = nextConfig
