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
      {
        source: "/path-finding",
        destination: "/path-finding/breadth-first-search",
        permanent: true,
      },
      {
        source: "/shortest-path",
        destination: "/shortest-path/dijkstra",
        permanent: true,
      },
      {
        source: "/mst",
        destination: "/mst/prim",
        permanent: true,
      },
      {
        source: "/ai",
        destination: "/ai/linear-regression",
        permanent: true,
      },
      {
        source: "/games",
        destination: "/games/n-queen",
        permanent: true,
      },
      {
        source: "/classic",
        destination: "/classic/tower-of-hanoi",
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
