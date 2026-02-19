import { Resend } from "resend";
import type { FormSubmission } from "~/lib/storage";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL ?? "Stokes Water Well <onboarding@resend.dev>";

function getDisplayName(submission: FormSubmission): string {
  if (submission.name) return submission.name;
  const first = submission.firstName ?? "";
  const last = submission.lastName ?? "";
  return [first, last].filter(Boolean).join(" ").trim() || "Unknown";
}

function buildSubject(submission: FormSubmission): string {
  const name = getDisplayName(submission);
  switch (submission.type) {
    case "request":
      return `[Quote Request] ${submission.subject ?? "Well Drilling Quote"} – ${name}`;
    case "contact":
      return `[Contact Form] ${submission.subject ?? "Website message"} – ${name}`;
    case "callback":
      return `[Callback Request] ${name}`;
    default:
      return `[Website Submission] ${name}`;
  }
}

function buildTextBody(submission: FormSubmission): string {
  const lines: string[] = [
    `New ${submission.type} form submission from the website.`,
    "",
    "---",
    `Name: ${getDisplayName(submission)}`,
    `Email: ${submission.email}`,
  ];
  if (submission.phone) lines.push(`Phone: ${submission.phone}`);
  if (submission.subject) lines.push(`Subject: ${submission.subject}`);
  lines.push("", "---");
  if (submission.message) {
    lines.push("Message / details:", "", submission.message);
  }
  lines.push("", "---", `Submitted: ${submission.timestamp}`);
  return lines.join("\n");
}

/**
 * Sends an email notification to the admin when a form is submitted.
 * No-op if RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL are not set (e.g. local dev without config).
 * Email failures are logged but do not throw, so form submission still succeeds.
 */
export async function sendAdminNotification(submission: FormSubmission): Promise<void> {
  if (!RESEND_API_KEY || !ADMIN_NOTIFICATION_EMAIL) {
    if (!ADMIN_NOTIFICATION_EMAIL) {
      console.log("Admin notification skipped: ADMIN_NOTIFICATION_EMAIL not set");
    }
    return;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_NOTIFICATION_EMAIL],
      replyTo: submission.email,
      subject: buildSubject(submission),
      text: buildTextBody(submission),
    });

    if (error) {
      console.error("Failed to send admin notification email:", error);
      return;
    }
    console.log("Admin notification email sent:", data?.id);
  } catch (err) {
    console.error("Error sending admin notification email:", err);
  }
}
