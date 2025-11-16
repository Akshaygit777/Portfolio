import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      // "*.vs": {
      //   loaders: ["raw-loader"],
      //   as: "*.js",
      // },
      // "*.fs": {
      //   loaders: ["raw-loader"],
      //   as: "*.js",
      // },
      // "*.vert": {
      //   loaders: ["raw-loader"],
      //   as: "*.js",
      // },
      // "*.frag": {
      //   loaders: ["raw-loader"],
      //   as: "*.js",
      // },
    },
  },
};

export default nextConfig;