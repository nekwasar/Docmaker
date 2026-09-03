import { PDFDocument, degrees, rgb } from 'pdf-lib';

// Merge multiple PDFs
export async function mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

// Split PDF into individual pages
export async function splitPDF(
  pdfBuffer: ArrayBuffer,
  ranges?: string[]
): Promise<Uint8Array[]> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pageCount = pdf.getPageCount();
  const pages: Uint8Array[] = [];

  if (ranges) {
    // Parse ranges like "1-3,5,7-9"
    for (const range of ranges) {
      const parts = range.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start - 1; i < end && i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(page);
            pages.push(await newPdf.save());
          }
        } else {
          const pageIndex = Number(part) - 1;
          if (pageIndex >= 0 && pageIndex < pageCount) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdf, [pageIndex]);
            newPdf.addPage(page);
            pages.push(await newPdf.save());
          }
        }
      }
    }
  } else {
    // Split all pages
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      pages.push(await newPdf.save());
    }
  }

  return pages;
}

// Add watermark to PDF
export async function addWatermark(
  pdfBuffer: ArrayBuffer,
  text: string
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length * 10) / 2,
      y: height / 2,
      size: 60,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: degrees(45),
    });
  }

  return pdf.save();
}

// Encrypt PDF with password
export async function encryptPDF(
  pdfBuffer: ArrayBuffer,
  password: string
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  
  return pdf.save({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
    },
  });
}

// Get PDF page count
export async function getPDFPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const pdf = await PDFDocument.load(pdfBuffer);
  return pdf.getPageCount();
}

// Rotate PDF pages
export async function rotatePDF(
  pdfBuffer: ArrayBuffer,
  angle: number
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  for (const page of pages) {
    page.setRotation(degrees(angle));
  }

  return pdf.save();
}

// Delete pages from PDF
export async function deletePages(
  pdfBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const indices = pageNumbers.map((n) => n - 1).filter((i) => i >= 0 && i < pdf.getPageCount());
  pdf.removePages(indices);
  return pdf.save();
}
