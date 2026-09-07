// System prompts and template prompts for AI document generation

export const SYSTEM_PROMPT = `You are Docmaker, an expert document generator. When given a document type and description, generate a professional, well-structured document. 

Rules:
- Use markdown formatting with proper headings (#, ##, ###)
- Use tables where appropriate
- Include realistic placeholder data when needed
- Structure documents with clear sections
- Use professional, formal language
- Keep formatting clean and readable
- Do NOT include meta-commentary about the document
- Output ONLY the document content, nothing else`;

// Template prompts per document type
export const DOCUMENT_TEMPLATES: Record<string, { prompt: string; description: string }> = {
  auto: {
    prompt: "",
    description: "AI detects the best structure",
  },
  invoice: {
    prompt: `Create a professional invoice with:
- Company header with name, address, and contact info
- Invoice number: INV-001 and date
- Bill To / Ship To sections
- Itemized table with columns: Description, Quantity, Unit Price, Amount
- 3-5 line items with realistic products/services
- Subtotal, Tax (10%), and Total
- Payment terms (Net 30)
- Bank details for payment`,
    description: "Business invoice",
  },
  report: {
    prompt: `Create a professional business report with:
- Executive Summary (2-3 paragraphs)
- Introduction and objectives
- Key Findings (3 main points with details)
- Data Analysis section
- Conclusions and Recommendations
- Use formal business language
- Include section numbers`,
    description: "Professional report",
  },
  contract: {
    prompt: `Create a professional service agreement contract with:
- Party identification (Company A and Company B)
- Effective date
- Scope of services (detailed)
- Terms and conditions
- Payment terms and schedule
- Intellectual property clause
- Confidentiality clause
- Termination terms
- Dispute resolution
- Signatures section
- Use legal but readable language`,
    description: "Legal contract",
  },
  proposal: {
    prompt: `Create a compelling business proposal with:
- Cover page with project title
- Executive summary
- Company overview and qualifications
- Understanding of the project
- Proposed solution and approach
- Timeline and milestones
- Team and resources
- Budget and pricing
- Why choose us section
- Next steps and CTA
- Use persuasive but professional tone`,
    description: "Business proposal",
  },
  resume: {
    prompt: `Create a professional resume with:
- Contact information section
- Professional summary (3-4 sentences)
- Work experience (3 positions with company, title, dates, 3-4 bullet points each)
- Education (2 entries)
- Skills section (technical and soft skills)
- Clean, ATS-friendly formatting
- Use action verbs and quantified achievements`,
    description: "Professional resume",
  },
  essay: {
    prompt: `Create a well-structured academic essay with:
- Compelling introduction with thesis statement
- 3 body paragraphs with topic sentences
- Evidence and examples in each paragraph
- Smooth transitions between sections
- Strong conclusion that reinforces the thesis
- Formal academic tone
- Use the five-paragraph essay structure`,
    description: "Academic essay",
  },
  letter: {
    prompt: `Create a formal business letter with:
- Sender's address and date
- Recipient's address
- Formal salutation
- Opening paragraph stating purpose
- 2-3 body paragraphs with details
- Closing paragraph with call to action
- Professional sign-off
- Sender's name and title
- Use formal business letter formatting`,
    description: "Formal letter",
  },
  memo: {
    prompt: `Create a professional business memo with:
- MEMORANDUM header
- To, From, Date, Subject fields
- Opening statement of purpose
- Background/context section
- Key points (bulleted list)
- Action items or next steps
- Closing
- Use concise, direct language`,
    description: "Business memo",
  },
  meeting_notes: {
    prompt: `Create structured meeting notes with:
- Meeting title and date
- Attendees list
- Agenda items discussed
- Key discussion points for each item
- Decisions made (bulleted)
- Action items with owners and deadlines
- Next meeting date
- Use clear, concise formatting`,
    description: "Meeting minutes",
  },
};

// Template previews for the carousel
export const TEMPLATE_PREVIEWS = [
  {
    id: "service-agreement",
    name: "Service Agreement",
    category: "contract",
    color: "#121660",
    prompt: DOCUMENT_TEMPLATES.contract.prompt,
  },
  {
    id: "modern-resume",
    name: "Modern Resume",
    category: "resume",
    color: "#0171DF",
    prompt: DOCUMENT_TEMPLATES.resume.prompt,
  },
  {
    id: "business-invoice",
    name: "Business Invoice",
    category: "invoice",
    color: "#3CAE8B",
    prompt: DOCUMENT_TEMPLATES.invoice.prompt,
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    category: "proposal",
    color: "#FFD140",
    prompt: DOCUMENT_TEMPLATES.proposal.prompt,
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    category: "meeting_notes",
    color: "#121660",
    prompt: DOCUMENT_TEMPLATES.meeting_notes.prompt,
  },
];

// Build the full prompt based on doc type and user input
export function buildPrompt(userText: string, structure: string): string {
  const template = DOCUMENT_TEMPLATES[structure];
  if (!template || !template.prompt) {
    // Auto or unknown — let AI decide
    return userText || "Generate a professional document based on the following description:";
  }
  // Combine template with user's additional context
  if (userText.trim()) {
    return `${template.prompt}\n\nAdditional context from user: ${userText}`;
  }
  return template.prompt;
}
