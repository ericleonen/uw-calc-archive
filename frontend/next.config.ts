import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "mlhgtxhvhffffabmkhzc.supabase.co"
        }]
    }
};

export default nextConfig;
