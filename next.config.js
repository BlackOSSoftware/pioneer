/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        middlewarePrefetch: "flexible",
        optimizePackageImports: ["lucide-react"],
    },
    compress: true,
    poweredByHeader: false,
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 7,
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
        ],
    },
    // Ensure Google verification HTML is reachable even if CDN caches miss static /public
    async headers() {
        return [
            {
                source: "/google6a60f7e35d18e395.html",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
                    { key: "Content-Type", value: "text/html; charset=utf-8" },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
