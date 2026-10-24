import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import {
  getDefaultAbout,
  getDefaultProducts,
  getDefaultServices,
  getDefaultInsurance,
} from "@/lib/cms-defaults";

/** Fallback document when MongoDB is unreachable — keeps public CMS pages online. */
function getOfflineSiteContentDoc() {
  return {
    singletonKey: "main",
    about: getDefaultAbout(),
    products: getDefaultProducts(),
    services: getDefaultServices(),
    insurance: getDefaultInsurance(),
  };
}

/** Avoid spamming logs + repeated slow connect attempts while DB is down. */
let offlineUntil = 0;
let warnedOffline = false;
const OFFLINE_COOLDOWN_MS = 15_000;

export async function getSiteContentDoc() {
  const now = Date.now();
  if (now < offlineUntil) {
    return getOfflineSiteContentDoc();
  }

  try {
    await connectDB();
    offlineUntil = 0;
    warnedOffline = false;

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
  } catch (err) {
    offlineUntil = now + OFFLINE_COOLDOWN_MS;
    // warn (not error) — Next.js treats console.error as a Console Error overlay
    if (!warnedOffline) {
      warnedOffline = true;
      console.warn(
        "[cms-store] MongoDB unavailable — serving default page content.",
        String(err?.message || err)
      );
    }
    return getOfflineSiteContentDoc();
  }
}
