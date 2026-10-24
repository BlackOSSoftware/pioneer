import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import ProductView from "./ProductView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage() {
  const raw = await getSiteContentDoc();
  const { products } = mergeSiteContent(raw);
  return <ProductView products={products} />;
}
