import { create } from 'zustand';
import api from '../lib/api';

interface TransferState {
  transferCode: string | null;
  qrCodeUrl: string | null;
  expiresAt: string | null;
  isGenerating: boolean;
  error: string | null;
  
  generateTransferCode: (fileIds: string[]) => Promise<void>;
  clearTransfer: () => void;
  clearError: () => void;
}

export const useTransferStore = create<TransferState>((set) => ({
  transferCode: null,
  qrCodeUrl: null,
  expiresAt: null,
  isGenerating: false,
  error: null,

  generateTransferCode: async (fileIds: string[]) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await api.generateTransferCode(fileIds);
      if (response.success && response.data) {
        set({
          transferCode: response.data.transferCode,
          qrCodeUrl: response.data.qrCodeUrl,
          expiresAt: response.data.expiresAt,
          isGenerating: false,
        });
      } else {
        set({ error: response.error || 'Failed to generate code', isGenerating: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Network error', isGenerating: false });
    }
  },

  clearTransfer: () => {
    set({ transferCode: null, qrCodeUrl: null, expiresAt: null });
  },

  clearError: () => set({ error: null }),
}));
