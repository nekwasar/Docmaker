import { NextRequest, NextResponse } from "next/server";
import { encryptPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string;
    const ownerPassword = formData.get("ownerPassword") as string || undefined;
    const allowPrinting = formData.get("allowPrinting") !== "false";
    const allowCopying = formData.get("allowCopying") !== "false";
    const allowModifying = formData.get("allowModifying") !== "false";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await encryptPdf(Buffer.from(arrayBuffer), file.name, password, ownerPassword, {
      allowPrinting,
      allowCopying,
      allowModifying,
    });

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-protected.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Encrypt error:", error);
    return NextResponse.json({ error: error.message || "Encrypt failed" }, { status: 500 });
  }
}
