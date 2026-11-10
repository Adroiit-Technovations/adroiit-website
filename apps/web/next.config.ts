
import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: resolve(__dirname, "../.."),

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
