import { NextResponse } from "next/server";
import { getCardsList, linkNewCard } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const cards = await getCardsList(userId);
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Failed to fetch linked cards." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, number, expiry, bank, userId = "demo-user" } = body;

    if (!name || !number || !expiry || !bank) {
      return NextResponse.json(
        { error: "Card name, card number, expiry date, and bank name are required." },
        { status: 400 }
      );
    }

    const cleanNumber = number.replace(/\s+/g, "");
    if (cleanNumber.length < 15 || cleanNumber.length > 16 || isNaN(Number(cleanNumber))) {
      return NextResponse.json(
        { error: "Invalid card number format. Must be 15 or 16 digits." },
        { status: 400 }
      );
    }

    const lastFour = cleanNumber.slice(-4);

    // Detect network
    let network: "visa" | "mastercard" | "rupay" | "amex" = "visa";
    if (cleanNumber.startsWith("4")) network = "visa";
    else if (cleanNumber.startsWith("5")) network = "mastercard";
    else if (cleanNumber.startsWith("6")) network = "rupay";
    else if (cleanNumber.startsWith("3")) network = "amex";

    const newCard = await linkNewCard({
      userId,
      cardHolderName: name.trim(),
      cardLabel: name.trim(),
      lastFour,
      expiry: expiry.trim(),
      bankName: bank.trim(),
      network,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: newCard }, { status: 201 });
  } catch (error) {
    console.error("Error linking card:", error);
    return NextResponse.json({ error: "Failed to link card." }, { status: 500 });
  }
}
