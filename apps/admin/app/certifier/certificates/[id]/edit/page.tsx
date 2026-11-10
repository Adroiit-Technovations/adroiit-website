"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Certificate = {
  id: string;
  certificate_id: string;
  event_id: string;
  recipient_name: string;
  program_name: string;
  certificate_type: string;
  issue_date: string;
  duration: string | null;
  organization: string | null;
  description: string | null;
  status: string;
  score_applicable: boolean;
  score_obtained: number | null;
  score_max: number | null;
  grade: string | null;
  score_label: string | null;
  created_at: string;
  updated_at: string;
};

type EventData = {
  id: string;
  event_name: string;
  event_date: string;
  event_end_date: string | null;
  event_type: string;
  organization: string | null;
  duration: string | null;
  description: string | null;
  status: string;
};

const formatDate = (date: string | null) => {
  if (!date) return "Not specified";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}-${month}-${year}`;
};

export default function EditCertificatePage() {
  const params = useParams();
  const router = useRouter();

  const certificateId = params.id as string;

  const supabase = useMemo(() => createClient(), []);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const [recipientName, setRecipientName] = useState("");

  const [scoreApplicable, setScoreApplicable] = useState(false);
  const [scoreObtained, setScoreObtained] = useState("");
  const [scoreMax, setScoreMax] = useState("");
  const [grade, setGrade] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedEvent = useMemo(() => {
    return events.find((event) => event.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const percentage = useMemo(() => {
    if (!scoreObtained || !scoreMax) return "";

    const obtained = Number(scoreObtained);
    const maximum = Number(scoreMax);

    if (
      Number.isNaN(obtained) ||
      Number.isNaN(maximum) ||
      maximum <= 0
    ) {
      return "";
    }

    const value = (obtained / maximum) * 100;

    return `${value.toFixed(2)}%`;
  }, [scoreObtained, scoreMax]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          { data: certificateData, error: certificateError },
          { data: eventsData, error: eventsError },
        ] = await Promise.all([
          supabase
            .from("certificates")
            .select(`
              id,
              certificate_id,
              event_id,
              recipient_name,
              program_name,
              certificate_type,
              issue_date,
              duration,
              organization,
              description,
              status,
              score_applicable,
              score_obtained,
              score_max,
              grade,
              score_label,
              created_at,
              updated_at
            `)
            .eq("id", certificateId)
            .single(),

          supabase
            .from("events")
            .select(`
              id,
              event_name,
              event_date,
              event_end_date,
              event_type,
              organization,
              duration,
              description,
              status
            `)
            .neq("status", "CANCELLED")
            .order("event_date", { ascending: false }),
        ]);

        if (certificateError) {
          throw new Error(
            certificateError.message || "Failed to load certificate."
          );
        }

        if (eventsError) {
          throw new Error(
            eventsError.message || "Failed to load events."
          );
        }

        if (!certificateData) {
          throw new Error("Certificate not found.");
        }

        setCertificate(certificateData as Certificate);
        setEvents((eventsData || []) as EventData[]);

        setSelectedEventId(certificateData.event_id || "");
        setRecipientName(certificateData.recipient_name || "");

        setScoreApplicable(Boolean(certificateData.score_applicable));

        setScoreObtained(
          certificateData.score_obtained !== null &&
            certificateData.score_obtained !== undefined
            ? String(certificateData.score_obtained)
            : ""
        );

        setScoreMax(
          certificateData.score_max !== null &&
            certificateData.score_max !== undefined
            ? String(certificateData.score_max)
            : ""
        );

        setGrade(certificateData.grade || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificate."
        );
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      loadData();
    }
  }, [certificateId, supabase]);

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!certificate) return;

    setError("");
    setSuccess("");

    const cleanRecipientName = recipientName.trim();

    if (!cleanRecipientName) {
      setError("Please enter the recipient name.");
      return;
    }

    if (!selectedEvent) {
      setError("Please select an event.");
      return;
    }

    if (scoreApplicable) {
      const obtained = Number(scoreObtained);
      const maximum = Number(scoreMax);

      if (
        scoreObtained.trim() === "" ||
        scoreMax.trim() === ""
      ) {
        setError(
          "Please enter both score obtained and maximum score."
        );
        return;
      }

      if (
        Number.isNaN(obtained) ||
        Number.isNaN(maximum)
      ) {
        setError("Please enter valid score values.");
        return;
      }

      if (maximum <= 0) {
        setError("Maximum score must be greater than zero.");
        return;
      }

      if (obtained < 0 || obtained > maximum) {
        setError(
          "Score obtained must be between 0 and the maximum score."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from("certificates")
        .update({
          event_id: selectedEvent.id,
          recipient_name: cleanRecipientName,
          certificate_type: selectedEvent.event_type || "",
          issue_date:
            selectedEvent.event_end_date ||
            selectedEvent.event_date ||
            null,
          duration: selectedEvent.duration || null,
          organization:
            selectedEvent.organization ||
            "Adroiit Technovations",
          score_applicable: scoreApplicable,
          score_obtained: scoreApplicable
            ? Number(scoreObtained)
            : null,
          score_max: scoreApplicable
            ? Number(scoreMax)
            : null,
          grade: scoreApplicable
            ? grade.trim() || null
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", certificate.id);

      if (updateError) {
        throw new Error(
          updateError.message || "Failed to update certificate."
        );
      }

      setSuccess("Certificate updated successfully.");

      setTimeout(() => {
        router.push(`/certifier/certificates/${certificate.id}`);
        router.refresh();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update certificate."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main
        className="min-h-screen"
        style={{
          background: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto flex min-h-screen max-w-[1400px] items-center justify-center px-6">
          <div className="flex items-center gap-3">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: "var(--admin-primary)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              Loading certificate...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main
        className="min-h-screen"
        style={{
          background: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <Link
            href="/certifier/certificates"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            <ArrowLeft
              className="h-4 w-4"
              style={{ color: "var(--admin-text)" }}
            />
            Back to Certificates
          </Link>

          <div
            className="mt-6 rounded-3xl border p-6"
            style={{
              background: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--admin-danger)" }}
            >
              {error || "Certificate not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-25 max-w-[1400px] px-6 py-8">
        {/* Back */}
        <Link
          href={`/certifier/certificates/${certificate.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            background: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            color: "var(--admin-text)",
          }}
        >
          <ArrowLeft
            className="h-4 w-4"
            style={{ color: "var(--admin-text)" }}
          />
          Back to Certificates
        </Link>

        {/* Header */}
        <div className="mt-6">
          <p
            className="text-sm font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--admin-primary)" }}
          >
            CERTIFICATE MANAGEMENT
          </p>

          <h1
            className="mt-2 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            Edit Certificate
          </h1>

          <p
            className="mt-1 text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Update the certificate details and assessment information.
          </p>
        </div>

        {/* Certificate Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="mt-6 overflow-hidden rounded-3xl border"
            style={{
              background: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            {/* Certificate Information */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--admin-border)",
                  }}
                >
                  <Award
                    className="h-5 w-5"
                    style={{ color: "var(--admin-primary)" }}
                  />
                </div>

                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Certificate Information
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Update the certificate information below.
                  </p>
                </div>
              </div>

              {/* Certificate ID + Recipient Name */}
              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Certificate ID */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Certificate ID
                  </label>

                  <div className="relative">
                    <div
                      className="flex min-h-[46px] items-center rounded-xl border px-4 text-sm"
                      style={{
                        background: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text-secondary)",
                      }}
                    >
                      {certificate.certificate_id}
                    </div>
                  </div>
                </div>

                {/* Recipient Name */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Recipient Name
                  </label>

                  <div className="relative">
                    <UserRound
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                      style={{ color: "#ffffff" }}
                    />

                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) =>
                        setRecipientName(e.target.value)
                      }
                      placeholder="Enter recipient name"
                      className="h-[46px] w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                      style={{
                        background: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                        outlineColor: "var(--admin-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Event Name + Host Name */}
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Event Name */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Event Name
                  </label>

                  <div className="relative">
                    <select
                      value={selectedEventId}
                      onChange={(e) =>
                        handleEventChange(e.target.value)
                      }
                      className="h-[46px] w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none transition focus:ring-2"
                      style={{
                        background: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                        outlineColor: "var(--admin-primary)",
                      }}
                    >
                      <option value="">
                        Select an event
                      </option>

                      {events.map((event) => (
                        <option
                          key={event.id}
                          value={event.id}
                        >
                          {event.event_name}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{ color: "#ffffff" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Host Name */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Host Name
                  </label>

                  <div
                    className="flex min-h-[46px] items-center rounded-xl border px-4 text-sm"
                    style={{
                      background: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {selectedEvent?.organization ||
                      "Adroiit Technovations"}
                  </div>
                </div>
              </div>

              {/* Certificate Type + Duration + Issue Date */}
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Certificate Type */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Certificate Type
                  </label>

                  <div
                    className="flex min-h-[46px] items-center rounded-xl border px-4 text-sm"
                    style={{
                      background: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {selectedEvent?.event_type ||
                      certificate.certificate_type ||
                      "Not specified"}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Duration
                  </label>

                  <div
                    className="flex min-h-[46px] items-center rounded-xl border px-4 text-sm"
                    style={{
                      background: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    {selectedEvent?.duration ||
                      certificate.duration ||
                      "Not specified"}
                  </div>
                </div>

                {/* Issue Date */}
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    Issue Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                      style={{ color: "#ffffff" }}
                    />

                    <div
                      className="flex min-h-[46px] items-center rounded-xl border pl-11 pr-4 text-sm"
                      style={{
                        background: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text-secondary)",
                      }}
                    >
                      {formatDate(
                        selectedEvent?.event_end_date ||
                          selectedEvent?.event_date ||
                          certificate.issue_date
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <div
                className="mt-7 border-t pt-7"
                style={{
                  borderColor: "var(--admin-border)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "var(--admin-text)" }}
                    >
                      Score Details
                    </h3>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color: "var(--admin-text-secondary)",
                      }}
                    >
                      Add assessment details if applicable.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setScoreApplicable((value) => !value)
                    }
                    className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                    style={{
                      background: scoreApplicable
                        ? "var(--admin-primary)"
                        : "var(--admin-border-strong)",
                    }}
                    aria-label="Toggle score details"
                  >
                    <span
                      className="absolute top-1 h-4 w-4 rounded-full bg-white transition-transform"
                      style={{
                        left: scoreApplicable
                          ? "24px"
                          : "4px",
                      }}
                    />
                  </button>
                </div>

                {scoreApplicable && (
                  <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Score Obtained */}
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Score Obtained
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={scoreObtained}
                        onChange={(e) =>
                          setScoreObtained(e.target.value)
                        }
                        placeholder="Enter score obtained"
                        className="h-[46px] w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2"
                        style={{
                          background: "var(--admin-bg)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                          outlineColor: "var(--admin-primary)",
                        }}
                      />
                    </div>

                    {/* Maximum Score */}
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Maximum Score
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={scoreMax}
                        onChange={(e) =>
                          setScoreMax(e.target.value)
                        }
                        placeholder="Enter maximum score"
                        className="h-[46px] w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2"
                        style={{
                          background: "var(--admin-bg)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                          outlineColor: "var(--admin-primary)",
                        }}
                      />
                    </div>

                    {/* Percentage */}
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Percentage
                      </label>

                      <div
                        className="flex h-[46px] items-center rounded-xl border px-4 text-sm"
                        style={{
                          background: "var(--admin-bg)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        {percentage || "Automatically calculated"}
                      </div>
                    </div>

                    {/* Grade */}
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Grade
                      </label>

                      <input
                        type="text"
                        value={grade}
                        onChange={(e) =>
                          setGrade(e.target.value)
                        }
                        placeholder="Enter grade"
                        className="h-[46px] w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2"
                        style={{
                          background: "var(--admin-bg)",
                          borderColor: "var(--admin-border)",
                          color: "var(--admin-text)",
                          outlineColor: "var(--admin-primary)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alerts */}
            {(error || success) && (
              <div className="px-6 pb-2 md:px-8">
                {error && (
                  <div
                    className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
                    style={{
                      background:
                        "color-mix(in srgb, var(--admin-danger) 8%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--admin-danger) 25%, transparent)",
                      color: "var(--admin-danger)",
                    }}
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
                    style={{
                      background:
                        "color-mix(in srgb, var(--admin-success) 8%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--admin-success) 25%, transparent)",
                      color: "var(--admin-success)",
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div
              className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-end md:px-8"
              style={{
                borderColor: "var(--admin-border)",
              }}
            >
              <Link
                href={`/certifier/certificates/${certificate.id}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border px-5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                  background: "var(--admin-bg)",
                }}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--admin-primary)",
                  color: "#ffffff",
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}