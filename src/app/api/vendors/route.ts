import { NextResponse } from "next/server";
import { getVendorsList, addVendorBeneficiary } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const vendors = await getVendorsList(userId);
    return NextResponse.json({ success: true, data: vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json({ error: "Failed to fetch vendors." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, accountNumber, ifsc, bankName, userId = "demo-user" } = body;

    if (!name || !accountNumber || !ifsc || !bankName) {
      return NextResponse.json(
        { error: "Name, account number, IFSC code, and bank name are required." },
        { status: 400 }
      );
    }

    // Basic IFSC validation (4 letters + '0' + 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (!ifscRegex.test(ifsc.trim())) {
      return NextResponse.json(
        { error: "Invalid IFSC format. Example: HDFC0000102" },
        { status: 400 }
      );
    }

    const newVendor = await addVendorBeneficiary({
      userId,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      bankName: bankName.trim(),
      isVerified: true,
      status: "active",
    });

    return NextResponse.json({ success: true, data: newVendor }, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json({ error: "Failed to create vendor." }, { status: 500 });
  }
}
