import Link from "next/link";
import { Smartphone, Shield, Zap, Lock, ArrowRight, QrCode, FileUp, FileDown } from "lucide-react";
import { Brand } from "@/config/site";

export default function TransferPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#121660" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
              <path d="M12 5V3.5A1.5 1.5 0 0 1 13.5 2h3A1.5 1.5 0 0 1 18 3.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/>
            </svg>
            <span className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>Docmaker</span>
          </Link>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#121660] text-white">Mobile App</span>
        </div>
      </div>

      {/* Hero — asymmetric split */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left — 3/5 */}
            <div className="lg:col-span-3 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD140]/10 text-[#121660] text-sm font-semibold">
                <Lock className="h-4 w-4" />
                Mobile-only feature
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                <span className="text-slate-900">Files that</span>
                <br />
                <span className="text-slate-900">move like</span>
                <br />
                <span style={{ color: Brand.yellow }}>messages.</span>
              </h1>

              <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                Send files between your devices in seconds. Encrypted, instant, no size limits on what matters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#121660] text-white rounded-2xl font-semibold text-base hover:bg-[#0f1250] transition-all hover:scale-[1.02] shadow-lg shadow-[#121660]/20"
                >
                  <Smartphone className="h-5 w-5" />
                  Get the App
                </a>
                <Link
                  href="/mobile"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold text-base hover:bg-slate-200 transition-all"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Shield className="h-4 w-4" />
                  E2E Encrypted
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="h-4 w-4" />
                  500MB per transfer
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="h-4 w-4" />
                  Zero-knowledge
                </div>
              </div>
            </div>

            {/* Right — 2/5: Visual */}
            <div className="lg:col-span-2 relative">
              <div className="relative mx-auto w-full max-w-sm">
                {/* Animated transfer visualization */}
                <div className="relative bg-gradient-to-br from-[#121660] to-[#0a0d3a] rounded-3xl p-8 shadow-2xl">
                  {/* Sender card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFD140] flex items-center justify-center">
                        <FileUp className="h-4 w-4 text-[#121660]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Sending</p>
                        <p className="text-xs text-white/50">photo_2024.jpg</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFD140] rounded-full" style={{ width: "100%" }} />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1.5 text-right">Encrypted & uploaded</p>
                  </div>

                  {/* Transfer code */}
                  <div className="bg-white rounded-2xl p-4 text-center mb-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Transfer Code</p>
                    <p className="text-3xl font-bold tracking-[0.3em] text-[#121660]">X7K9M2</p>
                  </div>

                  {/* Receiver card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                        <FileDown className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Receiving</p>
                        <p className="text-xs text-white/50">Decrypted locally</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: "100%" }} />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1.5 text-right">Downloaded & decrypted</p>
                  </div>

                  {/* Security badge */}
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Encrypted
                  </div>
                </div>

                {/* Floating stats */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFD140]/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-[#FFD140]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">2.3s</p>
                    <p className="text-[10px] text-slate-400">avg transfer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-100 bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">500<span className="text-lg">MB</span></p>
              <p className="text-sm text-slate-500 mt-1">Max file size</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">AES-256</p>
              <p className="text-sm text-slate-500 mt-1">Encryption standard</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">0<span className="text-lg">logs</span></p>
              <p className="text-sm text-slate-500 mt-1">Zero-knowledge server</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — horizontal timeline */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16" style={{ fontFamily: 'var(--font-playfair)' }}>
          Send in four taps
        </h2>
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-slate-200" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Open", desc: "Launch the Docmaker app", color: Brand.navy },
              { n: "02", title: "Select", desc: "Pick files to send", color: Brand.blue },
              { n: "03", title: "Share", desc: "Send the 6-char code", color: Brand.teal },
              { n: "04", title: "Done", desc: "Receiver downloads instantly", color: Brand.yellow },
            ].map((s) => (
              <div key={s.n} className="text-center relative">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white relative z-10" style={{ backgroundColor: s.color }}>
                  {s.n}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#121660]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Start transferring.
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-md mx-auto">
            Download the app and send your first file in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#121660] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-xl"
            >
              <Smartphone className="h-5 w-5" />
              Download for Free
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/40">
            <span>iOS 15+</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Android 8+</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>12MB download</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <p className="text-sm text-slate-400">© 2024 Docmaker. All rights reserved.</p>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to Docmaker
          </Link>
        </div>
      </footer>
    </div>
  );
}
