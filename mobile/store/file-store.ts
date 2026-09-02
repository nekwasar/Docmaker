import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Document } from '../../shared/types';

interface FileState {
  files: Document[];
  selectedFile: Document | null;
  isLoading: boolean;
  
  addFile: (file: Document) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  selectFile: (file: Document) => void;
  clearSelection: () => void;
  loadFiles: () => Promise<void>;
  getRecentFiles: (limit?: number) => Document[];
}

const FILES_STORAGE_KEY = 'docmaker_files';

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  selectedFile: null,
  isLoading: false,

  addFile: async (file: Document) => {
    const files = [...get().files, file];
    set({ files });
    await AsyncStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  },

  removeFile: async (fileId: string) => {
    const files = get().files.filter((f) => f.id !== fileId);
    set({ files });
    await AsyncStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  },

  selectFile: (file: Document) => {
    set({ selectedFile: file });
  },

  clearSelection: () => {
    set({ selectedFile: null });
  },

  loadFiles: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem(FILES_STORAGE_KEY);
      if (data) {
        const files = JSON.parse(data) as Document[];
        set({ files, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  getRecentFiles: (limit = 10) => {
    return get()
      .files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));
