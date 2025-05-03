import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  allowedDevOrigins: [
    "localhost",              // immer erlaubt
    "127.0.0.1",              // immer erlaubt
    "100.127.255.164",        // füge hier die IP/Domain hinzu, die in der Warnung steht
    // ggf. weitere Domains oder Subdomains, die du im Dev verwendest
  ],
};

export default nextConfig;
