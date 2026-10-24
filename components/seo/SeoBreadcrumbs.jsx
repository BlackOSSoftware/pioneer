import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * Visual breadcrumbs + BreadcrumbList schema.
 * @param {{ items: { name: string, path: string }[] }} props
 */
export default function SeoBreadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 sm:text-xs">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.path}-${item.name}`} className="inline-flex items-center gap-1">
                {i > 0 ? <ChevronRight size={12} className="opacity-50" aria-hidden /> : null}
                {last ? (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="transition hover:text-sky-700">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
