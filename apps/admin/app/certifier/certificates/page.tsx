"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft,
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

type CertificateStatus = "VALID" | "REVOKED";

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
  status: CertificateStatus | string;
  score_applicable: boolean;
  score_obtained: number | null;
  score_max: number | null;
  grade: string | null;
  score_label: string | null;
  created_at: string;
  updated_at: string;
};

type Event = {
  id: string;
  event_name: string;
  event_type: string;
};

type CertificateWithEvent = Certificate & {
  event_name: string;
  event_type: string;
};

type SortKey =
  | "certificate_id"
  | "recipient_name"
  | "event_name"
  | "event_type"
  | "issue_date";

type SortDirection = "asc" | "desc";

export default function CertificatesPage() {
  const supabase = createClient();

  const [certificates, setCertificates] = useState<
    CertificateWithEvent[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortKey, setSortKey] =
    useState<SortKey>("issue_date");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const [deleteTarget, setDeleteTarget] =
    useState<CertificateWithEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadCertificates(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [
        { data: certificateData, error: certificateError },
        { data: eventData, error: eventError },
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
          .order("issue_date", { ascending: false }),

        supabase
          .from("events")
          .select(`
            id,
            event_name,
            event_type
          `),
      ]);

      if (certificateError) {
        console.error(
          "Error loading certificates:",
          certificateError
        );
        setCertificates([]);
        return;
      }

      if (eventError) {
        console.error(
          "Error loading events:",
          eventError
        );
      }

      const eventsMap = new Map<string, Event>();

      (eventData || []).forEach((event) => {
        eventsMap.set(event.id, event);
      });

      const formattedCertificates: CertificateWithEvent[] =
        ((certificateData || []) as Certificate[]).map(
          (certificate) => {
            const event = eventsMap.get(
              certificate.event_id
            );

            return {
              ...certificate,
              event_name:
                event?.event_name ||
                certificate.program_name ||
                "Unknown Event",
              event_type:
                event?.event_type ||
                certificate.certificate_type ||
                "—",
            };
          }
        );

      setCertificates(formattedCertificates);
    } catch (error) {
      console.error(
        "Unexpected error loading certificates:",
        error
      );
      setCertificates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  function handleSortChange(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(key);

    if (key === "issue_date") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  }

  const filteredCertificates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = certificates.filter((certificate) => {
      if (!query) {
        return true;
      }

      return (
        certificate.certificate_id
          .toLowerCase()
          .includes(query) ||
        certificate.recipient_name
          .toLowerCase()
          .includes(query) ||
        certificate.event_name
          .toLowerCase()
          .includes(query) ||
        certificate.event_type
          .toLowerCase()
          .includes(query)
      );
    });

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "certificate_id":
          comparison = a.certificate_id.localeCompare(
            b.certificate_id
          );
          break;

        case "recipient_name":
          comparison = a.recipient_name.localeCompare(
            b.recipient_name
          );
          break;

        case "event_name":
          comparison = a.event_name.localeCompare(
            b.event_name
          );
          break;

        case "event_type":
          comparison = a.event_type.localeCompare(
            b.event_type
          );
          break;

        case "issue_date":
          comparison =
            new Date(a.issue_date).getTime() -
            new Date(b.issue_date).getTime();
          break;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    certificates,
    searchQuery,
    sortKey,
    sortDirection,
  ]);

  function formatDate(date: string) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  async function handleDeleteCertificate() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) {
        console.error(
          "Error deleting certificate:",
          error
        );
        return;
      }

      setCertificates((current) =>
        current.filter(
          (certificate) =>
            certificate.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "Unexpected error deleting certificate:",
        error
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main
      className={`${bricolage.className} min-h-screen`}
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-25 w-full max-w-[1350px] px-4 py-10 sm:px-6 lg:px-0">
        {/* Back Button */}
        <div className="mb-5">
          <Link
            href="/certifier"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-surface)",
              color: "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Certifier Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div
            className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "var(--admin-primary)",
            }}
          >
            Certificate Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-3xl">
            List of Certificates
          </h1>

          <p
            className="mt-2 text-sm sm:text-base"
            style={{
              color: "var(--admin-text-secondary)",
            }}
          >
            Manage issued certificates and view
            certificate details.
          </p>
        </div>

        {/* Search / Sort / Refresh */}
        <section
          className="mb-7 rounded-2xl border p-3 shadow-sm sm:p-4"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by certificate ID, recipient, event or certificate type..."
                className="h-12 w-full rounded-xl border pl-11 pr-10 text-sm outline-none transition-colors placeholder:opacity-70 focus:border-[var(--admin-primary)]"
                style={{
                  backgroundColor: "var(--admin-bg)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition-colors hover:opacity-70"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Direction */}
            <button
              type="button"
              onClick={() =>
                setSortDirection((current) =>
                  current === "asc" ? "desc" : "asc"
                )
              }
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:opacity-80"
              style={{
                backgroundColor: "var(--admin-bg)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            >
              <ArrowUpDown className="h-4 w-4" />

              {sortDirection === "asc"
                ? "Ascending"
                : "Descending"}
            </button>

            {/* Sort */}
            <div className="relative shrink-0">
              <ArrowUpDown
                className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              />

              <select
                value={sortKey}
                onChange={(event) =>
                  handleSortChange(
                    event.target.value as SortKey
                  )
                }
                className="h-12 w-full min-w-[190px] appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none transition-colors focus:border-[var(--admin-primary)]"
                style={{
                  backgroundColor: "var(--admin-bg)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text)",
                }}
              >
                <option value="issue_date">
                  Issue Date
                </option>

                <option value="certificate_id">
                  Certificate ID
                </option>

                <option value="recipient_name">
                  Recipient Name
                </option>

                <option value="event_name">
                  Event Name
                </option>

                <option value="event_type">
                  Certificate Type
                </option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => loadCertificates(true)}
              disabled={refreshing}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "var(--admin-bg)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          <div
            className="mt-3 px-1 text-xs"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Showing {filteredCertificates.length} of{" "}
            {certificates.length} certificates
          </div>
        </section>

        {/* Certificates Table */}
        <section
          className="overflow-hidden rounded-2xl border shadow-sm"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          {/* Table Header */}
          <div
            className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            style={{
              borderColor: "var(--admin-border)",
            }}
          >
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">
                  Certificates
                </h2>

                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  Total Certificates:{" "}
                  <span
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    {certificates.length}
                  </span>
                </span>
              </div>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                View and manage all issued certificates.
              </p>
            </div>

            <Link
              href="/certifier/certificates/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--admin-primary)",
                color: "#ffffff",
              }}
            >
              <Plus className="h-4 w-4" />
              Add Certificate
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: "var(--admin-border)",
                  }}
                >
                  <th
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Certificate ID
                  </th>

                  <th
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Recipient Name
                  </th>

                  <th
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Event Name
                  </th>

                  <th
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Certificate Type
                  </th>

                  <th
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Issue Date
                  </th>

                  <th
                    className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                      style={{
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Loading certificates...
                    </td>
                  </tr>
                ) : filteredCertificates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <p className="text-sm font-semibold">
                        No certificates found
                      </p>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Try changing your search or add a
                        new certificate.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map(
                    (certificate) => (
                      <tr
                        key={certificate.id}
                        className="border-b last:border-b-0"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                        }}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-medium">
                            {certificate.certificate_id}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold">
                            {certificate.recipient_name}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[300px] text-sm font-medium">
                            {certificate.event_name}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="text-sm"
                            style={{
                              color:
                                "var(--admin-text-secondary)",
                            }}
                          >
                            {certificate.event_type ||
                              certificate.certificate_type ||
                              "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays
                              className="h-4 w-4"
                              style={{
                                color:
                                  "var(--admin-primary)",
                              }}
                            />

                            {formatDate(
                              certificate.issue_date
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/certifier/certificates/${certificate.id}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-75"
                              style={{
                                borderColor:
                                  "var(--admin-border)",
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                              title="View Certificate"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <Link
                              href={`/certifier/certificates/${certificate.id}/edit`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-75"
                              style={{
                                borderColor:
                                  "var(--admin-border)",
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                              title="Edit Certificate"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget(
                                  certificate
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-75"
                              style={{
                                borderColor:
                                  "var(--admin-border)",
                                color:
                                  "var(--admin-danger)",
                              }}
                              title="Delete Certificate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y md:hidden">
            {loading ? (
              <div
                className="px-5 py-14 text-center text-sm"
                style={{
                  color: "var(--admin-text-muted)",
                }}
              >
                Loading certificates...
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <p className="text-sm font-semibold">
                  No certificates found
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Try changing your search or add a new
                  certificate.
                </p>
              </div>
            ) : (
              filteredCertificates.map(
                (certificate) => (
                  <div
                    key={certificate.id}
                    className="p-4"
                  >
                    <div className="min-w-0">
                      <p
                        className="truncate font-mono text-sm font-semibold"
                        style={{
                          color:
                            "var(--admin-primary)",
                        }}
                      >
                        {certificate.certificate_id}
                      </p>

                      <h3 className="mt-1 text-base font-semibold">
                        {certificate.recipient_name}
                      </h3>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          Event Name
                        </p>

                        <p className="mt-1 text-sm">
                          {certificate.event_name}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          Certificate Type
                        </p>

                        <p
                          className="mt-1 text-sm"
                          style={{
                            color:
                              "var(--admin-text-secondary)",
                          }}
                        >
                          {certificate.event_type ||
                            certificate.certificate_type ||
                            "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays
                          className="h-4 w-4"
                          style={{
                            color:
                              "var(--admin-primary)",
                          }}
                        />

                        <span className="text-sm">
                          {formatDate(
                            certificate.issue_date
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/certifier/certificates/${certificate.id}`}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors hover:opacity-75"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-text-secondary)",
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>

                      <Link
                        href={`/certifier/certificates/${certificate.id}/edit`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-75"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-text-secondary)",
                        }}
                        title="Edit Certificate"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            certificate
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:opacity-75"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-danger)",
                        }}
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Delete Certificate
                </h3>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p
              className="mt-5 text-sm leading-6"
              style={{
                color:
                  "var(--admin-text-secondary)",
              }}
            >
              You are about to permanently delete
              certificate{" "}
              <span
                className="font-semibold"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                {deleteTarget.certificate_id}
              </span>{" "}
              issued to{" "}
              <span
                className="font-semibold"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                {deleteTarget.recipient_name}
              </span>
              .
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-10 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-75 disabled:opacity-50"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCertificate}
                disabled={deleting}
                className="h-10 rounded-xl px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor:
                    "var(--admin-danger)",
                  color: "#ffffff",
                }}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

