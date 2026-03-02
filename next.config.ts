import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Favicon: always redirect to app icon. DO NOT use "/icon" — use "/icon.svg" (see lib/constants.ts).
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon.svg", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
