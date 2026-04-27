import { allProducts } from '@/lib/products';
import ProductClient from './ProductClient';

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = allProducts.find(p => p.id.toString() === id);
  if (!product) {
    return { title: 'Item Not Found' };
  }
  const title = `${product.name} — ${product.series}`;
  const description = product.description
    || `${product.name} by ${product.manufacturer}. ${product.scale} scale. ${product.dispatchCondition}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image, width: 400, height: 500, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = allProducts.find(p => p.id.toString() === id);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || `${product.name} by ${product.manufacturer}`,
    brand: { '@type': 'Brand', name: product.manufacturer },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MYR',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient />
    </>
  );
}
