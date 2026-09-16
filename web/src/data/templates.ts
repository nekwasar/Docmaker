export type TemplateCategory = "Business" | "Personal" | "Academic" | "Meeting" | "Legal";

export interface Template {
  id: string;
  title: string;
  author: string;
  category: TemplateCategory;
  thumbnails: string[];
  content: string;
  fileUrl?: string | null;
}

// All templates are now managed via Admin > Templates (DB).
// This array is intentionally empty — do not add hard-coded templates here.
// Use /upload/template to upload.
export const templates: Template[] = [];
