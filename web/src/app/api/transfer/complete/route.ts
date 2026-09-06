import { NextRequest, NextResponse } from "next/server";
import { completeTransfer } from "@/lib/transfer";

export async function POST(request: NextRequest) {
  try {
    const { transferId } = await request.json();

    if (!transferId) {
      return NextResponse.json({ error: "Transfer ID required" }, { status: 400 });
    }

    await completeTransfer(transferId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Complete failed" }, { status: 500 });
  }
}
