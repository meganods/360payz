import { NextResponse } from "next/server";
import { submitKYCRecord } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = "demo-user", panNumber, aadhaarNumber, dob, address } = body;

    if (!panNumber && !aadhaarNumber) {
      return NextResponse.json(
        { error: "PAN number or Aadhaar number is required." },
        { status: 400 }
      );
    }

    // Mask Aadhaar if provided
    const maskedAadhaar = aadhaarNumber
      ? `•••• •••• ${aadhaarNumber.slice(-4)}`
      : "•••• •••• 9210";

    const kycRecord = await submitKYCRecord({
      userId,
      panNumber: (panNumber || "ABCDE1234F").toUpperCase(),
      aadhaarNumberMasked: maskedAadhaar,
      dob: dob || "1990-01-01",
      address: address || "Registered Business Address",
      status: "in_review",
    });

    return NextResponse.json(
      {
        success: true,
        message: "KYC documents submitted for review.",
        data: kycRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting KYC:", error);
    return NextResponse.json({ error: "Failed to submit KYC record." }, { status: 500 });
  }
}
