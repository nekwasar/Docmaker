# Docmaker Web — Implementation Milestones

## Overview

The web app is the **source of truth** for all functionality. Mobile connects to the same backend API.

**Tech Stack:** Next.js 15 + PostgreSQL + Prisma + Tailwind CSS + pdf-lib

**Domain:** docmaker.io

---

## Phase 1: Foundation (Week 1-2)

### M1.1: Project Setup ✅
- [x] Next.js 15 project initialization
- [x] Tailwind CSS setup
- [x] PostgreSQL + Prisma configuration
- [x] Directory structure
- [x] Shared code (types, constants, API client)
- [x] Basic layout (header, footer, navigation)
- [x] Homepage

### M1.2: Database & Auth
- [ ] Prisma migration (run `prisma migrate dev`)
- [ ] NextAuth v5 setup (Google OAuth + email/password)
- [ ] User registration/login flows
- [ ] Session management
- [ ] Protected routes middleware

### M1.3: Design System
- [ ] shadcn/ui components (Button, Card, Input, Modal, etc.)
- [ ] Brand color system (navy, teal, blue, yellow)
- [ ] Responsive breakpoints
- [ ] Typography scale
- [ ] Component library documentation

---

## Phase 2: Core AI Tools (Week 3-4)

### M2.1: AI Document Generator
- [ ] Generator page UI
- [ ] Document structure selector
- [ ] Text input with character count
- [ ] Image upload support
- [ ] Generation API endpoint
- [ ] Streaming response display
- [ ] Document preview

### M2.2: AI Editing
- [ ] Edit page UI
- [ ] File upload/selection
- [ ] Natural language command input
- [ ] Edit API endpoint
- [ ] Before/after comparison

### M2.3: AI Q&A
- [ ] Q&A page UI
- [ ] Document upload
- [ ] Question input
- [ ] Q&A API endpoint
- [ ] Answer display with sources

### M2.4: Summarize & Change Style
- [ ] Summarize page UI
- [ ] Change Style page UI
- [ ] Style selector component
- [ ] API endpoints for both

---

## Phase 3: PDF Tools (Week 5-6)

### M3.1: PDF Viewer
- [ ] PDF.js integration
- [ ] PDF viewer component
- [ ] Page navigation
- [ ] Zoom controls
- [ ] Full-screen mode

### M3.2: Merge PDF
- [ ] Merge page UI
- [ ] Multi-file upload
- [ ] Drag-to-reorder
- [ ] Merge API endpoint (pdf-lib)
- [ ] Download merged PDF

### M3.3: Split PDF
- [ ] Split page UI
- [ ] Page range selector
- [ ] Split API endpoint (pdf-lib)
- [ ] Download split PDFs

### M3.4: Compress PDF
- [ ] Compress page UI
- [ ] Compression level selector
- [ ] File size display
- [ ] Compress API endpoint
- [ ] Before/after comparison

### M3.5: Edit PDF
- [ ] PDF editor UI
- [ ] Text tool
- [ ] Image tool
- [ ] Draw tool
- [ ] Shape tool
- [ ] Save edited PDF

### M3.6: Sign Document
- [ ] Sign page UI
- [ ] Signature pad component
- [ ] Signature placement
- [ ] Apply signature to PDF
- [ ] Download signed PDF

### M3.7: Encrypt & Watermark
- [ ] Encrypt page UI
- [ ] Watermark page UI
- [ ] Password input
- [ ] Watermark text input
- [ ] API endpoints

---

## Phase 4: File Conversion (Week 7-8)

### M4.1: Conversion Infrastructure
- [ ] LibreOffice headless setup (Docker)
- [ ] Conversion API endpoint
- [ ] File upload handling
- [ ] Progress tracking

### M4.2: 200+ SEO Conversion Pages
- [ ] Conversion pairs configuration
- [ ] `generateStaticParams` for all 200+ pages
- [ ] Individual page templates
- [ ] SEO metadata (title, description, OG tags)
- [ ] Schema.org structured data
- [ ] Internal linking strategy
- [ ] Sitemap generation

### M4.3: Conversion UI
- [ ] Main conversion page
- [ ] Source/target format selector
- [ ] File upload zone
- [ ] Conversion progress
- [ ] Download result

---

## Phase 5: OCR & Transfer (Week 9)

### M5.1: OCR
- [ ] Tesseract.js integration
- [ ] OCR page UI
- [ ] Image upload
- [ ] Text extraction
- [ ] Copy to clipboard
- [ ] Download as text

### M5.2: File Transfer
- [ ] Transfer page UI
- [ ] Send mode (generate code)
- [ ] Receive mode (enter code)
- [ ] QR code generation
- [ ] Socket.IO integration
- [ ] Real-time transfer status

---

## Phase 6: Dashboard & Polish (Week 10)

### M6.1: User Dashboard
- [ ] Dashboard page
- [ ] Recent documents
- [ ] Credit balance
- [ ] Usage analytics

### M6.2: File Manager
- [ ] File list view
- [ ] File upload
- [ ] File actions (view, edit, share, delete)
- [ ] Folder organization

### M6.3: Settings
- [ ] Profile settings
- [ ] Notification preferences
- [ ] Account management

### M6.4: Polish
- [ ] Mobile responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Performance optimization
- [ ] Accessibility audit

---

## Phase 7: SEO & Launch (Week 11-12)

### M7.1: SEO
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] Schema.org markup

### M7.2: Launch Prep
- [ ] Domain setup (docmaker.io)
- [ ] SSL certificate
- [ ] Environment variables
- [ ] Database migration (production)
- [ ] Deployment pipeline

### M7.3: Launch
- [ ] Production build
- [ ] Deploy to VPS
- [ ] DNS configuration
- [ ] monitoring setup
- [ ] Launch announcement

---

## Shared Code Strategy

### What Lives in `shared/`
- `types.ts` — TypeScript interfaces
- `constants.ts` — App constants, brand colors
- `api.ts` — API client (used by web + mobile)

### What Lives in `web/`
- `lib/pdf/` — PDF processing (pdf-lib)
- `lib/ai/` — AI configuration & streaming
- `lib/conversion/` — LibreOffice integration
- `lib/ocr/` — Tesseract.js integration
- `components/` — Web-specific UI

### What Lives in `mobile/`
- `components/` — React Native components
- `store/` — Zustand stores
- `hooks/` — React Native hooks

---

## API Design

All tools expose REST APIs that both web and mobile consume:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/generate` | POST | Generate document (streaming) |
| `POST /api/convert` | POST | Convert files |
| `POST /api/pdf/merge` | POST | Merge PDFs |
| `POST /api/pdf/split` | POST | Split PDF |
| `POST /api/pdf/compress` | POST | Compress PDF |
| `POST /api/ocr` | POST | OCR text extraction |
| `POST /api/transfer/generate` | POST | Generate transfer code |
| `GET /api/transfer/[code]` | GET | Get transferred files |
| `GET /api/auth/me` | GET | Get current user |

---

## Success Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Organic Visitors | 10,000 | 50,000 | 200,000 |
| Registered Users | 5,000 | 25,000 | 100,000 |
| Paid Users | 200 | 1,000 | 5,000 |
| Monthly Revenue | $2,000 | $10,000 | $50,000 |
| Free Conversions | 50,000 | 300,000 | 1,000,000 |
