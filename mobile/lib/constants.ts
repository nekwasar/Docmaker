// Credit costs
export const CREDIT_COSTS = {
  GENERATE: 1, // per 100 words
  EDIT: 1, // per 10 edits
  TRANSLATE: 1, // per 50 words
  OCR: 1, // per 50 words
  CHANGE_STYLE: 1, // per 100 words
  SUMMARIZE: 1, // per 100 words
  IMAGE: 1, // per image
  QA: 1, // per question
} as const;

// Free tools (no credits)
export const FREE_TOOLS = [
  'merge_pdf',
  'split_pdf',
  'compress_pdf',
  'edit_pdf',
  'esign',
  'file_transfer',
  'file_viewer',
  'convert',
] as const;

// Supported languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
] as const;

// Document structures
export const DOC_STRUCTURES = [
  { id: 'auto', name: 'Auto', description: 'AI detects structure' },
  { id: 'invoice', name: 'Invoice', description: 'Business invoice' },
  { id: 'report', name: 'Report', description: 'Professional report' },
  { id: 'contract', name: 'Contract', description: 'Legal contract' },
  { id: 'proposal', name: 'Proposal', description: 'Business proposal' },
  { id: 'resume', name: 'Resume', description: 'Professional resume' },
  { id: 'essay', name: 'Essay', description: 'Academic essay' },
  { id: 'letter', name: 'Letter', description: 'Formal letter' },
  { id: 'memo', name: 'Memo', description: 'Business memo' },
  { id: 'meeting_notes', name: 'Meeting Notes', description: 'Meeting minutes' },
] as const;

// Compression levels
export const COMPRESSION_LEVELS = [
  { id: 'low', name: 'Low', description: 'Best quality' },
  { id: 'medium', name: 'Medium', description: 'Balanced' },
  { id: 'high', name: 'High', description: 'Smallest file' },
] as const;

// App constants
export const APP_NAME = 'Docmaker';
export const APP_VERSION = '1.0.0';
export const MAX_IMAGES_PER_DOC = 5;
export const MAX_FILE_SIZE_MB = 50;
export const TRANSFER_CODE_LENGTH = 6;
export const TRANSFER_EXPIRY_HOURS = 24;

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
} as const;
