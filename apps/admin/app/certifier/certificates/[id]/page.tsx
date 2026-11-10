"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CertificateQRCode from "@/components/certificates/CertificateQRCode";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  ShieldCheck,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Certificate = {
  id: string;
  certificate_id: string;
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

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [copied, setCopied] = useState(false);

  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    async function loadCertificate() {
      const supabase = createClient();

      try {
        setLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
          .from("certificates")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setCertificate(data as Certificate);

        if (typeof window !== "undefined") {
          setPublicUrl(
            `${window.location.origin}/verify/${data.certificate_id}`
          );
        }
      } catch (err) {
        console.error("Certificate loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load certificate."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCertificate();
    }
  }, [id]);

  async function copyVerificationUrl() {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy URL error:", err);
    }
  }

  async function deleteCertificate() {
    if (!certificate) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificate.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      router.push("/certifier/certificates");
      router.refresh();
    } catch (err) {
      console.error("Certificate delete error:", err);

      setDeleteError(
        err instanceof Error
          ? err.message
          : "Unable to delete certificate."
      );

      setDeleting(false);
    }
  }

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
              style={{
                color: "var(--admin-text-secondary)",
              }}
            >
              Loading certificate...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !certificate) {
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
              borderColor:
                "color-mix(in srgb, var(--admin-danger) 25%, var(--admin-border))",
            }}
          >
            <div className="flex items-start gap-3">
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: "var(--admin-danger)" }}
              />

              <div>
                <h1
                  className="text-base font-semibold"
                  style={{ color: "var(--admin-text)" }}
                >
                  Certificate not found
                </h1>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  {error ||
                    "The requested certificate could not be found."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const percentage =
    certificate.score_applicable &&
    certificate.score_obtained !== null &&
    certificate.score_max !== null &&
    certificate.score_max > 0
      ? (certificate.score_obtained /
          certificate.score_max) *
        100
      : null;

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

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.22em]"
              style={{ color: "var(--admin-primary)" }}
            >
              CERTIFICATE MANAGEMENT
            </p>

            <h1
              className="mt-2 break-all text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: "var(--admin-text)" }}
            >
              {certificate.certificate_id}
            </h1>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--admin-text-secondary)",
              }}
            >
              View certificate information, assessment details,
              and public verification.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/certifier/certificates/${certificate.id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                background: "var(--admin-primary)",
                color: "#ffffff",
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit Certificate
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Certificate Information */}
            <section
              className="rounded-3xl border"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
              }}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "#ffffff",
                      border:
                        "1px solid var(--admin-border)",
                    }}
                  >
                    <Award
                      className="h-5 w-5"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="text-base font-semibold"
                      style={{
                        color: "var(--admin-text)",
                      }}
                    >
                      Certificate Information
                    </h2>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color:
                          "var(--admin-text-secondary)",
                      }}
                    >
                      Certificate details associated with this
                      record.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <DetailField
                    label="Certificate ID"
                    value={certificate.certificate_id}
                  />

                  <DetailField
                    label="Recipient Name"
                    value={certificate.recipient_name}
                  />

                  <DetailField
                    label="Certificate Type"
                    value={
                      certificate.certificate_type || "—"
                    }
                  />

                  <DetailField
                    label="Program"
                    value={certificate.program_name || "—"}
                  />

                  <DetailField
                    label="Host Name"
                    value={
                      certificate.organization || "—"
                    }
                  />

                  <DetailField
                    label="Duration"
                    value={certificate.duration || "—"}
                    icon={<Clock3 className="h-4 w-4" />}
                  />

                  <DetailField
                    label="Issue Date"
                    value={formatDate(
                      certificate.issue_date
                    )}
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                  />

                  <DetailField
                    label="Created"
                    value={formatDateTime(
                      certificate.created_at
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Assessment Result */}
            {certificate.score_applicable && (
              <section
                className="rounded-3xl border"
                style={{
                  background: "var(--admin-surface)",
                  borderColor: "var(--admin-border)",
                  boxShadow: "var(--admin-shadow-sm)",
                }}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "#ffffff",
                        border:
                          "1px solid var(--admin-border)",
                      }}
                    >
                      <Target
                        className="h-5 w-5"
                        style={{
                          color:
                            "var(--admin-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{
                          color: "var(--admin-text)",
                        }}
                      >
                        Assessment Result
                      </h2>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color:
                            "var(--admin-text-secondary)",
                        }}
                      >
                        Evaluation information associated
                        with this certificate.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ScoreCard
                      label="Score Obtained"
                      value={formatNumber(
                        certificate.score_obtained
                      )}
                    />

                    <ScoreCard
                      label="Maximum Score"
                      value={formatNumber(
                        certificate.score_max
                      )}
                    />

                    <ScoreCard
                      label="Percentage"
                      value={
                        percentage !== null
                          ? `${percentage.toFixed(2)}%`
                          : "—"
                      }
                    />

                    <ScoreCard
                      label="Grade"
                      value={
                        certificate.grade || "—"
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Delete */}
            <section
              className="rounded-3xl border"
              style={{
                background:
                  "color-mix(in srgb, var(--admin-danger) 3%, var(--admin-surface))",
                borderColor:
                  "color-mix(in srgb, var(--admin-danger) 18%, var(--admin-border))",
              }}
            >
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    Delete Certificate
                  </h2>

                  <p
                    className="mt-1 max-w-2xl text-sm leading-6"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    Permanently delete this certificate
                    record. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(true)
                  }
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    background:
                      "color-mix(in srgb, var(--admin-danger) 8%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--admin-danger) 25%, var(--admin-border))",
                    color: "var(--admin-danger)",
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Certificate
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Verification */}
          <div className="space-y-6">
            <section
              className="rounded-3xl border"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
              }}
            >
              <div className="p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "#ffffff",
                      border:
                        "1px solid var(--admin-border)",
                    }}
                  >
                    <ShieldCheck
                      className="h-5 w-5"
                      style={{
                        color:
                          "var(--admin-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <h2
                      className="text-base font-semibold"
                      style={{
                        color: "var(--admin-text)",
                      }}
                    >
                      Public Verification
                    </h2>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color:
                          "var(--admin-text-secondary)",
                      }}
                    >
                      Scan or use the URL to verify this
                      certificate.
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mt-7 flex w-full items-center justify-center py-4">
                  <CertificateQRCode
                    certificateId={
                      certificate.certificate_id
                    }
                  />
                </div>

                {/* URL */}
                <div className="mt-6">
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    Verification URL
                  </label>

                  <div
                    className="rounded-xl border p-3"
                    style={{
                      background: "var(--admin-bg)",
                      borderColor:
                        "var(--admin-border)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className="break-all text-xs leading-6"
                          style={{
                            color:
                              "var(--admin-text-secondary)",
                          }}
                        >
                          {publicUrl ||
                            `/verify/${certificate.certificate_id}`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={copyVerificationUrl}
                        disabled={!publicUrl}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          background:
                            "var(--admin-surface)",
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Open Verification */}
                <Link
                  href={`/verify/${certificate.certificate_id}`}
                  target="_blank"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    background:
                      "var(--admin-surface)",
                    borderColor:
                      "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  Open Verification Page
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl border p-6 shadow-2xl sm:p-8"
            style={{
              background: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background:
                  "color-mix(in srgb, var(--admin-danger) 10%, transparent)",
                color: "var(--admin-danger)",
              }}
            >
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              className="mt-5 text-xl font-semibold"
              style={{
                color: "var(--admin-text)",
              }}
            >
              Delete this certificate?
            </h2>

            <p
              className="mt-3 text-sm leading-6"
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              This will permanently delete{" "}
              <span
                className="font-mono font-medium"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                {certificate.certificate_id}
              </span>{" "}
              from the certificate records. This action
              cannot be undone.
            </p>

            {deleteError && (
              <div
                className="mt-5 rounded-xl border px-4 py-3 text-sm"
                style={{
                  background:
                    "color-mix(in srgb, var(--admin-danger) 8%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--admin-danger) 25%, var(--admin-border))",
                  color: "var(--admin-danger)",
                }}
              >
                {deleteError}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="h-10 rounded-xl border px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--admin-bg)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteCertificate}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--admin-danger)",
                  color: "#ffffff",
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="mb-2 text-xs font-medium uppercase tracking-wider"
        style={{
          color: "var(--admin-text-muted)",
        }}
      >
        {label}
      </p>

      <div
        className="flex min-h-[46px] items-center gap-3 rounded-xl border px-4 text-sm"
        style={{
          background: "var(--admin-bg)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-text)",
        }}
      >
        {icon && (
          <span
            className="shrink-0"
            style={{
              color: "#ffffff",
            }}
          >
            {icon}
          </span>
        )}

        <span className="break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--admin-bg)",
        borderColor: "var(--admin-border)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{
          color: "var(--admin-text-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-2 text-xl font-semibold"
        style={{
          color: "var(--admin-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}-${month}-${year}`;
}

function formatDateTime(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatNumber(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number.isInteger(value)
    ? String(value)
    : String(value);
}