/**
 * Export OCR text to various formats
 */

/**
 * Export as plain text file
 */
export function exportAsTXT(text: string, filename: string = "extracted-text") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${filename}.txt`);
}

/**
 * Export as Word document
 */
export async function exportAsDOCX(text: string, filename: string = "extracted-text") {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

  const paragraphs = text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: "Calibri",
            size: 22, // 11pt
          }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "OCR Extracted Text",
                bold: true,
                font: "Calibri",
                size: 32,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Extracted on ${new Date().toLocaleDateString()} by Docmaker OCR`,
                font: "Calibri",
                size: 18,
                color: "666666",
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          ...paragraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  downloadBlob(blob, `${filename}.docx`);
}

/**
 * Export as PDF
 */
export async function exportAsPDF(text: string, filename: string = "extracted-text") {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("OCR Extracted Text", 20, 20);

  // Metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Extracted on ${new Date().toLocaleDateString()} by Docmaker OCR`, 20, 28);

  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 32, 190, 32);

  // Content
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const lines = doc.splitTextToSize(text, 170);
  let y = 40;

  for (const line of lines) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 5;
  }

  doc.save(`${filename}.pdf`);
}

/**
 * Export as HTML
 */
export function exportAsHTML(text: string, filename: string = "extracted-text") {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OCR Extracted Text</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
    h1 { color: #121660; border-bottom: 2px solid #121660; padding-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    .content { white-space: pre-wrap; background: #f8f9fa; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>OCR Extracted Text</h1>
  <p class="meta">Extracted on ${new Date().toLocaleDateString()} by Docmaker OCR</p>
  <div class="content">${escapeHtml(text)}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, `${filename}.html`);
}

/**
 * Export as Markdown
 */
export function exportAsMarkdown(text: string, filename: string = "extracted-text") {
  const md = `# OCR Extracted Text

*Extracted on ${new Date().toLocaleDateString()} by Docmaker OCR*

---

${text}`;

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${filename}.md`);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

// Helpers
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}
