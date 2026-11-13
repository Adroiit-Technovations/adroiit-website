
import { Bricolage_Grotesque } from "next/font/google";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    certificateId: string;
  }>;
  searchParams: Promise<{
    id?: string;
  }>;
}

interface EventData {
  event_name: string;
  event_date: string;
  event_end_date: string | null;
  event_type: string;
}

interface Certificate {
  certificate_id: string;
  recipient_name: string;
  program_name: string | null;
  certificate_type: string | null;
  issue_date: string | null;
  duration: string | null;
  organization: string | null;
  status: "VALID" | "REVOKED";
  score_applicable: boolean;
  score_obtained: number | null;
  score_max: number | null;
  grade: string | null;
  score_label: string | null;
  event: EventData | null;
}

// ==================================================
// CLIENT IP EXTRACTION
// ==================================================

function getClientIp(forwardedFor: string | null): string | null {
  if (!forwardedFor) {
    return null;
  }

  const addresses = forwardedFor
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  // Vercel appends the connecting client address to
  // the forwarded-for chain. Read from the right.
  for (let i = addresses.length - 1; i >= 0; i--) {
    const address = addresses[i];

    if (isIP(address)) {
      return address;
    }
  }

  return null;
}

// ==================================================
// CERTIFICATE VERIFICATION PAGE
// ==================================================

export default async function CertificateVerificationPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const certificateId =
    resolvedSearchParams.id?.trim() ||
    resolvedParams.certificateId?.trim() ||
    "";

  if (!certificateId) {
    return <InvalidCertificate />;
  }

  // ==================================================
  // 1. IDENTIFY VISITOR
  // ==================================================

  const requestHeaders = await headers();

  const forwardedFor =
    requestHeaders.get("x-vercel-forwarded-for") ||
    requestHeaders.get("x-forwarded-for");

  const visitorIp = getClientIp(forwardedFor);

  const hmacSecret = process.env.CERTIFICATE_VISITOR_HMAC_SECRET;

  // Fail closed if visitor identification is unavailable.
  if (!visitorIp || !hmacSecret) {
    console.error(
      "Certificate verification unavailable: visitor identification failed."
    );

    return <VerificationUnavailable />;
  }

  // ==================================================
  // 2. CREATE AN ANONYMOUS VISITOR HASH
  // ==================================================

  // Raw visitor IP addresses are never stored in the database.
  // Only the keyed SHA-256 HMAC hash is sent to Supabase.

  const visitorHash = createHmac("sha256", hmacSecret)
    .update(visitorIp)
    .digest("hex");

  // ==================================================
  // 3. CHECK RATE LIMIT
  // ==================================================

  const {
    data: rateLimitAllowed,
    error: rateLimitError,
  } = await supabaseAdmin.rpc(
    "check_certificate_verification_rate_limit",
    {
      p_visitor_hash: visitorHash,
    }
  );

  if (rateLimitError) {
    console.error("Certificate rate-limit check failed:", {
      error: rateLimitError.message,
    });

    // Fail closed. Never bypass rate limiting if the
    // database rate-limit check fails.
    return <VerificationUnavailable />;
  }

  if (rateLimitAllowed !== true) {
    return <RateLimited />;
  }

  // ==================================================
  // 4. SECURE CERTIFICATE VERIFICATION
  // ==================================================

  // This RPC:
  // 1. Looks up the certificate using its public ID.
  // 2. Returns only approved public certificate details.
  // 3. Retrieves associated event information.
  // 4. Records the verification attempt internally.
  //
  // The RPC is now executed using the server-only
  // Supabase service-role client.
  //
  // No direct public SELECT access is required.
  // Internal certificate UUID is never exposed.

  const { data, error } = await supabaseAdmin.rpc(
    "verify_certificate",
    {
      p_certificate_id: certificateId,
    }
  );

  if (error) {
    console.error("Certificate verification failed:", {
      certificateId,
      error: error.message,
    });

    return <VerificationUnavailable />;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return <InvalidCertificate />;
  }

  const certificateData = data as unknown as Certificate;

  if (
    !certificateData.certificate_id ||
    !certificateData.recipient_name
  ) {
    return <InvalidCertificate />;
  }

  // ==================================================
  // 5. VERIFICATION STATUS
  // ==================================================

  const isValid = certificateData.status === "VALID";

  // ==================================================
  // 6. ASSESSMENT PERCENTAGE
  // ==================================================

  const percentage =
    certificateData.score_applicable &&
    certificateData.score_obtained !== null &&
    certificateData.score_max !== null &&
    Number(certificateData.score_max) > 0
      ? (
          (Number(certificateData.score_obtained) /
            Number(certificateData.score_max)) *
          100
        ).toFixed(2)
      : null;

  // ==================================================
  // 7. EVENT DATE
  // ==================================================

  const event = certificateData.event;

  const eventDate = event
    ? event.event_end_date &&
      event.event_end_date !== event.event_date
      ? `${formatDate(event.event_date)} to ${formatDate(
          event.event_end_date
        )}`
      : formatDate(event.event_date)
    : formatDate(certificateData.issue_date);

  // ==================================================
  // 8. VERIFICATION PAGE
  // ==================================================

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#FAF9FC] px-4 py-30 text-[#211536] sm:px-6 lg:px-8`}
    >
      {/* Purple Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#5921C7]/10 blur-[140px]" />

        <div className="absolute -right-40 top-[20%] h-[400px] w-[400px] rounded-full bg-[#8C52FF]/10 blur-[140px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[380px] w-[380px] rounded-full bg-[#30106F]/[0.06] blur-[130px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,33,199,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#5921C7]">
            Adroiit Technovations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-[#5921C7] via-[#713BE0] to-[#8C52FF] bg-clip-text text-transparent">
              Certificate Verified
            </span>
          </h1>

          <p className="mt-3 text-sm text-[#756B86]">
            Official Certificate Verification Record
          </p>
        </div>

        {/* Verification Card */}
        <div
          className={`mt-5 overflow-hidden rounded-3xl border ${
            isValid
              ? "border-emerald-200"
              : "border-red-200"
          } bg-white shadow-xl shadow-[#30106F]/[0.06]`}
        >
          {/* Verification Status */}
          <div
            className={`p-6 sm:p-5 ${
              isValid
                ? "bg-emerald-50"
                : "bg-red-50"
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                  isValid
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isValid ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : (
                  <ShieldAlert className="h-7 w-7" />
                )}
              </div>

              <div>
                <p
                  className={`text-xl font-semibold ${
                    isValid
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {isValid
                    ? "Certificate is Valid"
                    : "Certificate has been Revoked"}
                </p>

                <p className="mt-1 text-sm text-[#756B86]">
                  {isValid
                    ? "This certificate matches an official record in the Adroiit Technovations verification system."
                    : "This certificate exists in the system but is no longer considered valid."}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Information */}
          <div className="grid gap-5 p-6 sm:p-8">
            {/* Certificate ID */}
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#93899F]">
                Certificate ID
              </p>

              <p className="mt-2 break-all font-mono text-sm text-[#514762]">
                {certificateData.certificate_id}
              </p>
            </div>

            <div className="h-px bg-[#EAE5F2]" />

            {/* Certificate Details */}
            <div>
              <h2 className="text-base font-semibold text-[#211536]">
                Certificate Information
              </h2>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <Detail
                  icon={<UserRound className="h-4 w-4" />}
                  label="Recipient Name"
                  value={certificateData.recipient_name}
                />

                <Detail
                  icon={<Award className="h-4 w-4" />}
                  label="Certificate Type"
                  value={
                    certificateData.certificate_type ||
                    "Certificate"
                  }
                />

                <Detail
                  icon={<FileText className="h-4 w-4" />}
                  label="Program / Event Name"
                  value={
                    event?.event_name ||
                    certificateData.program_name ||
                    "Not specified"
                  }
                />

                <Detail
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Program / Event Date"
                  value={eventDate}
                />

                <Detail
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Duration"
                  value={
                    certificateData.duration ||
                    "Not specified"
                  }
                />

                <Detail
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Hosted By"
                  value={
                    certificateData.organization ||
                    "Adroiit Technovations"
                  }
                />
              </div>
            </div>

            {/* Assessment Result */}
            {certificateData.score_applicable && (
              <>
                <div className="h-px bg-[#EAE5F2]" />

                <div>
                  <h2 className="text-base font-semibold text-[#211536]">
                    Assessment Result
                  </h2>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ScoreBox
                      label="Score Obtained"
                      value={
                        certificateData.score_obtained !== null
                          ? String(certificateData.score_obtained)
                          : "—"
                      }
                    />

                    <ScoreBox
                      label="Maximum Score"
                      value={
                        certificateData.score_max !== null
                          ? String(certificateData.score_max)
                          : "—"
                      }
                    />

                    <ScoreBox
                      label="Percentage"
                      value={
                        percentage
                          ? `${percentage}%`
                          : "—"
                      }
                    />

                    <ScoreBox
                      label="Grade"
                      value={certificateData.grade || "—"}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Verification Footer */}
          <div className="border-t border-[#EAE5F2] bg-[#FAF9FC] p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />

              <span className="text-s font-medium">
                Official Verification Record
              </span>
            </div>

            <p className="mx-auto mt-2 max-w-4xl text-xs leading-5 text-[#93899F]">
              This verification page confirms that the certificate ID has a record
              currently stored in the Adroiit Technovations' Certificate Verification System.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ==================================================
// DATE FORMATTER
// ==================================================

function formatDate(date: string | null) {
  if (!date) {
    return "Not specified";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}-${month}-${year}`;
}

// ==================================================
// DETAIL COMPONENT
// ==================================================

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5921C7]/10 text-[#713BE0]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-[#93899F]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm leading-6 text-[#514762]">
          {value}
        </p>
      </div>
    </div>
  );
}

// ==================================================
// SCORE COMPONENT
// ==================================================

function ScoreBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#EAE5F2] bg-[#FAF9FC] p-5">
      <p className="text-xs text-[#93899F]">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-[#211536]">
        {value}
      </p>
    </div>
  );
}

// ==================================================
// INVALID CERTIFICATE COMPONENT
// ==================================================

function InvalidCertificate() {
  return (
    <main
      className={`${bricolage.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9FC] px-4 text-[#211536]`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#5921C7]/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[#8C52FF]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,33,199,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#EAE5F2] bg-white p-8 text-center shadow-[0_20px_80px_rgba(48,16,111,0.08)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#5921C7]">
          Adroiit Technovations
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#211536]">
          Certificate Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#756B86]">
          The certificate ID entered doesn't match any record from the official certificate records of Adroiit Technovations.
        </p>

        <a
          href="/verify"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#30106f] px-5 text-sm font-semibold text-white transition hover:bg-[#4d259e]"
        >
          Verify Another Certificate
        </a>
      </div>
    </main>
  );
}

// ==================================================
// RATE LIMITED COMPONENT
// ==================================================

function RateLimited() {
  return (
    <main
      className={`${bricolage.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9FC] px-4 text-[#211536]`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#5921C7]/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[#8C52FF]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,33,199,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-[0_20px_80px_rgba(48,16,111,0.08)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#5921C7]">
          Adroiit Technovations
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#211536]">
          Too Many Verification Requests
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#756B86]">
          You have reached the certificate verification request limit.
          Please wait a minute before trying again.
        </p>

        <a
          href="/verify"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#30106f] px-5 text-sm font-semibold text-white transition hover:bg-[#4d259e]"
        >
          Return to Verification
        </a>
      </div>
    </main>
  );
}

// ==================================================
// VERIFICATION UNAVAILABLE COMPONENT
// ==================================================

function VerificationUnavailable() {
  return (
    <main
      className={`${bricolage.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9FC] px-4 text-[#211536]`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#5921C7]/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[#8C52FF]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,33,199,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#EAE5F2] bg-white p-8 text-center shadow-[0_20px_80px_rgba(48,16,111,0.08)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase text-[#5921C7]">
          Adroiit Technovations
        </p>

        <h1 className="mt-3 text-[25px] font-bold text-[#30106f]">
          Verification Temporarily Unavailable
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-700">
          We couldn't complete the certificate verification right now.
          <br></br>
          Please try again shortly.
        </p>

        <a
          href="/verify"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#30106f] px-5 text-sm font-semibold text-white transition hover:bg-[#4d259e]"
        >
          Try Again
        </a>
      </div>
    </main>
  );
}
