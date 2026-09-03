import axios, { AxiosInstance } from 'axios';
import type { ApiResponse, User, GenerateRequest, GenerateResponse, TranslateRequest, TranslateResponse, OCRRequest, OCRResponse, Transfer } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.token = token;
      }
    }
    return this.token;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth
  async getMe() {
    const response = await this.client.get<ApiResponse<User>>('/api/auth/me');
    return response.data;
  }

  // AI Generation
  async generate(request: GenerateRequest) {
    const response = await this.client.post<ApiResponse<GenerateResponse>>(
      '/api/generate',
      request
    );
    return response.data;
  }

  // Translation
  async translate(request: TranslateRequest) {
    const response = await this.client.post<ApiResponse<TranslateResponse>>(
      '/api/translate',
      request
    );
    return response.data;
  }

  // OCR
  async extractText(request: OCRRequest) {
    const response = await this.client.post<ApiResponse<OCRResponse>>(
      '/api/ocr',
      request
    );
    return response.data;
  }

  // PDF Tools
  async mergePDF(fileIds: string[], order: number[]) {
    const response = await this.client.post<ApiResponse<{ downloadUrl: string }>>(
      '/api/pdf/merge',
      { fileIds, order }
    );
    return response.data;
  }

  async splitPDF(fileId: string, ranges: string[]) {
    const response = await this.client.post<ApiResponse<{ downloadUrls: string[] }>>(
      '/api/pdf/split',
      { fileId, ranges }
    );
    return response.data;
  }

  async compressPDF(fileId: string, level: 'low' | 'medium' | 'high') {
    const response = await this.client.post<ApiResponse<{ downloadUrl: string; originalSize: number; compressedSize: number }>>(
      '/api/pdf/compress',
      { fileId, level }
    );
    return response.data;
  }

  // File Transfer
  async generateTransferCode(fileIds: string[]) {
    const response = await this.client.post<ApiResponse<Transfer>>(
      '/api/transfer/generate',
      { fileIds }
    );
    return response.data;
  }

  async receiveFiles(code: string) {
    const response = await this.client.get<ApiResponse<Transfer>>(
      `/api/transfer/${code}`
    );
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
