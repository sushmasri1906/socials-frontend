// next.config.js

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
};
