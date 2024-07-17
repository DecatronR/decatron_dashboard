const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['src'] = path.resolve(__dirname, 'src');
    return config;
  },
};
