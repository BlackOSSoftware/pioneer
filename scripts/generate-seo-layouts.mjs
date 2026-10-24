import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const calcs = [
  "sip-return",
  "crorepati",
  "sip-step-up",
  "emi",
  "target-sip",
  "sip-annual",
  "retirement",
  "goal-setting",
  "financial-goal",
  "education",
  "compounding",
  "future-value",
  "lumpsum-target",
  "lumpsum",
];

for (const slug of calcs) {
  const file = path.join(root, "app/Calculators", slug, "layout.jsx");
  const content = `import { buildPageMetadata, CALCULATOR_SEO, calculatorAppJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

const seo = CALCULATOR_SEO["${slug}"];
const pathUrl = "/Calculators/${slug}";

export const metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  path: pathUrl,
  keywords: seo.keywords || [],
});

export default function CalculatorLayout({ children }) {
  return (
    <>
      <JsonLd
        id="calc-app-schema"
        data={calculatorAppJsonLd({
          name: seo.h1 || seo.title,
          description: seo.description,
          path: pathUrl,
        })}
      />
      {children}
    </>
  );
}
`;
  fs.writeFileSync(file, content);
  console.log("wrote", file);
}

const planners = [
  "Dream-home",
  "Wealth-Creation",
  "Retiremen",
  "Child-Education",
  "Child-Wedding",
  "Emergency",
];

for (const folder of planners) {
  const file = path.join(root, "app/Goal_Planners", folder, "layout.jsx");
  const content = `import { buildPageMetadata, PLANNER_SEO } from "@/lib/seo";

const seo = PLANNER_SEO["${folder}"];
const pathUrl = "/Goal_Planners/${folder}";

export const metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  path: pathUrl,
  keywords: seo.keywords || [],
});

export default function GoalPlannerLayout({ children }) {
  return children;
}
`;
  fs.writeFileSync(file, content);
  console.log("wrote", file);
}
