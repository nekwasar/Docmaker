// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'pro' | 'admin';
  credits: number;
  createdAt: string;
}

// Document types
export interface Document {
  id: string;
  title: string;
  content: string;
  format: 'pdf' | 'docx' | 'txt' | 'md';
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

// File types
export interface FileItem {
  id: string;
  name: string;
  format: string;
  size: number;
  uri: string;
  createdAt: string;
}

// AI Generation
export interface GenerateRequest {
  text: string;
  structure?: string;
  template?: string;
}

export interface GenerateResponse {
  success: boolean;
  data: {
    documentId: string;
    content: string;
    wordCount: number;
  };
}

// PDF Tools
export interface PDFMergeRequest {
  fileIds: string[];
  order: number[];
}

export interface PDFSplitRequest {
  fileId: string;
  ranges: string[];
}

export interface PDFCompressRequest {
  fileId: string;
  level: 'low' | 'medium' | 'high';
}

// Translation
export interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslateResponse {
  success: boolean;
  data: {
    translatedText: string;
  };
}

// OCR
export interface OCRRequest {
  imageBase64: string;
}

export interface OCRResponse {
  success: boolean;
  data: {
    text: string;
    confidence: number;
  };
}

// File Transfer
export interface TransferRequest {
  fileIds: string[];
  receiverEmail?: string;
}

export interface TransferResponse {
  success: boolean;
  data: {
    transferCode: string;
    qrCodeUrl: string;
    expiresAt: string;
  };
}

export interface Transfer {
  id: string;
  transferCode: string;
  fileIds: string[];
  createdAt: string;
  expiresAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Image attachment
export interface ImageAttachment {
  uri: string;
  base64?: string;
  description?: string;
}

// Annotation
export interface Annotation {
  id: string;
  type: 'text' | 'image' | 'draw' | 'shape';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
}

// PDF Document
export interface PDFDocument {
  uri: string;
  totalPages: number;
  currentPage: number;
}

// PDF File
export interface PDFFile {
  id: string;
  name: string;
  uri: string;
}

// Signature
export interface SignatureData {
  imageUri: string;
  base64: string;
}

// Conversion pairs
export interface ConversionPair {
  from: string;
  to: string;
  slug: string;
}
