import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing document id or status." }, { status: 400 });
    }

    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("kyc_records").doc(id).set(
        {
          status,
          reviewedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ success: true, message: `KYC marked as ${status}` });
  } catch (error) {
    console.error("KYC action error:", error);
    return NextResponse.json({ error: "Failed to update KYC status." }, { status: 500 });
  }
}
