import { NextRequest, NextResponse } from "next/server";
import { verifyTransfer } from "@/lib/transfer";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
    }

    const result = await verifyTransfer(code.toUpperCase());

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 400 });
  }
}
