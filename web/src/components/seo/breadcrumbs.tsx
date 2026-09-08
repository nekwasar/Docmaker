import Link from "next/link";

interface Crumb { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://docmaker.io${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4">
        <ol className="flex items-center gap-1.5 text-xs text-slate-500">
          {items.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-slate-700 hover:underline">{c.label}</Link>
              ) : (
                <span className="text-slate-700 font-medium">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
