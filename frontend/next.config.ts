import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "mlhgtxhvhffffabmkhzc.supabase.co"
        }]
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/search',
                permanent: true
            }
        ]
    },
};

export default nextConfig;
