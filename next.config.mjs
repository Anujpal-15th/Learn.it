/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Baseline security headers (Phase 2 hardening). A full Content-Security-Policy
  // is deliberately NOT added here — this app has no external script/style/image
  // dependencies today (fonts are self-hosted via next/font, no CDN assets), so
  // one could be written, but getting it exactly right requires exhaustive visual
  // QA across every page to confirm nothing gets silently blocked, which wasn't
  // done here. Ship these lower-risk headers now; add CSP as a follow-up once
  // that verification pass happens.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
