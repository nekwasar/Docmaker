// Brand colors
export const Brand = {
  navy: '#121660',
  teal: '#3CAE8B',
  blue: '#0171DF',
  yellow: '#FFD140',
};

// App constants
export const APP_NAME = 'Docmaker';
export const APP_VERSION = '1.0.0';
export const APP_URL = 'https://docmaker.io';

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

// Max file size
export const MAX_FILE_SIZE_MB = 50;
export const MAX_IMAGES_PER_DOC = 5;
export const TRANSFER_CODE_LENGTH = 6;
export const TRANSFER_EXPIRY_HOURS = 24;
