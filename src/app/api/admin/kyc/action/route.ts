import { NextResponse } from "next/server";
import { updateKYCStatus } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing document id or status." }, { status: 400 });
    }

    await updateKYCStatus(id, status);

    return NextResponse.json({ success: true, message: `KYC marked as ${status}` });
  } catch (error) {
    console.error("KYC action error:", error);
    return NextResponse.json({ error: "Failed to update KYC status." }, { status: 500 });
  }
}
