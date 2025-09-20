import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["shiki"],
  images: {
    remotePatterns: [
      {
        hostname: "uos1ovyqrd.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
