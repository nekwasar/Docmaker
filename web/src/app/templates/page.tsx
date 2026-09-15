import Link from "next/link";
import { templates } from "@/data/templates";

export const metadata = {
  title: "Templates — Docmaker",
  description: "Browse document templates for business, legal, education and HR.",
};

const categories = ["All", "Business", "Legal", "Education", "HR"] as const;

export default function TemplatesPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const q = (searchParams?.q || "").toLowerCase();
  const cat = searchParams?.category || "All";
  const filtered = templates.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.author.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="text-sm text-slate-500 mt-2">Choose a starting structure for your next document.</p>

        <form className="mt-6 flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search templates" className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20" />
          <button className="px-4 py-2 rounded-xl bg-[#121660] text-white text-sm">Search</button>
        </form>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link key={c} href={`/templates?category=${c}${q ? `&q=${q}` : ""}`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${cat === c ? "bg-[#121660] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
              {c}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filtered.map((tpl) => (
            <Link key={tpl.id} href={`/?template=${tpl.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
              <div className="h-32 bg-slate-100 flex">
                {tpl.thumbnails.slice(0, 2).map((src) => (
                  <img key={src} src={src} alt="" className="w-1/2 h-full object-cover" loading="lazy" />
                ))}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-900">{tpl.title}</p>
                <p className="text-xs text-slate-500 mt-1">{tpl.author} • {tpl.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
