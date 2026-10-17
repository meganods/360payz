import { NextResponse } from "next/server";
import { saveContactEnquiry } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, subject, message } = body;

    if (!name || !email || !mobile || !message) {
      return NextResponse.json(
        { error: "Name, email, mobile, and message are required fields." },
        { status: 400 }
      );
    }

    const enquiry = await saveContactEnquiry({
      name,
      email,
      mobile,
      subject: subject || "General Enquiry",
      message,
    });

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully.", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}
