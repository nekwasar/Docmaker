import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createTransfer, MAX_FILE_SIZE } from "@/lib/transfer";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const retentionDays = parseInt(formData.get("retentionDays") as string) || 1;
    const maxDownloads = parseInt(formData.get("maxDownloads") as string) || 1;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 500MB limit" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const result = await createTransfer({
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type || "application/octet-stream",
      fileBuffer,
      retentionDays,
      maxDownloads,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Create transfer error:", error);
    return NextResponse.json({ error: error.message || "Transfer creation failed" }, { status: 500 });
  }
}
