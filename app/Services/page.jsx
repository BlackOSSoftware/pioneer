import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import ServicesView from "./ServicesView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services",
  description: "Professional financial services including investments, insurance, and tax planning.",
};

export default async function ServicesPage() {
  const raw = await getSiteContentDoc();
  const { services } = mergeSiteContent(raw);
  return <ServicesView services={services} />;
}
