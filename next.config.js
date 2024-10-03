const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["src"] = path.resolve(__dirname, "src");
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
    rules: {
      "react/jsx-max-props-per-line": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
};
