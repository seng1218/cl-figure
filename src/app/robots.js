export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vault6studios.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/vault-ops', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
