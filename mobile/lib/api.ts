import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  GenerateRequest,
  GenerateResponse,
  TranslateRequest,
  TranslateResponse,
  OCRRequest,
  OCRResponse,
  ApiResponse,
  Transfer,
} from './types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.docmaker.co';

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

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async loadToken() {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
    return token;
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/login',
      { email, password }
    );
    if (response.data.success && response.data.data?.token) {
      await this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/register',
      { email, password, name }
    );
    if (response.data.success && response.data.data?.token) {
      await this.setToken(response.data.data.token);
    }
    return response.data;
  }

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
