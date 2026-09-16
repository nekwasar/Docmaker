import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/templates" className="font-bold text-slate-900">Docmaker Admin</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/templates" className="text-[#121660] font-semibold">Templates</Link>
            <Link href="/" className="text-slate-500 hover:text-slate-700">← Back to site</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
