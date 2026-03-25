import { allProducts } from '@/lib/products';
import ProductClient from './ProductClient';

// Required for Next.js static export (output: 'export') to pre-render all product pages
export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

// Server Component Wrapper
export default function ProductPage() {
  return <ProductClient />;
}
