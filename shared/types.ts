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
    creditsUsed: number;
    creditsRemaining: number;
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
    creditsUsed: number;
    creditsRemaining: number;
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
    creditsUsed: number;
    creditsRemaining: number;
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

// Credits
export interface CreditBalance {
  balance: number;
  used: number;
  plan: 'free' | 'pro';
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
