import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import InsuranceView from "./InsuranceView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Insurance",
  description:
    "Life and health insurance planning — compare illustrative plans and protect your family with structured coverage.",
};

export default async function InsurancePage() {
  const raw = await getSiteContentDoc();
  const { insurance } = mergeSiteContent(raw);
  return <InsuranceView insurance={insurance} />;
}
