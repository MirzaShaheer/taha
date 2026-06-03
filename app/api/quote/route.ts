import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Receives "Get a Free Quote" form submissions.
 *
 * Right now it validates and logs the lead to the server console so the form
 * is fully functional in dev. To go live, wire ONE of these in the marked spot:
 *   • Email:   Resend / SendGrid / Nodemailer  -> notify your inbox
 *   • CRM:     HubSpot / Pipedrive / Airtable   -> create a deal
 *   • Sheet:   Google Sheets API                -> append a row
 *   • Slack:   Incoming webhook                 -> ping your sales channel
 */
export async function POST(req: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Name and a valid email are required." },
      { status: 422 }
    );
  }

  const lead = {
    name,
    email,
    phone: String(data.phone ?? ""),
    service: String(data.service ?? ""),
    message: String(data.message ?? ""),
    receivedAt: new Date().toISOString(),
  };

  // ----------------------------------------------------------------------
  //  TODO (handoff): deliver `lead` to your inbox / CRM here.
  //  e.g. await resend.emails.send({ ... })
  // ----------------------------------------------------------------------
  console.log("📚 New quote request:", lead);

  return NextResponse.json({ ok: true });
}
