"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Brand } from "@/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Contact Us
        </h1>

        <p className="text-xl text-slate-500 mb-16 max-w-2xl leading-relaxed">
          Have a question or need help? We'd love to hear from you.
        </p>

        <div className="h-px bg-slate-200 mb-16" />

        {submitted ? (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
              Thank you
            </h2>
            <p className="text-lg text-slate-600">
              We've received your message and will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={() => setSubmitted(true)} className="space-y-8 max-w-xl">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#121660] focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#121660] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#121660] focus:border-transparent resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              <Send className="h-5 w-5" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
