import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();

// GET /api/admin/templates - list all (admin)
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ templates });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/templates - create via multipart (file + fields)
// Requires no auth for now — lock down later via middleware
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = (form.get("title") as string)?.trim();
    const author = (form.get("author") as string)?.trim() || "Docmaker";
    const category = (form.get("category") as string)?.trim() || "Business";
    const description = (form.get("description") as string)?.trim() || "";
    const isPublic = form.get("isPublic") !== "false";
    const file = form.get("file") as File | null;

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    // Ensure admin user exists — use first user or create system user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `admin@docmaker.io`,
          name: "Admin",
          passwordHash: "",
          role: "admin",
        },
      });
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;
    let thumbnails: string[] | null = null;
    let content: string | null = null;

    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "templates");
      fs.mkdirSync(uploadsDir, { recursive: true });

      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const tmpName = `${Date.now()}-${safe}`;
      const filePath = path.join(uploadsDir, tmpName);
      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      fileUrl = `/uploads/templates/${tmpName}`;
      fileName = file.name;
      fileSize = file.size;

      // Try to extract text content (txt, csv, pdf)
      const ext = path.extname(file.name).toLowerCase();
      try {
        if (ext === ".txt" || ext === ".csv" || ext === ".md") {
          content = buf.toString("utf-8").slice(0, 20000);
        } else if (ext === ".pdf") {
          // Use pdfjs-dist to extract first pages text
          const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
          const doc = await (pdfjs as any).getDocument({ data: new Uint8Array(buf), disableWorker: true }).promise;
          let all = "";
          const pages = Math.min(doc.numPages, 5);
          for (let i = 1; i <= pages; i++) {
            const page = await doc.getPage(i);
            const tc = await page.getTextContent();
            const t = tc.items.map((it: any) => it.str).join(" ");
            all += t + "\n\n";
          }
          content = all.slice(0, 20000) || `PDF: ${file.name} — ${doc.numPages} pages`;
          // Generate thumbnails via ghostscript if available
          try {
            const id = Date.now().toString(36);
            const thumb1 = path.join(uploadsDir, `${id}-1.png`);
            const thumb2 = path.join(uploadsDir, `${id}-2.png`);
            // Copy file to container and run gs
            const container = "docmaker-ghostscript";
            // Check container exists
            execSync(`docker ps --format "{{.Names}}" | grep -q ${container}`, { stdio: "ignore" });
            const tmpInContainer = `/tmp/${tmpName}`;
            execSync(`docker cp "${filePath}" ${container}:${tmpInContainer}`, { stdio: "ignore" });
            execSync(
              `docker exec ${container} sh -c "gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r96 -dFirstPage=1 -dLastPage=2 -sOutputFile=/tmp/${id}-%d.png ${tmpInContainer} 2>/dev/null"`,
              { stdio: "ignore" }
            );
            execSync(`docker cp ${container}:/tmp/${id}-1.png "${thumb1}"`, { stdio: "ignore" });
            try { execSync(`docker cp ${container}:/tmp/${id}-2.png "${thumb2}"`, { stdio: "ignore" }); } catch {}
            const t1 = `/uploads/templates/${id}-1.png`;
            const t2 = fs.existsSync(thumb2) ? `/uploads/templates/${id}-2.png` : t1;
            if (fs.existsSync(thumb1)) thumbnails = [t1, t2];
          } catch {}
        }
      } catch {}
    } else {
      // No file — expect content/prompt in form
      const prompt = (form.get("prompt") as string) || (form.get("content") as string) || "";
      if (prompt) content = prompt.slice(0, 20000);
    }

    const template = await prisma.template.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        prompt: content || description || title,
        content,
        author,
        thumbnails: thumbnails as any,
        fileUrl,
        fileName,
        fileSize,
        isPublic,
      },
    });

    return NextResponse.json({ template });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
