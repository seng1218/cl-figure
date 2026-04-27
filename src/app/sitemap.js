export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vault6studios.com';

  let productUrls = [];
  try {
    const res = await fetch(`${base}/api/products/`, { cache: 'no-store' });
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        productUrls = products.map(p => ({
          url: `${base}/product/${p.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch {}

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/return-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...productUrls,
  ];
}
