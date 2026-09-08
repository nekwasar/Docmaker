import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-slate-900">404</h1>
      <p className="text-xl text-slate-600 mt-4">Page not found</p>
      <p className="text-sm text-slate-500 mt-2 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <div className="flex gap-3 mt-8">
        <Link href="/" className="px-6 py-3 rounded-xl bg-[#121660] text-white font-semibold">Go home</Link>
        <Link href="/help" className="px-6 py-3 rounded-xl border border-slate-200 font-semibold">Help center</Link>
      </div>
    </div>
  );
}
