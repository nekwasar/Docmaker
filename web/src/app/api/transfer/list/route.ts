import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserTransfers } from "@/lib/transfer";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const transfers = await getUserTransfers(user.id);

    return NextResponse.json({ transfers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to list transfers" }, { status: 500 });
  }
}
