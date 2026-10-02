import { streamAIResponse, getAIConfigAsync, type MultimodalMessage, type UsageReport } from "@/lib/ai/config";
import { modelIdForProvider, type AIProvider } from "@/lib/ai/catalog";

// Prompt Architect — the mechanism that advances the user's raw prompt into a
// precise writing brief for the detected document kind. No static generation
// prompt: every writer instruction is derived per-request from the user's own
// input through this planning call.

export const ARCHETYPE_LIST = [
  "agreement", "proposal", "report", "memo", "invoice", "flyer",
  "program", "academic", "letter", "resume", "plan", "generic",
] as const;

export type Archetype = (typeof ARCHETYPE_LIST)[number];

export interface ArchitectSection {
  heading: string;
  instruction: string;
}

export interface ArchitectDesign {
  primary?: string;
  accent?: string;
  text?: string;
  bg?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface ArchitectPlan {
  archetype: Archetype;
  title: string;
  subtitle?: string;
  audience?: string;
  tone?: string;
  length?: "one-page" | "short" | "medium" | "long";
  tablePolicy?: "none" | "tabular-only" | "data-driven";
  specialElements?: string[];
  sections: ArchitectSection[];
  design: ArchitectDesign;
  notes?: string;
}

const ARCHITECT_SYSTEM_PROMPT = `You are the Docmaker Prompt Architect. A user wants to generate a document. Detect what KIND of document they need and advance their raw prompt into a precise writing brief for that kind, grounded in how real documents of each kind are built:

- agreement / NDA / contract: preamble naming the parties and date, recitals, numbered clauses (1., 1.1 — including definitions), obligations, term, exclusions, general provisions, and a signature block. Sober, precise, dense prose. No marketing language. Tables only to simplify genuinely complex terms.
- proposal: executive summary, problem, solution, scope of work, pricing/investment, timeline, credibility, next steps. Persuasive but concrete; often brief.
- report (financial, annual, status): executive summary, body sections presenting data, findings, outlook. Fact-based and precise; tables for data only.
- memo: header block (To / From / Date / Subject), short direct body, action items. No table of contents, no marketing cover.
- invoice: seller and client details, numbered line-items table, subtotal, tax, total, due date, payment terms. Compact, single page.
- flyer / event poster: minimal punchy text — headline, the key details (what, when, where, price), a call to action. No tables, no cover, no table of contents. Big-type energy.
- program / agenda: ordered timeline (times, items, owners), attendees. List-driven.
- academic: thesis, structured argument, evidence, citations, conclusion. Formal and structured.
- letter: sender/date/recipient block, salutation, body paragraphs, closing and signature.
- resume: contact header, summary, experience, skills, education. Compact and scannable.
- plan (business/project): overview, goals, structure, operations, milestones, financial outline.

Return ONLY a JSON object (no markdown fences, no commentary):
{
  "archetype": one of: ${ARCHETYPE_LIST.join(", ")},
  "title": "the document's title",
  "subtitle": "optional one-line subtitle or empty",
  "audience": "who reads this document",
  "tone": "tone in 2-6 words",
  "length": "one-page" | "short" | "medium" | "long",
  "tablePolicy": "none" | "tabular-only" | "data-driven",
  "specialElements": array subset of ["signature-block", "memo-header", "timeline", "contact-panel", "pricing-table"] — only ones relevant to this document,
  "sections": [{"heading": "...", "instruction": "what this section must cover, 1-2 sentences"}],
  "design": {"primary": "#hex", "accent": "#hex", "text": "#hex", "bg": "#hex", "headingFont": "...", "bodyFont": "..."},
  "notes": "short warning for the writer, or empty"
}

DESIGN rules: invent colors and fonts that fit this document's kind, subject, audience, and tone. headingFont and bodyFont must differ and be chosen from: Archivo, Public Sans, Space Grotesk, Inter, Manrope, DM Sans, Playfair Display, Source Serif 4, Sora, Libre Baskerville, Lora, Poppins, Fraunces. Legal and financial documents get restrained palettes; marketing documents may be expressive.
SECTION rules: 2-12 sections following the archetype's real conventions, in reading order. For one-page archetypes keep 2-5 short sections. The brief must reflect the USER'S ACTUAL REQUEST — never contradict it.`;

function extractJson(text: string): Record<string, unknown> {
  if (!text) throw new Error("Empty response");
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  return JSON.parse(body.slice(start, end + 1));
}

function asArchetype(v: unknown): Archetype {
  const hit = ARCHETYPE_LIST.find((a) => a === String(v ?? "").trim().toLowerCase());
  return hit ?? "generic";
}

function parsePlan(rawObj: Record<string, unknown>): ArchitectPlan {
  const sectionsRaw = Array.isArray(rawObj.sections) ? rawObj.sections : [];
  const sections: ArchitectSection[] = sectionsRaw
    .slice(0, 14)
    .map((s) => {
      const sec = (s ?? {}) as { heading?: unknown; instruction?: unknown };
      return {
        heading: String(sec.heading ?? "").slice(0, 120),
        instruction: String(sec.instruction ?? "").slice(0, 400),
      };
    })
    .filter((s) => s.heading.length > 0);
  return {
    archetype: asArchetype(rawObj.archetype),
    title: String(rawObj.title ?? "").slice(0, 160) || "Document",
    subtitle: String(rawObj.subtitle ?? "").slice(0, 200) || undefined,
    audience: String(rawObj.audience ?? "").slice(0, 160) || undefined,
    tone: String(rawObj.tone ?? "").slice(0, 80) || undefined,
    length: (["one-page", "short", "medium", "long"] as const).includes(rawObj.length as "one-page") ? (rawObj.length as ArchitectPlan["length"]) : "medium",
    tablePolicy: (["none", "tabular-only", "data-driven"] as const).includes(rawObj.tablePolicy as "none") ? (rawObj.tablePolicy as ArchitectPlan["tablePolicy"]) : "tabular-only",
    specialElements: Array.isArray(rawObj.specialElements)
      ? (rawObj.specialElements as unknown[]).map(String).slice(0, 6)
      : undefined,
    sections: sections.length > 0 ? sections : [{ heading: "Content", instruction: "Cover the user's request completely." }],
    design: ((rawObj.design ?? {}) as ArchitectDesign) || {},
    notes: String(rawObj.notes ?? "").slice(0, 400) || undefined,
  };
}

/** Run the architect: user prompt → structured plan (archetype + brief + design). */
export async function architectPlan(
  userPrompt: string,
  fileContext: string[]
): Promise<{ plan: ArchitectPlan; usage: UsageReport | null }> {
  const rawConfig = await getAIConfigAsync();
  const config = { ...rawConfig, model: modelIdForProvider(rawConfig.model, rawConfig.provider as AIProvider) };
  if (!config.apiKey) throw new Error("AI is not configured");

  const userContent = userPrompt.trim() || "(the user attached files only — infer the document from them)";
  const fileNote = fileContext.length > 0 ? `\n\nAttached reference material:\n${fileContext.join("\n\n---\n\n").slice(0, 6000)}` : "";

  const messages: MultimodalMessage[] = [
    { role: "system", content: ARCHITECT_SYSTEM_PROMPT },
    { role: "user", content: `Analyze this request and return the plan JSON now:\n\n${userContent.slice(0, 6000)}${fileNote}` },
  ];

  let raw = "";
  let usage: UsageReport | null = null;
  for await (const chunk of streamAIResponse(messages, config, { onUsage: (u) => { usage = u; } })) {
    raw += chunk;
  }
  const plan = parsePlan(extractJson(raw));
  if (plan.sections.length === 0) throw new Error("Architect returned no sections");
  return { plan, usage };
}

// ---------- Code fallback (no AI): keyword-scored classification ----------

const FALLBACK_KEYWORDS: Array<{ archetype: Archetype; words: string[]; weight: number }> = [
  { archetype: "agreement", words: ["nda", "non-disclosure", "agreement", "contract", "terms of service", "lease", "waiver", "consent form", "between"], weight: 3 },
  { archetype: "invoice", words: ["invoice", "bill", "amount due", "line items", "subtotal", "receipt for payment"], weight: 4 },
  { archetype: "memo", words: ["memo", "memorandum", "internal note", "staff notice"], weight: 4 },
  { archetype: "flyer", words: ["flyer", "poster", "garage sale", "open house", "party invite", "announcement", "save the date"], weight: 3 },
  { archetype: "proposal", words: ["proposal", "pitch", "quote for", "bid", "offering", "sponsorship"], weight: 3 },
  { archetype: "report", words: ["report", "analysis", "review of", "findings", "quarterly", "annual", "audit", "study"], weight: 2 },
  { archetype: "program", words: ["program", "agenda", "schedule", "itinerary", "run of show", "lineup", "ceremony"], weight: 2 },
  { archetype: "plan", words: ["business plan", "project plan", "roadmap", "strategy for", "launch plan"], weight: 3 },
  { archetype: "academic", words: ["essay", "research", "thesis", "literature", "paper on", "citation"], weight: 3 },
  { archetype: "letter", words: ["letter", "cover letter", "dear", "sincerely", "recommendation for"], weight: 3 },
  { archetype: "resume", words: ["resume", "curriculum vitae", "cv for", "work experience"], weight: 4 },
];

const FALLBACK_CONVENTIONS: Record<Archetype, Pick<ArchitectPlan, "tablePolicy" | "specialElements" | "length"> & { sections: ArchitectSection[] }> = {
  agreement: {
    length: "medium", tablePolicy: "tabular-only", specialElements: ["signature-block"],
    sections: [
      { heading: "Parties and Recitals", instruction: "Name the parties, the effective date, and the background." },
      { heading: "Definitions", instruction: "Define the key terms used throughout." },
      { heading: "Obligations and Term", instruction: "Core obligations, duration, and scope." },
      { heading: "General Provisions", instruction: "Governing law, severability, entire agreement." },
      { heading: "Signatures", instruction: "Signature block for each party with names and dates." },
    ],
  },
  proposal: {
    length: "medium", tablePolicy: "tabular-only", specialElements: ["pricing-table"],
    sections: [
      { heading: "Executive Summary", instruction: "One-paragraph pitch of the solution and value." },
      { heading: "Understanding the Need", instruction: "The client's problem or opportunity." },
      { heading: "Proposed Solution", instruction: "The offering, scope, and approach." },
      { heading: "Investment", instruction: "Pricing and commercial terms." },
      { heading: "Next Steps", instruction: "How to proceed." },
    ],
  },
  report: {
    length: "medium", tablePolicy: "data-driven", specialElements: [],
    sections: [
      { heading: "Executive Summary", instruction: "Key findings up front." },
      { heading: "Findings", instruction: "Detailed facts, data, and analysis." },
      { heading: "Outlook and Recommendations", instruction: "Conclusion and recommended actions." },
    ],
  },
  memo: {
    length: "short", tablePolicy: "tabular-only", specialElements: ["memo-header"],
    sections: [
      { heading: "Purpose", instruction: "Why this memo was written." },
      { heading: "Details", instruction: "The information being communicated." },
      { heading: "Action Items", instruction: "What recipients must do, with owners and dates." },
    ],
  },
  invoice: {
    length: "one-page", tablePolicy: "data-driven", specialElements: ["pricing-table"],
    sections: [
      { heading: "Invoice Details", instruction: "Invoice number, dates, parties." },
      { heading: "Line Items", instruction: "Itemized table of goods/services, quantities, prices." },
      { heading: "Totals and Payment Terms", instruction: "Subtotal, tax, total due, due date, payment instructions." },
    ],
  },
  flyer: {
    length: "one-page", tablePolicy: "none", specialElements: [],
    sections: [
      { heading: "Headline", instruction: "A short, bold headline for the event or offer." },
      { heading: "Key Details", instruction: "What, when, where, price — minimal text." },
      { heading: "Call to Action", instruction: "What the reader should do next, plus contact." },
    ],
  },
  program: {
    length: "short", tablePolicy: "none", specialElements: ["timeline"],
    sections: [
      { heading: "Welcome", instruction: "One-line welcome for attendees." },
      { heading: "Order of Events", instruction: "Timeline with times, items, and owners." },
      { heading: "Notes", instruction: "Logistics, thanks, contacts." },
    ],
  },
  academic: {
    length: "long", tablePolicy: "tabular-only", specialElements: [],
    sections: [
      { heading: "Introduction", instruction: "Thesis statement and context." },
      { heading: "Analysis", instruction: "Structured argument with evidence." },
      { heading: "Conclusion", instruction: "Summary of the argument and implications." },
    ],
  },
  letter: {
    length: "short", tablePolicy: "none", specialElements: [],
    sections: [
      { heading: "Salutation and Opening", instruction: "Recipient, greeting, and purpose." },
      { heading: "Body", instruction: "The letter's substance." },
      { heading: "Closing", instruction: "Closing line and signature." },
    ],
  },
  resume: {
    length: "one-page", tablePolicy: "none", specialElements: [],
    sections: [
      { heading: "Summary", instruction: "Professional summary." },
      { heading: "Experience", instruction: "Roles with dates and achievements." },
      { heading: "Skills and Education", instruction: "Skills and education history." },
    ],
  },
  plan: {
    length: "long", tablePolicy: "tabular-only", specialElements: [],
    sections: [
      { heading: "Overview", instruction: "What this plan covers and its goals." },
      { heading: "Operations and Milestones", instruction: "How it runs, with a milestone timeline." },
      { heading: "Financial Outline", instruction: "Budget, costs, and projections." },
    ],
  },
  generic: {
    length: "medium", tablePolicy: "tabular-only", specialElements: [],
    sections: [
      { heading: "Overview", instruction: "Purpose and context." },
      { heading: "Main Content", instruction: "The substance of the request." },
      { heading: "Summary and Next Steps", instruction: "Wrap-up and actions." },
    ],
  },
};

/** No-AI fallback: classify by keywords and emit conservative conventions. */
export function heuristicArchitect(userPrompt: string): ArchitectPlan {
  const t = userPrompt.toLowerCase();
  let best: { archetype: Archetype; score: number } = { archetype: "generic", score: 0 };
  for (const entry of FALLBACK_KEYWORDS) {
    const score = entry.words.reduce((acc, w) => acc + (t.includes(w) ? 1 : 0), 0) * entry.weight;
    if (score > best.score) best = { archetype: entry.archetype, score };
  }
  const conv = FALLBACK_CONVENTIONS[best.archetype];
  return {
    archetype: best.archetype,
    title: "Document",
    length: conv.length,
    tablePolicy: conv.tablePolicy,
    specialElements: conv.specialElements,
    sections: conv.sections,
    design: {},
  };
}
