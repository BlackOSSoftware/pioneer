import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import {
  getDefaultAbout,
  getDefaultProducts,
  getDefaultServices,
  getDefaultInsurance,
} from "@/lib/cms-defaults";

export async function getSiteContentDoc() {
  await connectDB();

  const existing = await SiteContent.findOne({ singletonKey: "main" }).lean();
  if (existing) return existing;

  const created = await SiteContent.findOneAndUpdate(
    { singletonKey: "main" },
    {
      $setOnInsert: {
        singletonKey: "main",
        about: getDefaultAbout(),
        products: getDefaultProducts(),
        services: getDefaultServices(),
        insurance: getDefaultInsurance(),
      },
    },
    { upsert: true, new: true, lean: true }
  );

  return created;
}
