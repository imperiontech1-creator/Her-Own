import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Her Own" };
  return {
    title: `${product.name} | Her Own`,
    description: product.tagline + " – " + product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
