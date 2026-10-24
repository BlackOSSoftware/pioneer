import { getPublicSitemapPaths, SITE_URL } from "@/lib/seo";

export default function sitemap() {
  const now = new Date();

  return getPublicSitemapPaths().map((path) => {
    const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
    const isHome = path === "/";
    const isTool = path.includes("/Calculators/") || path.includes("/Goal_Planners/");

    return {
      url,
      lastModified: now,
      changeFrequency: isHome ? "weekly" : isTool ? "monthly" : "monthly",
      priority: isHome ? 1 : isTool ? 0.8 : 0.7,
    };
  });
}
