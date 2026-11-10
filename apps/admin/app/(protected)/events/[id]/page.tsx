"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  CircleX,
  Clock3,
  Eye,
  Filter,
  Pencil,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type EventStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

type Event = {
  id: string;
  event_name: string;
  event_date: string;
  event_end_date: string | null;
  event_type: string;
  organization: string | null;
  duration: string | null;
  description: string | null;
  status: EventStatus;
  created_at?: string;
  updated_at?: string;
};

type CertificateStatus = "VALID" | "REVOKED";

type Certificate = {
  id: string;
  certificate_id: string;
  event_id: string | null;
  recipient_name: string;
  program_name: string;
  certificate_type: string;
  issue_date: string;
  duration: string | null;
  organization: string | null;
  description: string | null;
  status: CertificateStatus;
  score_applicable: boolean;
  score_obtained: number | null;
  score_max: number | null;
  grade: string | null;
  score_label: string | null;
  created_at: string;
  updated_at: string;
};

type SortDirection = "asc" | "desc";

type CertificateSortKey =
  | "certificate_id"
  | "recipient_name"
  | "program_name"
  | "issue_date"
  | "status";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const supabase = createClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [certificateSearch, setCertificateSearch] =
    useState("");

  const [certificateStatusFilter, setCertificateStatusFilter] =
    useState("ALL");

  const [certificateSortKey, setCertificateSortKey] =
    useState<CertificateSortKey>("issue_date");

  const [certificateSortDirection, setCertificateSortDirection] =
    useState<SortDirection>("desc");

  const [deleteCertificateTarget, setDeleteCertificateTarget] =
    useState<Certificate | null>(null);

  const [deletingCertificate, setDeletingCertificate] =
    useState(false);

  const [deleteEventOpen, setDeleteEventOpen] = useState(false);

  const [deletingEvent, setDeletingEvent] = useState(false);

  async function loadData(showRefresh = false) {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [
        { data: eventData, error: eventError },
        { data: certificateData, error: certificateError },
      ] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle(),

        supabase
          .from("certificates")
          .select("*")
          .eq("event_id", eventId)
          .order("issue_date", { ascending: false }),
      ]);

      if (eventError) {
        throw new Error(eventError.message);
      }

      if (certificateError) {
        throw new Error(certificateError.message);
      }

      if (!eventData) {
        setEvent(null);
        setCertificates([]);
        setError("The requested event could not be found.");
        return;
      }

      setEvent(eventData as Event);
      setCertificates(
        (certificateData || []) as Certificate[]
      );
    } catch (err) {
      console.error("Event detail loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load event details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [eventId]);

  const filteredCertificates = useMemo(() => {
    const query = certificateSearch.trim().toLowerCase();

    const filtered = certificates.filter((certificate) => {
      const matchesSearch =
        !query ||
        certificate.certificate_id
          .toLowerCase()
          .includes(query) ||
        certificate.recipient_name
          .toLowerCase()
          .includes(query) ||
        certificate.program_name
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        certificateStatusFilter === "ALL" ||
        certificate.status === certificateStatusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (certificateSortKey) {
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

        case "program_name":
          comparison = a.program_name.localeCompare(
            b.program_name
          );
          break;

        case "issue_date":
          comparison =
            new Date(a.issue_date).getTime() -
            new Date(b.issue_date).getTime();
          break;

        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return certificateSortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    certificates,
    certificateSearch,
    certificateStatusFilter,
    certificateSortKey,
    certificateSortDirection,
  ]);

  const validCount = certificates.filter(
    (certificate) => certificate.status === "VALID"
  ).length;

  const revokedCount = certificates.filter(
    (certificate) => certificate.status === "REVOKED"
  ).length;

  function toggleCertificateSort(
    key: CertificateSortKey
  ) {
    if (certificateSortKey === key) {
      setCertificateSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setCertificateSortKey(key);
    setCertificateSortDirection("asc");
  }

  async function handleDeleteCertificate() {
    if (!deleteCertificateTarget) return;

    try {
      setDeletingCertificate(true);
      setError("");

      const { error: deleteError } = await supabase
        .from("certificates")
        .delete()
        .eq("id", deleteCertificateTarget.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setCertificates((current) =>
        current.filter(
          (certificate) =>
            certificate.id !== deleteCertificateTarget.id
        )
      );

      setDeleteCertificateTarget(null);
    } catch (err) {
      console.error("Certificate deletion error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the certificate."
      );
    } finally {
      setDeletingCertificate(false);
    }
  }

  async function handleDeleteEvent() {
    if (!event) return;

    if (certificates.length > 0) {
      setDeleteEventOpen(false);

      setError(
        `Cannot delete "${event.event_name}" because it has ${certificates.length} linked certificate${
          certificates.length === 1 ? "" : "s"
        }.`
      );

      return;
    }

    try {
      setDeletingEvent(true);
      setError("");

      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setDeleteEventOpen(false);

      router.push("/certifier/certificates");
      router.refresh();
    } catch (err) {
      console.error("Event deletion error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the event."
      );
    } finally {
      setDeletingEvent(false);
    }
  }

  if (loading) {
    return (
      <main
        className="min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10"
        style={{
          backgroundColor: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto w-full max-w-[1350px]">
          <div
            className="rounded-3xl border p-10 text-center"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
            }}
          >
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-transparent"
              style={{
                borderTopColor:
                  "var(--admin-primary-light)",
                borderRightColor:
                  "var(--admin-border-strong)",
              }}
            />

            <p
              className="mt-4 text-sm"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Loading event details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main
        className="min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10"
        style={{
          backgroundColor: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto w-full max-w-[1350px]">
          <Link
            href="/events"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:opacity-80"
            style={{
              borderColor:
                "var(--admin-border)",
              backgroundColor:
                "var(--admin-surface)",
              color:
                "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          <div
            className="mt-6 rounded-3xl border p-10 text-center"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
                color:
                  "var(--admin-danger)",
              }}
            >
              <CircleX size={25} />
            </div>

            <h1
              className="mt-5 text-xl font-bold"
              style={{
                color:
                  "var(--admin-text)",
              }}
            >
              Event Not Found
            </h1>

            <p
              className="mx-auto mt-2 max-w-md text-sm leading-6"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              {error ||
                "The event you are looking for does not exist or is no longer available."}
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white"
              style={{
                backgroundColor:
                  "var(--admin-primary)",
              }}
            >
              <ArrowLeft size={17} />
              Back to Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto w-full max-w-[1350px]">
        {/* Breadcrumb / Back */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:opacity-80"
            style={{
              borderColor:
                "var(--admin-border)",
              backgroundColor:
                "var(--admin-surface)",
              color:
                "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition disabled:opacity-50"
            style={{
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text-secondary)",
              backgroundColor:
                "var(--admin-surface)",
            }}
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Event Header */}
        <section className="mt-6">
          <div
            className="rounded-3xl border p-6 sm:p-8"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              boxShadow:
                "var(--admin-shadow-sm)",
            }}
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
                      color:
                        "var(--admin-primary-light)",
                    }}
                  >
                    <CalendarDays size={13} />
                    Event
                  </span>

                </div>

                <h1
                  className="mt-4 break-words text-3xl font-bold tracking-tight sm:text-2xl"
                  style={{
                    color:
                      "var(--admin-text)",
                  }}
                >
                  {event.event_name}
                </h1>

                <p
                  className="mt-3 text-sm leading-6"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  Manage event information and all certificates
                  issued under this event.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row xl:shrink-0">
                <Link
                  href={`/events/${event.id}/edit`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    borderColor:
                      "var(--admin-border-strong)",
                    backgroundColor:
                      "var(--admin-surface)",
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  <Pencil size={16} />
                  Edit Event
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteEventOpen(true)
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--admin-danger) 35%, var(--admin-border))",
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-danger) 7%, transparent)",
                    color:
                      "var(--admin-danger)",
                  }}
                >
                  <Trash2 size={16} />
                  Delete Event
                </button>
              </div>
            </div>

            {/* Event Information */}
            <div
              className="mt-3 grid gap-5 border-t pt-7 sm:grid-cols-2 lg:grid-cols-4"
              style={{
                borderColor:
                  "var(--admin-border)",
              }}
            >
              <EventInfo
                icon={<Users size={17} />}
                label="Host"
                value={
                  event.organization || "—"
                }
              />

              <EventInfo
                icon={<CalendarDays size={17} />}
                label="Start Date"
                value={formatDate(
                  event.event_date
                )}
              />

              <EventInfo
                icon={<CalendarDays size={17} />}
                label="End Date"
                value={
                  event.event_end_date
                    ? formatDate(
                        event.event_end_date
                      )
                    : formatDate(
                        event.event_date
                      )
                }
              />

              <EventInfo
                icon={<Clock3 size={17} />}
                label="Duration"
                value={
                  event.duration || "—"
                }
              />

              <EventInfo
                icon={<Award size={17} />}
                label="Event Type"
                value={
                  event.event_type || "—"
                }
              />

              <EventInfo
                icon={<Award size={17} />}
                label="Certificates"
                value={String(
                  certificates.length
                )}
              />

              <EventInfo
                icon={<CircleCheck size={17} />}
                label="Valid"
                value={String(validCount)}
              />

              <EventInfo
                icon={<CircleX size={17} />}
                label="Revoked"
                value={String(revokedCount)}
              />
            </div>

            {event.description && (
              <div
                className="mt-7 rounded-2xl border p-5"
                style={{
                  backgroundColor:
                    "var(--admin-bg)",
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color:
                      "var(--admin-text-subtle)",
                  }}
                >
                  Description
                </p>

                <p
                  className="mt-3 text-sm leading-7"
                  style={{
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            className="mt-6 rounded-2xl border px-5 py-4 text-sm leading-6"
            style={{
              borderColor:
                "rgba(248,113,113,0.25)",
              backgroundColor:
                "rgba(248,113,113,0.08)",
              color:
                "var(--admin-danger)",
            }}
          >
            {error}
          </div>
        )}

        {/* Certificates */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color:
                    "var(--admin-primary-light)",
                }}
              >
                Event Certificates
              </p>

              <h2
                className="mt-2 text-2xl font-bold"
                style={{
                  color:
                    "var(--admin-text)",
                }}
              >
                Certificates
              </h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color:
                    "var(--admin-text-muted)",
                }}
              >
                All certificates issued for{" "}
                <span
                  style={{
                    color:
                      "var(--admin-text-secondary)",
                  }}
                >
                  {event.event_name}
                </span>
                .
              </p>
            </div>

            <Link
              href={`/certifier/certificates/create?event=${event.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
              style={{
                backgroundColor:
                  "var(--admin-primary)",
              }}
            >
              <Award size={17} />
              Add Certificate
            </Link>
          </div>

          {/* Certificate Toolbar */}
          <div
            className="mt-6 rounded-2xl border p-4"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              boxShadow:
                "var(--admin-shadow-sm)",
            }}
          >
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--admin-text-subtle)",
                  }}
                />

                <input
                  type="search"
                  value={certificateSearch}
                  onChange={(event) =>
                    setCertificateSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by certificate ID, recipient or event..."
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
                  style={{
                    backgroundColor:
                      "var(--admin-bg)",
                    borderColor:
                      "var(--admin-border)",
                    color:
                      "var(--admin-text)",
                  }}
                />
              </div>

              <div className="relative xl:w-52">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--admin-text-subtle)",
                  }}
                />

                <select
                  value={
                    certificateStatusFilter
                  }
                  onChange={(event) =>
                    setCertificateStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor:
                      "var(--admin-bg)",
                    borderColor:
                      "var(--admin-border)",
                    color:
                      "var(--admin-text)",
                  }}
                >
                  <option value="ALL">
                    All Status
                  </option>
                  <option value="VALID">
                    Valid
                  </option>
                  <option value="REVOKED">
                    Revoked
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--admin-text-subtle)",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition disabled:opacity-50"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                  backgroundColor:
                    "transparent",
                }}
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Desktop Certificate Table */}
          {!loading &&
            filteredCertificates.length > 0 && (
              <div
                className="mt-6 hidden overflow-hidden rounded-3xl border lg:block"
                style={{
                  backgroundColor:
                    "var(--admin-surface)",
                  borderColor:
                    "var(--admin-border)",
                  boxShadow:
                    "var(--admin-shadow-sm)",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b text-left"
                      style={{
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      <SortableHeader
                        label="Certificate ID"
                        active={
                          certificateSortKey ===
                          "certificate_id"
                        }
                        direction={
                          certificateSortDirection
                        }
                        onClick={() =>
                          toggleCertificateSort(
                            "certificate_id"
                          )
                        }
                      />

                      <SortableHeader
                        label="Recipient Name"
                        active={
                          certificateSortKey ===
                          "recipient_name"
                        }
                        direction={
                          certificateSortDirection
                        }
                        onClick={() =>
                          toggleCertificateSort(
                            "recipient_name"
                          )
                        }
                      />

                      <SortableHeader
                        label="Event"
                        active={
                          certificateSortKey ===
                          "program_name"
                        }
                        direction={
                          certificateSortDirection
                        }
                        onClick={() =>
                          toggleCertificateSort(
                            "program_name"
                          )
                        }
                      />

                      <SortableHeader
                        label="Issue Date"
                        active={
                          certificateSortKey ===
                          "issue_date"
                        }
                        direction={
                          certificateSortDirection
                        }
                        onClick={() =>
                          toggleCertificateSort(
                            "issue_date"
                          )
                        }
                      />

                      <SortableHeader
                        label="Status"
                        active={
                          certificateSortKey ===
                          "status"
                        }
                        direction={
                          certificateSortDirection
                        }
                        onClick={() =>
                          toggleCertificateSort(
                            "status"
                          )
                        }
                      />

                      <th
                        className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCertificates.map(
                      (certificate) => (
                        <tr
                          key={certificate.id}
                          className="border-b last:border-0"
                          style={{
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <td className="px-6 py-5">
                            <p
                              className="font-mono text-sm font-semibold"
                              style={{
                                color:
                                  "var(--admin-primary-light)",
                              }}
                            >
                              {
                                certificate.certificate_id
                              }
                            </p>

                            {certificate.score_applicable && (
                              <p
                                className="mt-1 text-xs"
                                style={{
                                  color:
                                    "var(--admin-text-subtle)",
                                }}
                              >
                                Scored Certificate
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  "var(--admin-text)",
                              }}
                            >
                              {
                                certificate.recipient_name
                              }
                            </p>

                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  "var(--admin-text-muted)",
                              }}
                            >
                              {
                                certificate.certificate_type
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="max-w-xs truncate text-sm"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {event.event_name}
                            </p>

                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  "var(--admin-text-subtle)",
                              }}
                            >
                              {
                                certificate.program_name
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="text-sm"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {formatDate(
                                certificate.issue_date
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                certificate.status
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <IconButton
                                href={`/certifier/certificates/${certificate.id}`}
                                label="View certificate"
                                icon={
                                  <Eye size={16} />
                                }
                              />

                              <IconButton
                                href={`/certifier/certificates/${certificate.id}/edit`}
                                label="Edit certificate"
                                icon={
                                  <Pencil size={16} />
                                }
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteCertificateTarget(
                                    certificate
                                  )
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-red-400/[0.06]"
                                style={{
                                  borderColor:
                                    "var(--admin-border)",
                                  color:
                                    "var(--admin-danger)",
                                }}
                                title="Delete certificate"
                                aria-label="Delete certificate"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Mobile Certificates */}
          {!loading &&
            filteredCertificates.length > 0 && (
              <div className="mt-6 space-y-3 lg:hidden">
                {filteredCertificates.map(
                  (certificate) => (
                    <div
                      key={certificate.id}
                      className="rounded-2xl border p-5"
                      style={{
                        backgroundColor:
                          "var(--admin-surface)",
                        borderColor:
                          "var(--admin-border)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p
                            className="font-mono text-sm font-semibold"
                            style={{
                              color:
                                "var(--admin-primary-light)",
                            }}
                          >
                            {
                              certificate.certificate_id
                            }
                          </p>

                          <p
                            className="mt-2 text-base font-bold"
                            style={{
                              color:
                                "var(--admin-text)",
                            }}
                          >
                            {
                              certificate.recipient_name
                            }
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            certificate.status
                          }
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <InfoItem
                          label="Event"
                          value={event.event_name}
                        />

                        <InfoItem
                          label="Issue Date"
                          value={formatDate(
                            certificate.issue_date
                          )}
                        />

                        <InfoItem
                          label="Type"
                          value={
                            certificate.certificate_type
                          }
                        />

                        <InfoItem
                          label="Program"
                          value={
                            certificate.program_name
                          }
                        />
                      </div>

                      <div
                        className="mt-5 flex items-center justify-end gap-2 border-t pt-4"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                        }}
                      >
                        <IconButton
                          href={`/certifier/certificates/${certificate.id}`}
                          label="View certificate"
                          icon={
                            <Eye size={16} />
                          }
                        />

                        <IconButton
                          href={`/certifier/certificates/${certificate.id}/edit`}
                          label="Edit certificate"
                          icon={
                            <Pencil size={16} />
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteCertificateTarget(
                              certificate
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                          style={{
                            borderColor:
                              "var(--admin-border)",
                            color:
                              "var(--admin-danger)",
                          }}
                          aria-label="Delete certificate"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          {/* Empty */}
          {!loading &&
            filteredCertificates.length === 0 && (
              <div
                className="mt-6 rounded-3xl border px-6 py-14 text-center"
                style={{
                  backgroundColor:
                    "var(--admin-surface)",
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-primary) 14%, transparent)",
                    color:
                      "var(--admin-primary-light)",
                  }}
                >
                  <Award size={25} />
                </div>

                <h3
                  className="mt-5 text-lg font-bold"
                  style={{
                    color:
                      "var(--admin-text)",
                  }}
                >
                  {certificates.length === 0
                    ? "No certificates yet"
                    : "No certificates found"}
                </h3>

                <p
                  className="mx-auto mt-2 max-w-md text-sm leading-6"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                >
                  {certificates.length === 0
                    ? "No certificates have been issued for this event yet."
                    : "Try changing your certificate search or status filter."}
                </p>

                {certificates.length === 0 && (
                  <Link
                    href={`/certifier/certificates/create?event=${event.id}`}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white"
                    style={{
                      backgroundColor:
                        "var(--admin-primary)",
                    }}
                  >
                    <Award size={17} />
                    Add Certificate
                  </Link>
                )}
              </div>
            )}
        </section>
      </div>

      {/* Delete Certificate Modal */}
      {deleteCertificateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
                color:
                  "var(--admin-danger)",
              }}
            >
              <Trash2 size={19} />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Delete Certificate?
            </h2>

            <p
              className="mt-2 text-sm leading-6"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Are you sure you want to delete certificate{" "}
              <strong
                style={{
                  color:
                    "var(--admin-primary-light)",
                }}
              >
                {
                  deleteCertificateTarget.certificate_id
                }
              </strong>{" "}
              issued to{" "}
              <strong
                style={{
                  color:
                    "var(--admin-text)",
                }}
              >
                {
                  deleteCertificateTarget.recipient_name
                }
              </strong>
              ?
            </p>

            <p
              className="mt-3 text-xs leading-5"
              style={{
                color:
                  "var(--admin-text-subtle)",
              }}
            >
              This action permanently removes the certificate
              record and cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteCertificateTarget(null)
                }
                className="h-11 rounded-xl border px-5 text-sm font-medium"
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
                disabled={deletingCertificate}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                style={{
                  backgroundColor:
                    "var(--admin-danger)",
                }}
              >
                {deletingCertificate ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {deleteEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{
              backgroundColor:
                "var(--admin-surface)",
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
                color:
                  "var(--admin-danger)",
              }}
            >
              <Trash2 size={19} />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Delete Event?
            </h2>

            <p
              className="mt-2 text-sm leading-6"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Are you sure you want to delete{" "}
              <strong
                style={{
                  color:
                    "var(--admin-text)",
                }}
              >
                {event.event_name}
              </strong>
              ?
            </p>

            {certificates.length > 0 ? (
              <div
                className="mt-4 rounded-xl border px-4 py-3 text-sm leading-6"
                style={{
                  borderColor:
                    "rgba(248,113,113,0.2)",
                  backgroundColor:
                    "rgba(248,113,113,0.06)",
                  color:
                    "var(--admin-danger)",
                }}
              >
                This event has{" "}
                <strong>
                  {certificates.length}
                </strong>{" "}
                linked certificate
                {certificates.length === 1
                  ? ""
                  : "s"}
                . The event cannot be deleted while
                certificates are linked to it.
              </div>
            ) : (
              <p
                className="mt-3 text-xs leading-5"
                style={{
                  color:
                    "var(--admin-text-subtle)",
                }}
              >
                This event has no linked certificates
                and can be deleted.
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteEventOpen(false)
                }
                className="h-11 rounded-xl border px-5 text-sm font-medium"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </button>

              {certificates.length === 0 && (
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={deletingEvent}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "var(--admin-danger)",
                  }}
                >
                  {deletingEvent ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Delete Event
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EventInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
          color:
            "var(--admin-primary-light)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{
            color:
              "var(--admin-text-subtle)",
          }}
        >
          {label}
        </p>

        <p
          className="mt-1 break-words text-sm font-medium"
          style={{
            color:
              "var(--admin-text-secondary)",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <th className="px-6 py-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
        style={{
          color: active
            ? "var(--admin-primary-light)"
            : "var(--admin-text-muted)",
        }}
      >
        {label}

        {active && (
          <span>
            {direction === "asc"
              ? "↑"
              : "↓"}
          </span>
        )}
      </button>
    </th>
  );
}

function IconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-black/5 dark:hover:bg-white/[0.05]"
      style={{
        borderColor:
          "var(--admin-border)",
        color:
          "var(--admin-text-secondary)",
      }}
      title={label}
      aria-label={label}
    >
      {icon}
    </Link>
  );
}

function StatusBadge({
  status,
}: {
  status: CertificateStatus;
}) {
  const valid = status === "VALID";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: valid
          ? "color-mix(in srgb, var(--admin-success) 12%, transparent)"
          : "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
        color: valid
          ? "var(--admin-success)"
          : "var(--admin-danger)",
      }}
    >
      {valid ? (
        <CircleCheck size={13} />
      ) : (
        <CircleX size={13} />
      )}

      {valid ? "Valid" : "Revoked"}
    </span>
  );
}

function EventStatusBadge({
  status,
}: {
  status: EventStatus;
}) {
  const styles =
    status === "ACTIVE"
      ? {
          background:
            "color-mix(in srgb, var(--admin-success) 12%, transparent)",
          color:
            "var(--admin-success)",
        }
      : status === "COMPLETED"
        ? {
            background:
              "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
            color:
              "var(--admin-primary-light)",
          }
        : {
            background:
              "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
            color:
              "var(--admin-danger)",
          };

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        backgroundColor:
          styles.background,
        color: styles.color,
      }}
    >
      {status}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-wider"
        style={{
          color:
            "var(--admin-text-subtle)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-sm"
        style={{
          color:
            "var(--admin-text-secondary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string | null) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}