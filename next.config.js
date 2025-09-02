// next.config.js
const nextConfig = {
  webpack: (config) => {
    // Ignore source-map-loader warnings from node_modules/next
    config.ignoreWarnings = [
      {
        module: /node_modules\/next/,
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
