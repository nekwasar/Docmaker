export type TemplateCategory = "Business" | "Personal" | "Academic" | "Meeting" | "Legal";

export interface Template {
  id: string;
  title: string;
  author: string;
  category: TemplateCategory;
  thumbnails: string[];
  content: string;
}

// Managed via web admin — see Docmaker/web/src/data/templates.ts
export const templates: Template[] = [];
