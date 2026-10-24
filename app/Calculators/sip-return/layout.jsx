import { buildPageMetadata, CALCULATOR_SEO, calculatorAppJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

const seo = CALCULATOR_SEO["sip-return"];
const pathUrl = "/Calculators/sip-return";

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
