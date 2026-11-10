import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type VerificationLog = {
  id: string;
  certificate_id: string;
  verified_at: string;
};

type Certificate = {
  id: string;
  certificate_id: string;
  recipient_name: string;
  program_name: string | null;
  status: string;
};

function getLocalDateRange(dateValue: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const start = new Date(year, month - 1, day);

  // Reject invalid dates such as 2026-02-31.
  if (
    start.getFullYear() !== year ||
    start.getMonth() !== month - 1 ||
    start.getDate() !== day
  ) {
    return null;
  }

  const end = new Date(year, month - 1, day + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const searchParams = request.nextUrl.searchParams;

    const offsetValue = Number(searchParams.get("offset") ?? 0);
    const uid = (searchParams.get("uid") ?? "").trim();
    const date = (searchParams.get("date") ?? "").trim();

    const offset =
      Number.isInteger(offsetValue) && offsetValue >= 0
        ? offsetValue
        : 0;

    if (offset > 100000) {
      return NextResponse.json(
        { error: "Requested page is too large." },
        { status: 400 }
      );
    }

    // Resolve the certificate UID filter to certificate database IDs.
    let certificateIds: string[] | null = null;

    if (uid) {
      const { data: matchingCertificates, error: searchError } =
        await supabase
          .from("certificates")
          .select("id")
          .ilike("certificate_id", `%${uid}%`);

      if (searchError) {
        throw searchError;
      }

      certificateIds = (matchingCertificates ?? []).map(
        (certificate) => certificate.id
      );

      if (certificateIds.length === 0) {
        return NextResponse.json({
          records: [],
          hasMore: false,
        });
      }
    }

    // Build the verification log query.
    let query = supabase
      .from("verification_logs")
      .select("id, certificate_id, verified_at")
      .order("verified_at", { ascending: false });

    if (certificateIds !== null) {
      query = query.in("certificate_id", certificateIds);
    }

    if (date) {
      const dateRange = getLocalDateRange(date);

      if (!dateRange) {
        return NextResponse.json(
          { error: "Invalid verification date." },
          { status: 400 }
        );
      }

      query = query
        .gte("verified_at", dateRange.start)
        .lt("verified_at", dateRange.end);
    }

    /*
     * Fetch one extra record to determine whether another page exists.
     * Only PAGE_SIZE records are returned to the client.
     */
    const { data: logs, error: logsError } = await query.range(
      offset,
      offset + PAGE_SIZE
    );

    if (logsError) {
      throw logsError;
    }

    const fetchedLogs = (logs ?? []) as VerificationLog[];

    const hasMore = fetchedLogs.length > PAGE_SIZE;
    const pageLogs = fetchedLogs.slice(0, PAGE_SIZE);

    if (pageLogs.length === 0) {
      return NextResponse.json({
        records: [],
        hasMore: false,
      });
    }

    // Fetch certificate details for the current page only.
    const pageCertificateIds = [
      ...new Set(
        pageLogs
          .map((log) => log.certificate_id)
          .filter(Boolean)
      ),
    ];

    let certificates: Certificate[] = [];

    if (pageCertificateIds.length > 0) {
      const { data, error: certificateError } = await supabase
        .from("certificates")
        .select(
          "id, certificate_id, recipient_name, program_name, status"
        )
        .in("id", pageCertificateIds);

      if (certificateError) {
        throw certificateError;
      }

      certificates = (data ?? []) as Certificate[];
    }

    const certificateMap = new Map(
      certificates.map((certificate) => [
        certificate.id,
        certificate,
      ])
    );

    const records = pageLogs.map((log) => ({
      ...log,
      certificate: certificateMap.get(log.certificate_id) ?? null,
    }));

    return NextResponse.json({
      records,
      hasMore,
    });
  } catch (error) {
    console.error("Verification logs API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load verification logs.",
      },
      { status: 500 }
    );
  }
}