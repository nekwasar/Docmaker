# Docmaker Mobile — Development Plan

## Overview

| Aspect | Details |
|--------|---------|
| **Platform** | React Native (Expo SDK 57) |
| **Target** | iOS + Android |
| **Design System** | Sleek Bento-Grid & Tactile Neomorphic-Flat |
| **Tab Order** | Files (Home) → AI Generate → Transfer → Profile |

---

## Design System Tokens

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Canvas / Surface | `#F4F6FB` | Main app background |
| Primary Brand | `#0B3954` | Active tabs, primary CTAs, emphasis text |
| Vibrant Action | `#007AFF` | Highlights, selections, primary status |
| Emerald | `#10B981` | Spreadsheets, success states |
| Sunny Amber | `#FFB703` | Scans, receipts, warning states |
| Vibrant Teal | `#14B8A6` | Identity, vault items |
| Royal Indigo | `#6366F1` | PDFs, high importance |
| Text Primary | `#0F172A` | Slate black for headings |
| Text Secondary | `#64748B` | Muted grey for subtext |
| Card Fill | `#FFFFFF` | White cards |

### Elevation & Shadows

- Card shadow: `0px 10px 30px rgba(15, 23, 42, 0.04)`
- Pressed state: `scale(0.98)` with reduced shadow
- Outer radius: `24px` (rounded-3xl)
- Inner radius: `16px` (rounded-2xl) or `12px` (rounded-xl)
- Border: `1px solid rgba(226, 232, 240, 0.6)`

### Typography

- Font: Inter, SF Pro Display, or Plus Jakarta Sans
- Headings: Bold, tight tracking, `#0F172A`
- Body: Medium weight, 12-14px
- Numbers: 28-36px display with subtle badges

### Layout

- Bento grid with asymmetric cards
- Action pills: `rounded-full` with icon + arrow
- Micro-badges with translucent fills
- Padding: `p-5` or `p-6`
- Gaps: `gap-3` or `gap-4`

---

## App Structure

```
mobile/app/
├── _layout.tsx                          # Root layout (Stack)
├── (tabs)/
│   ├── _layout.tsx                      # Tab navigation (4 tabs)
│   ├── index.tsx                        # Files (HOME)
│   ├── ai.tsx                           # AI Generate
│   ├── transfer.tsx                     # File Transfer
│   └── profile.tsx                      # Account/Settings
├── generate/
│   ├── index.tsx                        # AI input screen
│   └── [id].tsx                         # Generated doc preview
├── pdf/
│   ├── viewer.tsx                       # PDF Viewer
│   ├── editor.tsx                       # PDF Editor
│   ├── merge.tsx                        # Merge PDFs
│   ├── split.tsx                        # Split PDF
│   ├── compress.tsx                     # Compress PDF
│   ├── sign.tsx                         # E-Signatures
│   └── encrypt.tsx                      # Password-protect
├── camera/
│   ├── scanner.tsx                      # Document scanner
│   └── ocr.tsx                          # OCR processing
├── convert/
│   └── index.tsx                        # File conversion
├── translate/
│   └── index.tsx                        # Document translation
├── voice/
│   └── index.tsx                        # Voice to Document
├── settings/
│   ├── index.tsx                        # Settings menu
│   ├── account.tsx                      # Account management
│   └── about.tsx                        # About page
└── auth/
    ├── login.tsx                        # Login screen
    └── register.tsx                     # Register screen
```

---

## Zustand Stores

### `user-store.ts`
```typescript
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}
```

### `file-store.ts`
```typescript
interface FileState {
  files: FileItem[];
  selectedFile: FileItem | null;
  selectedFilter: 'all' | 'pdf' | 'doc' | 'image' | 'sheet';
  isLoading: boolean;
  sortBy: 'date' | 'name' | 'size';
  addFile: (file: FileItem) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  selectFile: (file: FileItem) => void;
  clearSelection: () => void;
  setFilter: (filter: string) => void;
  setSortBy: (sort: string) => void;
  loadFiles: () => Promise<void>;
  getFilteredFiles: () => FileItem[];
}
```

### `generate-store.ts`
```typescript
interface GenerateState {
  inputValue: string;
  selectedStructure: string | null;
  images: ImageAttachment[];
  isGenerating: boolean;
  progress: number;
  streamingContent: string;
  generatedDocument: Document | null;
  setInputValue: (value: string) => void;
  setStructure: (structure: string) => void;
  addImage: (image: ImageAttachment) => void;
  removeImage: (index: number) => void;
  generate: () => Promise<void>;
  cancel: () => void;
  clear: () => void;
}
```

### `pdf-store.ts`
```typescript
interface PDFState {
  currentPDF: PDFDocument | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  isEditing: boolean;
  editTool: string | null;
  annotations: Annotation[];
  mergeFiles: PDFFile[];
  splitRanges: string[];
  compressionLevel: string;
  signature: SignatureData | null;
  loadPDF: (fileUri: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  toggleEdit: () => void;
  setEditTool: (tool: string) => void;
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;
  merge: () => Promise<string>;
  split: () => Promise<string[]>;
  compress: () => Promise<{ downloadUrl: string; originalSize: number; compressedSize: number }>;
  sign: () => Promise<string>;
}
```

### `transfer-store.ts`
```typescript
interface TransferState {
  selectedFiles: FileItem[];
  transferCode: string | null;
  qrCodeUrl: string | null;
  expiresAt: string | null;
  isSending: boolean;
  receiveCode: string;
  receivedFiles: FileItem[];
  isReceiving: boolean;
  recentTransfers: Transfer[];
  selectFile: (file: FileItem) => void;
  deselectFile: (fileId: string) => void;
  generateTransferCode: () => Promise<void>;
  receiveFiles: (code: string) => Promise<void>;
  clearTransfer: () => void;
}
```

### `settings-store.ts`
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  analyticsEnabled: boolean;
  autoSave: boolean;
  pushEnabled: boolean;
  setTheme: (theme: string) => void;
  setLanguage: (language: string) => void;
  toggleAnalytics: () => void;
  toggleAutoSave: () => void;
  togglePushNotifications: () => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}
```

---

## Screen Plans

### Tab 1: Files (HOME)

```
┌─────────────────────────────────┐
│  Docmaker                [🔍]  │
├─────────────────────────────────┤
│  [All] [PDF] [Doc] [Image] [Sheet]│  ← Filter pills
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ 📄 Contract_Final.pdf   │   │  ← File cards
│  │ 2.4 MB • Today 3:45 PM  │   │     with bento layout
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 📄 Report_Q1.docx       │   │
│  │ 1.1 MB • Today 1:20 PM  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🖼 Photo_Document.jpg   │   │
│  │ 3.8 MB • Yesterday      │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  [+] Add File                   │  ← FAB
└─────────────────────────────────┘
```

### Tab 2: AI Generate

```
┌─────────────────────────────────┐
│  AI Generate                   │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │  📄 Generate Document   │   │  ← Bento cards
│  │  Create from text       │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  🎤 Voice to Doc        │   │
│  │  Record and convert     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  🌐 Translate           │   │
│  │  10+ languages          │   │
│  └─────────────────────────┘   │
│  ── Quick Tools ────────────── │
│  [📷 Scan] [📝 OCR] [🎨 Style]│
│  [📋 Summarize] [❓ Q&A]      │
├─────────────────────────────────┤
│  Recent Documents               │
│  📄 Invoice_2026.pdf            │
│  📄 Resume_Draft.docx           │
└─────────────────────────────────┘
```

### Tab 3: Transfer

```
┌─────────────────────────────────┐
│  Transfer                      │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │    [QR CODE]            │   │
│  │  Code: ABC123           │   │
│  │  Expires in 23h 45m     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  📤 Send Files          │   │
│  │  Share to computer      │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  📥 Receive Files       │   │
│  │  Enter transfer code    │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  Recent Transfers               │
│  📄 Contract.pdf → Computer     │
└─────────────────────────────────┘
```

### Tab 4: Profile

```
┌─────────────────────────────────┐
│  Profile                       │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │  👤 John Doe            │   │
│  │  john@example.com       │   │
│  │  Free Plan              │   │
│  └─────────────────────────┘   │
│  ⚙️ Settings                   │
│  📁 Cloud Storage               │
│  🔔 Notifications               │
│  ❓ Help Center                 │
│  📧 Contact Us                  │
│  [🚪 Logout]                    │
└─────────────────────────────────┘
```

---

## Component Library

### Base UI Components

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, ghost, danger variants |
| `Card` | Bento card with shadow |
| `Input` | Text input with label |
| `TextArea` | Multi-line input |
| `Select` | Dropdown selector |
| `Modal` | Overlay dialog |
| `Toast` | Notification popup |
| `Badge` | Status indicator |
| `Avatar` | User avatar |
| `Divider` | Section separator |
| `Spinner` | Loading indicator |
| `ProgressBar` | Progress indication |
| `EmptyState` | No data placeholder |
| `Header` | Screen header |
| `TabBar` | Bottom navigation |
| `FAB` | Floating action button |

### Feature Components

| Component | Purpose |
|-----------|---------|
| `PDFRenderer` | Render PDF pages |
| `PDFToolbar` | PDF editing tools |
| `SignaturePad` | Draw signature |
| `CameraView` | Camera feed |
| `DocumentScanner` | Edge detection overlay |
| `FilePicker` | File selection |
| `FileCard` | File display card |
| `TransferQR` | QR code display |
| `StreamingText` | AI generation streaming |

---

## Development Phases

### Phase 1: Foundation
- [ ] Update tab order (Files, AI, Transfer, Profile)
- [ ] Create design system tokens
- [ ] Create base UI components
- [ ] Create auth screens (Login, Register)
- [ ] Create File Manager home screen

### Phase 2: AI Generator
- [ ] AI input screen
- [ ] Generation via API
- [ ] Preview generated doc
- [ ] Download as PDF/DOCX

### Phase 3: PDF Tools
- [ ] PDF viewer
- [ ] Merge PDFs
- [ ] Split PDF
- [ ] Compress PDF
- [ ] PDF editor (basic)

### Phase 4: File Management
- [ ] File picker (any format)
- [ ] File viewer (any format)
- [ ] Local storage
- [ ] Recent files

### Phase 5: Camera & OCR
- [ ] Camera integration
- [ ] Document scanner
- [ ] OCR from camera
- [ ] Save as PDF

### Phase 6: E-Signatures
- [ ] Signature capture
- [ ] Place on PDF
- [ ] Save signed PDF

### Phase 7: File Transfer
- [ ] Transfer screen
- [ ] QR code generation
- [ ] Send/receive files
- [ ] Web-based transfer

### Phase 8: Settings & Polish
- [ ] Settings screen
- [ ] Account management
- [ ] App icon/splash
- [ ] Onboarding

### Phase 9: Build & Deploy
- [ ] EAS configuration
- [ ] Development build
- [ ] Production build
- [ ] App Store submit
- [ ] Google Play submit

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user |
| `/api/generate` | POST | AI document generation |
| `/api/translate` | POST | Document translation |
| `/api/ocr` | POST | OCR text extraction |
| `/api/summarize` | POST | Document summarization |
| `/api/pdf/merge` | POST | Merge PDFs |
| `/api/pdf/split` | POST | Split PDF |
| `/api/pdf/compress` | POST | Compress PDF |
| `/api/convert` | POST | File conversion |
| `/api/transfer/generate` | POST | Generate transfer code |
| `/api/transfer/receive` | POST | Receive transferred files |
| `/api/documents` | GET | List user documents |
| `/api/documents/[id]` | GET | Get document |
| `/api/documents/[id]` | DELETE | Delete document |
