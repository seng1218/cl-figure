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
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
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

export default function ProductPage() {
  return <ProductClient />;
}
