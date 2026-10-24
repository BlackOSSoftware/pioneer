import { buildPageMetadata, PLANNER_SEO } from "@/lib/seo";

const seo = PLANNER_SEO["Dream-home"];
const pathUrl = "/Goal_Planners/Dream-home";

export const metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  path: pathUrl,
  keywords: seo.keywords || [],
});

export default function GoalPlannerLayout({ children }) {
  return children;
}
