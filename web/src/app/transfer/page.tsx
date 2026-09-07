import Link from "next/link";
import { Smartphone, Shield, Zap, Clock, ArrowRight, QrCode } from "lucide-react";
import { Brand } from "@/config/site";

const FEATURES = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "End-to-End Encrypted",
    description: "Files are encrypted on your device before upload. The server never sees your data.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Transfer Up to 500MB",
    description: "Send large files instantly between any devices with a simple 6-character code.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Auto-Expires for Security",
    description: "Transfers automatically delete after download or expiry. Your data stays safe.",
  },
];

const STEPS = [
  { num: "1", title: "Open Docmaker App", desc: "Download from App Store or Google Play" },
  { num: "2", title: "Tap Send & Select Files", desc: "Choose files up to 500MB to transfer" },
  { num: "3", title: "Share the Code", desc: "Send the 6-character code to the receiver" },
  { num: "4", title: "Receiver Enters Code", desc: "Files download instantly, encrypted end-to-end" },
];

export default function TransferPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121660] to-[#0a0d3a]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
                <Smartphone className="h-4 w-4" />
                Mobile App
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transfer Files
                <br />
                <span className="text-[#FFD140]">Securely</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                Send and receive files instantly between your devices with end-to-end encryption. 
                Mobile only — download the app to get started.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.33-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.84M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.42-2.35 1.04-3.19z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 9.35zM17.1 12.75l2.993 1.694c.653.368.653 1.034 0 1.402l-2.993 1.694-2.537-2.133 2.537-2.133zM5.864 2.658L16.8 12l-2.3 2.427L5.864 2.658z"/>
                  </svg>
                  Google Play
                </a>
              </div>

              {/* QR Code Placeholder */}
              <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-white/10">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-[#121660]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Scan to download</p>
                  <p className="text-xs text-white/50">Or visit docmaker.io/mobile</p>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Phone frame */}
                <div className="w-72 h-[580px] bg-[#0a0d3a] rounded-[3rem] border-4 border-slate-700 p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden flex flex-col">
                    {/* Status bar */}
                    <div className="h-12 bg-[#121660] flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Docmaker</span>
                    </div>
                    {/* Transfer UI mockup */}
                    <div className="flex-1 bg-[#F4F6FB] p-4 space-y-3">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#FFD140]/10 flex items-center justify-center mb-2">
                          <svg className="h-6 w-6 text-[#FFD140]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-900">Send Files</p>
                        <p className="text-[10px] text-slate-500">Share to another device</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#FFD140]/10 flex items-center justify-center mb-2">
                          <svg className="h-6 w-6 text-[#FFD140]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-900">Receive Files</p>
                        <p className="text-[10px] text-slate-500">Get from another device</p>
                      </div>
                      <div className="bg-[#FFD140] rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-[#121660]">🔒 End-to-End Encrypted</p>
                      </div>
                    </div>
                    {/* Bottom nav */}
                    <div className="h-14 bg-white border-t border-slate-200 flex items-center justify-around">
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto rounded bg-[#121660]/10 mb-1" />
                        <p className="text-[9px] text-slate-400">Home</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto rounded bg-[#FFD140] mb-1" />
                        <p className="text-[9px] font-semibold text-[#121660]">Transfer</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto rounded bg-slate-200 mb-1" />
                        <p className="text-[9px] text-slate-400">Profile</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-[#FFD140] text-[#121660] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  500MB
                </div>
                <div className="absolute -bottom-2 -left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Shield className="h-3 w-3" /> E2E
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Why transfer with Docmaker?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${Brand.yellow}15`, color: Brand.yellow }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            How it works
          </h2>
          <p className="text-slate-500 mt-3">Four simple steps to transfer any file</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${Brand.yellow}15`, color: Brand.yellow }}>
                {step.num}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-[#121660] p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transfer?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Download the Docmaker app and start transferring files securely today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              <Smartphone className="h-5 w-5" />
              Download App
            </a>
            <Link
              href="/mobile"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
