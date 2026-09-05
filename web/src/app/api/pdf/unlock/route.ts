import { NextRequest, NextResponse } from "next/server";

const GOTENBERG_URL = process.env.GOTENBERG_URL || "http://localhost:3101";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();

    // Use Gotenberg with password to open, then output without encryption
    const gotenbergFormData = new FormData();
    gotenbergFormData.append("files", new Blob([arrayBuffer]), file.name);
    gotenbergFormData.append("password", password);

    const res = await fetch(`${GOTENBERG_URL}/forms/libreoffice/convert`, {
      method: "POST",
      body: gotenbergFormData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gotenberg unlock error: ${err}`);
    }

    const resultBuffer = Buffer.from(await res.arrayBuffer());
    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-unlocked.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Unlock error:", error);
    return NextResponse.json({ error: error.message || "Unlock failed" }, { status: 500 });
  }
}
