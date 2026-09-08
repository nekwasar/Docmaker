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

export const DOCUMENT_TEMPLATES: Record<string, { prompt: string; description: string }> = {
  auto: {
    prompt: "",
    description: "AI detects the best structure",
  },
  business: {
    prompt: `Create a professional business document. Choose the most appropriate format based on the description below. Include:
- Clear professional structure
- Proper formatting with headings and sections
- Realistic data and details
- Formal business tone
- Action items or next steps where appropriate`,
    description: "Business document (invoice, report, contract, proposal, memo)",
  },
  personal: {
    prompt: `Create a personal document. Choose the most appropriate format based on the description below. Include:
- Professional but approachable tone
- Proper letter or resume formatting
- Clear structure with sections
- Appropriate salutations and closings`,
    description: "Personal document (resume, letter, cover letter)",
  },
  academic: {
    prompt: `Create an academic document. Choose the most appropriate format based on the description below. Include:
- Clear thesis statement
- Evidence-based arguments
- Proper academic structure with citations
- Formal academic tone
- Conclusion that reinforces the thesis`,
    description: "Academic document (essay, paper, research)",
  },
  meeting: {
    prompt: `Create structured meeting notes. Include:
- Meeting title and date
- Attendees list
- Agenda items discussed
- Key discussion points
- Decisions made (bulleted)
- Action items with owners and deadlines
- Next meeting date`,
    description: "Meeting notes and minutes",
  },
};

export const TEMPLATE_PREVIEWS = [
  { id: "business", name: "Business Report", category: "business", color: "#121660", prompt: DOCUMENT_TEMPLATES.business.prompt },
  { id: "personal", name: "Resume / Letter", category: "personal", color: "#0171DF", prompt: DOCUMENT_TEMPLATES.personal.prompt },
  { id: "academic", name: "Academic Essay", category: "academic", color: "#3CAE8B", prompt: DOCUMENT_TEMPLATES.academic.prompt },
  { id: "meeting", name: "Meeting Notes", category: "meeting", color: "#FFD140", prompt: DOCUMENT_TEMPLATES.meeting.prompt },
];

export function buildPrompt(userText: string, structure: string): string {
  const template = DOCUMENT_TEMPLATES[structure];
  if (!template || !template.prompt) {
    return userText || "Generate a professional document based on the following description:";
  }
  if (userText.trim()) {
    return `${template.prompt}\n\nAdditional context from user: ${userText}`;
  }
  return template.prompt;
}
