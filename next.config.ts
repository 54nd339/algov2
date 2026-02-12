import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // webpack: (config) => {
  //   config.experiments = {
  //     ...config.experiments,
  //     asyncWebAssembly: true,
  //     layers: true,
  //   };
  //   return config;
  // },
  async redirects() {
    return [
      {
        source: "/sorting",
        destination: "/sorting/bubble-sort",
        permanent: true,
      },
      {
        source: "/searching",
        destination: "/searching/linear-search",
        permanent: true,
      },
    ];
  },
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
