"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-md">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="mt-6 px-6 py-3 rounded-xl bg-[#121660] text-white font-semibold">
        Try again
      </button>
    </div>
  );
}
