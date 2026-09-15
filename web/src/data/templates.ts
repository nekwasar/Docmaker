export type TemplateCategory = "Business" | "Personal" | "Academic" | "Meeting" | "Legal";

export interface Template {
  id: string;
  title: string;
  author: string;
  category: TemplateCategory;
  thumbnails: string[];
  content: string;
}

export const templates: Template[] = [
  // Uploaded document — shown first on homepage Generate so you can see live preview
  {
    id: "tpl-uploaded-q3-report",
    title: "Uploaded — Q3 Financial Report.pdf",
    author: "You • just now",
    category: "Business",
    thumbnails: [
      "https://picsum.photos/seed/uploaded1/640/400",
      "https://picsum.photos/seed/uploaded2/640/400",
    ],
    content: `# Q3 2025 Financial Report — Extracted from your upload

**Source:** Q3_Financials_2025.pdf — 3 pages • Extracted Aug 15, 2025

## Executive Summary
Revenue grew 18% QoQ to $4.2M. Gross margin held at 64%. Operating expenses increased 9% due to headcount.

| Metric | Q2 2025 | Q3 2025 | Change |
|--------|---------|---------|--------|
| Revenue | $3.56M | $4.20M | +18% |
| Gross Profit | $2.28M | $2.69M | +18% |
| OPEX | $1.41M | $1.54M | +9% |
| Net Income | $0.87M | $1.15M | +32% |

## Key Highlights
- **Enterprise** now 42% of revenue (vs 31% in Q2)
- Churn improved to 2.1% (from 2.8%)
- Cash balance $8.4M

> This is how your uploaded document renders — as a live paginated preview. Attach any PDF/DOCX/TXT/CSV/XLSX in the generator and you'll see it here before you generate.`,
  },
  // real document previews — thumbnails kept for OG but UI now uses live DocumentPreview
  // to beat docmaker.ai, we render actual content, not placeholder images
  {
    id: "tpl-invoice-pro",
    title: "Modern Business Invoice",
    author: "Sophia Chen",
    category: "Business",
    thumbnails: [
      "https://picsum.photos/seed/invoice1/640/400",
      "https://picsum.photos/seed/invoice2/640/400",
    ],
    content: `# INVOICE — Modern Business

**From:** Nova Studio Inc.
123 Business Ave, San Francisco, CA 94105
hello@novastudio.co | (415) 555-0142

**Bill To:** Acme Corp — atten. Alex Rivera
**Invoice #:** INV-2025-042
**Date:** 2025-08-15 — Due: Net 14

| # | Description | Qty | Rate | Amount |
|---|-------------|-----|------|--------|
| 1 | Brand Identity — Logo & Guidelines | 1 | $2,400.00 | $2,400.00 |
| 2 | Website — Landing + 4 pages | 1 | $3,200.00 | $3,200.00 |
| 3 | Social Kit — 12 templates | 1 | $850.00 | $850.00 |

**Subtotal:** $6,450.00
**Tax (8.5%):** $548.25
**Total Due:** **$6,998.25**

**Notes:** Payment via ACH or wire. Thank you for your business!`,
  },
  {
    id: "tpl-resume-clean",
    title: "Clean Personal Resume",
    author: "Marcus Doyle",
    category: "Personal",
    thumbnails: [
      "https://picsum.photos/seed/resume1/640/400",
      "https://picsum.photos/seed/resume2/640/400",
    ],
    content: `# Marcus Doyle — Senior Product Designer

San Francisco, CA • marcus.doyle@email.com • (415) 555-0199 • linkedin.com/in/marcusdoyle

## Summary
Product designer with 7+ years crafting human-centered digital products for startups and Fortune 500. Passionate about design systems, prototyping, and turning complex problems into simple experiences.

## Experience
**Senior Product Designer — Linear, SF** *2021 — Present*
- Led redesign of issue tracking workflow, reducing time-to-resolution by 32%
- Built design system used across 4 products

**Product Designer — Stripe, SF** *2018 — 2021*
- Shipped Checkout redesign adopted by 200k+ merchants

## Education
B.A. Visual Communication — RISD, 2018

## Skills
Figma • Framer • React • Design Systems • User Research • Prototyping`,
  },
  {
    id: "tpl-research-essay",
    title: "Academic Research Essay",
    author: "Dr. Elena Kowalska",
    category: "Academic",
    thumbnails: [
      "https://picsum.photos/seed/academic1/640/400",
      "https://picsum.photos/seed/academic2/640/400",
    ],
    content: `# The Impact of Remote Work on Urban Design: A Systematic Review

**Abstract:** This essay examines how the rise of remote work since 2020 has reshaped urban planning priorities. Through analysis of 42 peer-reviewed studies, we argue that hybrid work demands a rethinking of transit, housing, and public space.

## 1. Introduction
Cities were built around the commute. When that commute disappears, what remains?

## 2. Literature Review
Existing research clusters around three themes: commercial vacancy, housing demand shifts, and the "15-minute city" concept.

## 3. Analysis
We identify a convergence toward mixed-use neighborhoods where living, working, and leisure overlap.

## 4. Conclusion
Remote work does not empty cities; it redistributes activity. Planners should prioritize flexibility over density.`,
  },
  {
    id: "tpl-meeting-notes",
    title: "Weekly Meeting Notes",
    author: "Priya Nair",
    category: "Meeting",
    thumbnails: [
      "https://picsum.photos/seed/meeting1/640/400",
      "https://picsum.photos/seed/meeting2/640/400",
    ],
    content: `# Weekly Sync — Product Team
**Date:** Aug 12, 2025 • **Attendees:** Priya, Jon, Maya, Luis • **Facilitator:** Priya

## Agenda
1. Sprint Review
2. Roadmap Q3
3. Blockers

## Discussion
- **Sprint Review:** Shipped onboarding v2, NPS +8. QA flagged edge case on file upload — fix by Aug 14.
- **Roadmap Q3:** Prioritize AI Generate polish and Templates launch.
- **Blockers:** Design needs final copy for pricing page.

## Decisions
- Move Templates launch to Aug 20
- Pause OCR improvements until September

## Action Items
- [ ] Jon — Fix upload edge case — Due Aug 14
- [ ] Maya — Final pricing copy — Due Aug 15
- [ ] Priya — Share updated roadmap — Due Aug 13`,
  },
  {
    id: "tpl-legal-nda",
    title: "Mutual NDA — Startup Friendly",
    author: "Alex Rivera, Esq.",
    category: "Legal",
    thumbnails: [
      "https://picsum.photos/seed/legal1/640/400",
      "https://picsum.photos/seed/legal2/640/400",
    ],
    content: `# MUTUAL NON-DISCLOSURE AGREEMENT

**This Agreement** is made on August 15, 2025, between **Nova Studio Inc.** ("Disclosing Party") and **Acme Corp** ("Receiving Party").

## 1. Definition of Confidential Information
All non-public information disclosed orally, visually, or in writing, including business plans, financials, and technical data.

## 2. Obligations
Receiving Party shall (a) hold in confidence, (b) not disclose to third parties, (c) use only for Purpose.

## 3. Term
Obligations survive for 2 years from disclosure date.

## 4. Return of Materials
Upon request, Receiving Party shall promptly return or destroy all Confidential Information.

**Agreed:**

_________________________      _________________________
Nova Studio Inc.                 Acme Corp
Date: __________                 Date: __________`,
  },
];
