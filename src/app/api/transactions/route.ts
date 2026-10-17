import { NextResponse } from "next/server";
import { getTransactionsList, createPaymentTransaction } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user";
    const txns = await getTransactionsList(userId);
    return NextResponse.json({ success: true, data: txns });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId, vendorName, cardId, amount, userId = "demo-user" } = body;

    const parsedAmount = Number(amount);
    if (!vendorId || !parsedAmount || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Valid vendor and positive payment amount are required." },
        { status: 400 }
      );
    }

    // Transparent platform fee (1%)
    const feeAmount = Math.round(parsedAmount * 0.01);
    const totalBilled = parsedAmount + feeAmount;
    // Reward points earned (2% cashback/reward points)
    const rewardEarned = Math.round(parsedAmount * 0.02);

    const now = new Date();
    const dateFormatted = `Today, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

    const transaction = await createPaymentTransaction({
      userId,
      vendorId,
      vendorName: vendorName || "Vendor Settlement",
      cardId: cardId || "c1",
      amount: parsedAmount,
      feeAmount,
      totalBilled,
      rewardEarned,
      status: "settled",
      utrNumber: `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      settlementTimeEst: "2-5 minutes",
      date: dateFormatted,
    });

    return NextResponse.json(
      { success: true, message: "Payment processed successfully.", data: transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json({ error: "Failed to process transaction." }, { status: 500 });
  }
}
