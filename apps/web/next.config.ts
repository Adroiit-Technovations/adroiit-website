
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uwhadjefsealdfeygvqx.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};

export default nextConfig;
