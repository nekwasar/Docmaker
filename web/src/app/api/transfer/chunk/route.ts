import { NextRequest, NextResponse } from "next/server";
import { getChunk } from "@/lib/transfer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transferId = searchParams.get("id");
    const chunkIndex = parseInt(searchParams.get("chunk") || "0");

    if (!transferId) {
      return NextResponse.json({ error: "Transfer ID required" }, { status: 400 });
    }

    const chunkData = await getChunk(transferId, chunkIndex);

    return new NextResponse(chunkData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Chunk-Index": String(chunkIndex),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Chunk not found" }, { status: 404 });
  }
}
