
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EventData {
  id: string;
  event_name: string;
  event_date: string | null;
  event_end_date: string | null;
  event_type: string | null;
  organization: string | null;
  duration: string | null;
  description: string | null;
  status: string | null;
}

const formatDate = (date: string | null) => {
  if (!date) return "Not specified";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}-${month}-${year}`;
};

export default function CreateCertificatePage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen"
          style={{
            backgroundColor: "var(--admin-bg)",
            color: "var(--admin-text)",
          }}
        />
      }
    >
      <CreateCertificateForm />
    </Suspense>
  );
}

function CreateCertificateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [events, setEvents] = useState<EventData[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [certificateId, setCertificateId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [scoreApplicable, setScoreApplicable] = useState(false);
  const [scoreObtained, setScoreObtained] = useState("");
  const [scoreMax, setScoreMax] = useState("");
  const [grade, setGrade] = useState("");

  const [error, setError] = useState("");

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || null,
    [events, selectedEventId]
  );

  const percentage = useMemo(() => {
    const obtained = Number(scoreObtained);
    const maximum = Number(scoreMax);

    if (
      !scoreApplicable ||
      !scoreObtained ||
      !scoreMax ||
      maximum <= 0 ||
      Number.isNaN(obtained) ||
      Number.isNaN(maximum)
    ) {
      return "";
    }

    const value = (obtained / maximum) * 100;

    return Number.isFinite(value) ? value.toFixed(2) : "";
  }, [scoreApplicable, scoreObtained, scoreMax]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      setError("");

      const { data, error } = await supabase
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
        .order("event_date", { ascending: false });

      if (error) {
        console.error(error);
        setError("Unable to load events.");
        setLoadingEvents(false);
        return;
      }

      setEvents(data || []);

      const eventFromQuery = searchParams.get("event");

      if (eventFromQuery && data?.some((event) => event.id === eventFromQuery)) {
        setSelectedEventId(eventFromQuery);
      }

      setLoadingEvents(false);
    };

    loadEvents();
  }, [searchParams, supabase]);

  const handleCreateCertificate = async () => {
    setError("");

    const cleanCertificateId = certificateId.trim();
    const cleanRecipientName = recipientName.trim();

    if (!cleanCertificateId) {
      setError("Please enter a certificate ID.");
      return;
    }

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
        scoreObtained === "" ||
        scoreMax === "" ||
        Number.isNaN(obtained) ||
        Number.isNaN(maximum)
      ) {
        setError("Please enter valid score details.");
        return;
      }

      if (maximum <= 0) {
        setError("Maximum score must be greater than zero.");
        return;
      }

      if (obtained < 0 || obtained > maximum) {
        setError(
          "Score obtained must be between zero and the maximum score."
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const { data: existingCertificate, error: duplicateError } =
        await supabase
          .from("certificates")
          .select("id")
          .eq("certificate_id", cleanCertificateId)
          .maybeSingle();

      if (duplicateError) {
        console.error(duplicateError);
        setError("Unable to verify certificate ID. Please try again.");
        setSubmitting(false);
        return;
      }

      if (existingCertificate) {
        setError(
          "This certificate ID already exists. Please use a different ID."
        );
        setSubmitting(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("certificates")
        .insert({
          certificate_id: cleanCertificateId,
          event_id: selectedEvent.id,
          recipient_name: cleanRecipientName,
          program_name: selectedEvent.event_name,
          certificate_type: selectedEvent.event_type,
          issue_date:
            selectedEvent.event_end_date || selectedEvent.event_date,
          duration: selectedEvent.duration || null,
          organization:
            selectedEvent.organization || "Adroiit Technovations",
          description: selectedEvent.description || null,
          status: "VALID",
          score_applicable: scoreApplicable,
          score_obtained: scoreApplicable
            ? Number(scoreObtained)
            : null,
          score_max: scoreApplicable ? Number(scoreMax) : null,
          grade: scoreApplicable ? grade.trim() || null : null,
          score_label: scoreApplicable ? "Percentage" : null,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error(insertError);

        if (
          insertError.code === "23505" ||
          insertError.message
            ?.toLowerCase()
            .includes("certificate_id")
        ) {
          setError(
            "This certificate ID already exists. Please use a different ID."
          );
        } else {
          setError(
            insertError.message ||
              "Unable to create certificate. Please try again."
          );
        }

        setSubmitting(false);
        return;
      }

      if (!data?.id) {
        setError(
          "Certificate was created, but its record ID could not be retrieved."
        );
        setSubmitting(false);
        return;
      }

      // Redirect to the actual certificate detail page
      router.push(`/certifier/certificates/${data.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating the certificate.");
      setSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-25 w-full max-w-[1350px] px-4 py-10 sm:px-10 lg:px-0">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/certifier/certificates"
              className="mb-5 inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition"
              style={{
                borderColor: "var(--admin-border)",
                backgroundColor: "var(--admin-surface)",
                color: "var(--admin-text)",
              }}
            >
              <ArrowLeft
                className="h-4 w-4"
                style={{ color: "#ffffff" }}
              />
              Back to Certificates
            </Link>

            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--admin-primary)" }}
            >
              Certificate Management
            </p>

            <h1
              className="mt-2 text-3xl font-semibold tracking-tight"
              style={{ color: "var(--admin-text)" }}
            >
              Create Certificate
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              Create a certificate record, assign its unique ID and
              generate its QR code after creation.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 rounded-2xl border px-5 py-4 text-sm"
            style={{
              borderColor: "var(--admin-danger)",
              backgroundColor: "var(--admin-surface)",
              color: "var(--admin-danger)",
            }}
          >
            {error}
          </div>
        )}

        {/* Certificate Information */}
        <section
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--admin-border)",
            backgroundColor: "var(--admin-surface)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          <div className="mb-7 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border"
              style={{
                borderColor: "var(--admin-border)",
                backgroundColor: "#ffffff",
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
                style={{ color: "var(--admin-text-muted)" }}
              >
                Enter the certificate details below.
              </p>
            </div>
          </div>

          {/* Certificate ID + Recipient Name */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="certificate-id"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Certificate ID
              </label>

              <div className="relative">
                <Award
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                  style={{ color: "#ffffff" }}
                />

                <input
                  id="certificate-id"
                  type="text"
                  value={certificateId}
                  onChange={(event) =>
                    setCertificateId(event.target.value)
                  }
                  placeholder="Enter certificate ID"
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
                  style={{
                    borderColor: "var(--admin-border)",
                    backgroundColor: "var(--admin-bg)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="recipient-name"
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Recipient Name
              </label>

              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                  style={{ color: "#ffffff" }}
                />

                <input
                  id="recipient-name"
                  type="text"
                  value={recipientName}
                  onChange={(event) =>
                    setRecipientName(event.target.value)
                  }
                  placeholder="Enter recipient name"
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
                  style={{
                    borderColor: "var(--admin-border)",
                    backgroundColor: "var(--admin-bg)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="mt-6">
            <h3
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--admin-text)" }}
            >
              Event Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Event Name */}
              <div>
                <label
                  htmlFor="event-name"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Event Name
                </label>

                <div className="relative">
                  <Award
                    className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#ffffff" }}
                  />

                  <select
                    id="event-name"
                    value={selectedEventId}
                    onChange={(event) =>
                      setSelectedEventId(event.target.value)
                    }
                    disabled={loadingEvents}
                    className="h-12 w-full appearance-none rounded-xl border pl-11 pr-11 text-sm outline-none transition"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  >
                    <option value="">
                      {loadingEvents
                        ? "Loading events..."
                        : "Select an event"}
                    </option>

                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.event_name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#ffffff" }}
                  />
                </div>
              </div>

              {/* Certificate Type */}
              <div>
                <label
                  htmlFor="certificate-type"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Certificate Type
                </label>

                <div className="relative">
                  <Award
                    className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#ffffff" }}
                  />

                  <input
                    id="certificate-type"
                    type="text"
                    value={selectedEvent?.event_type || ""}
                    readOnly
                    placeholder="Auto synced from event"
                    className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>

              {/* Issue Date */}
              <div>
                <label
                  htmlFor="issue-date"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Issue Date
                </label>

                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                    style={{ color: "#ffffff" }}
                  />

                  <input
                    id="issue-date"
                    type="text"
                    value={
                      selectedEvent
                        ? formatDate(
                            selectedEvent.event_end_date ||
                              selectedEvent.event_date
                          )
                        : ""
                    }
                    readOnly
                    placeholder="Auto synced from event"
                    className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Event Information */}
          {selectedEvent && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Host
                  </label>

                  <input
                    type="text"
                    value={
                      selectedEvent.organization ||
                      "Adroiit Technovations"
                    }
                    readOnly
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Duration
                  </label>

                  <input
                    type="text"
                    value={selectedEvent.duration || "Not specified"}
                    readOnly
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Optional Score Details */}
          <div
            className="mt-8 rounded-2xl border p-5"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-bg)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--admin-text)" }}
                >
                  Optional Score Details
                </h3>

                <p
                  className="mt-1 text-xs leading-5"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Add assessment information if this certificate
                  includes a score.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScoreApplicable((value) => !value);

                  if (scoreApplicable) {
                    setScoreObtained("");
                    setScoreMax("");
                    setGrade("");
                  }
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition"
                style={{
                  borderColor: "var(--admin-border)",
                  backgroundColor: scoreApplicable
                    ? "var(--admin-primary)"
                    : "var(--admin-surface)",
                  color: scoreApplicable
                    ? "#ffffff"
                    : "var(--admin-text-secondary)",
                }}
              >
                {scoreApplicable && (
                  <Check className="h-3.5 w-3.5" />
                )}
                {scoreApplicable ? "Enabled" : "Add Score"}
              </button>
            </div>

            {scoreApplicable && (
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
                {/* Score Obtained */}
                <div>
                  <label
                    htmlFor="score-obtained"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Score Obtained
                  </label>

                  <input
                    id="score-obtained"
                    type="number"
                    min="0"
                    value={scoreObtained}
                    onChange={(event) =>
                      setScoreObtained(event.target.value)
                    }
                    placeholder="0"
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-surface)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Maximum Score */}
                <div>
                  <label
                    htmlFor="score-max"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Maximum Score
                  </label>

                  <input
                    id="score-max"
                    type="number"
                    min="1"
                    value={scoreMax}
                    onChange={(event) =>
                      setScoreMax(event.target.value)
                    }
                    placeholder="100"
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-surface)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Percentage */}
                <div>
                  <label
                    htmlFor="percentage"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Percentage
                  </label>

                  <input
                    id="percentage"
                    type="text"
                    value={percentage ? `${percentage}%` : ""}
                    readOnly
                    placeholder="Auto calculated"
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-bg)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label
                    htmlFor="grade"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Grade
                  </label>

                  <input
                    id="grade"
                    type="text"
                    value={grade}
                    onChange={(event) =>
                      setGrade(event.target.value)
                    }
                    placeholder="e.g. A+"
                    className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
                    style={{
                      borderColor: "var(--admin-border)",
                      backgroundColor: "var(--admin-surface)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <Link
              href="/certifier/certificates"
              className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition"
              style={{
                borderColor: "var(--admin-border)",
                backgroundColor: "var(--admin-surface)",
                color: "var(--admin-text-secondary)",
              }}
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleCreateCertificate}
              disabled={submitting || loadingEvents}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "var(--admin-primary)",
                color: "#ffffff",
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    style={{ color: "#ffffff" }}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Check
                    className="h-4 w-4"
                    style={{ color: "#ffffff" }}
                  />
                  Create Certificate
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
