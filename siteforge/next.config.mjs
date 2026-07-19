/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All pages are statically generated. The SITE env var selects which
  // domain config is baked into the build (see sites/registry.ts).
  env: {
    SITE: process.env.SITE ?? 'metabolichealth.example'
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'sites']
  }
};

export default nextConfig;
