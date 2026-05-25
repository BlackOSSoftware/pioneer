import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import ProductView from "./ProductView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Products",
  description: "Explore mutual fund products and curated fund options aligned with your goals.",
};

export default async function ProductPage() {
  const raw = await getSiteContentDoc();
  const { products } = mergeSiteContent(raw);
  return <ProductView products={products} />;
}
