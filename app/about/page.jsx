import { getSiteContentDoc } from "@/lib/cms-store";
import { mergeSiteContent } from "@/lib/cms-defaults";
import AboutView from "./AboutView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const raw = await getSiteContentDoc();
  const { about } = mergeSiteContent(raw);
  return <AboutView about={about} />;
}
