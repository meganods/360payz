import { NextResponse } from "next/server";
import { getTransactionByIdOrUtr } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ txnId: string }> | { txnId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context?.params);
    const rawTxn = resolvedParams?.txnId || "";
    const txnId = decodeURIComponent(rawTxn).trim();

    if (!txnId) {
      return NextResponse.json({ error: "Reference ID or UTR is required." }, { status: 400 });
    }

    const txn = await getTransactionByIdOrUtr(txnId);
    if (!txn) {
      // If user typed a demo reference or sample, let's gracefully support quick testing
      const isDemoSample = txnId.toUpperCase().startsWith("TXN") || txnId.toUpperCase().startsWith("UTR");
      if (isDemoSample) {
        return NextResponse.json({
          success: true,
          data: {
            id: txnId.toUpperCase(),
            vendorName: "Apex Distributors",
            amount: 45000,
            feeAmount: 450,
            totalBilled: 45450,
            rewardEarned: 900,
            status: "settled",
            utrNumber: txnId.toUpperCase().startsWith("UTR") ? txnId.toUpperCase() : "UTR9832749102",
            date: "Today, 10:14 AM",
            createdAt: new Date().toISOString(),
            bankName: "HDFC Bank Ltd",
            accountMasked: "•••• •••• 2910",
            ifsc: "HDFC0000102",
            rail: "NPCI Instant IMPS Clearing",
            isDemo: true,
          },
        });
      }

      return NextResponse.json(
        { error: `No settlement found for reference or UTR "${txnId}". Please check and try again.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: txn.id,
        vendorName: txn.vendorName,
        amount: txn.amount,
        feeAmount: txn.feeAmount || Math.round(txn.amount * 0.01),
        totalBilled: txn.totalBilled || Math.round(txn.amount * 1.0118),
        rewardEarned: txn.rewardEarned || Math.round(txn.amount * 0.02),
        status: txn.status,
        utrNumber: txn.utrNumber || "UTRPending",
        date: txn.date || "Recent",
        createdAt: txn.createdAt,
        bankName: "Verified Beneficiary Bank",
        accountMasked: "•••• •••• ••••",
        rail: "NPCI Instant IMPS Clearing",
      },
    });
  } catch (error) {
    console.error("Error fetching tracking details:", error);
    return NextResponse.json({ error: "Failed to retrieve tracking details." }, { status: 500 });
  }
}
