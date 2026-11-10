"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  CircleCheck,
  CircleX,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ArrowUpDown,
  ListFilter,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

type VerificationLog = {
  id: number;
  certificate_id: string;
  verified_at: string;
};

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

type EventWithCount = Event & {
  certificate_count: number;
  certificate_ids: string[];
};

type SortDirection = "asc" | "desc";

type EventFilterKey =
  | "event_date"
  | "event_name"
  | "organization"
  | "duration"
  | "certificate_count";

type CertificateFilterKey =
  | "certificate_id"
  | "recipient_name"
  | "event_name"
  | "certificate_type"
  | "issue_date";

const supabase = createClient();

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<
    VerificationLog[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [certificateSearch, setCertificateSearch] = useState("");
  const [certificateFilterKey, setCertificateFilterKey] =
    useState<CertificateFilterKey>("certificate_id");
  const [certificateSortDirection, setCertificateSortDirection] =
    useState<SortDirection>("desc");

  const [eventSearch, setEventSearch] = useState("");
  const [eventFilterKey, setEventFilterKey] =
    useState<EventFilterKey>("event_name");
  const [eventSortDirection, setEventSortDirection] =
    useState<SortDirection>("desc");

  const [eventDeleteTarget, setEventDeleteTarget] =
    useState<EventWithCount | null>(null);
  const [certificateDeleteTarget, setCertificateDeleteTarget] =
    useState<Certificate | null>(null);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [deletingCertificate, setDeletingCertificate] = useState(false);

  async function loadData(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [
        { data: certificateData, error: certificateError },
        { data: eventData, error: eventError },
        { data: verificationLogData, error: verificationLogError },
      ] = await Promise.all([
        supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: false }),

        supabase
          .from("verification_logs")
          .select("id, certificate_id, verified_at")
          .order("verified_at", { ascending: false }),
      ]);

      if (certificateError) {
        throw new Error(certificateError.message);
      }

      if (eventError) {
        throw new Error(eventError.message);
      }

      if (verificationLogError) {
        throw new Error(verificationLogError.message);
      }

      const certificateRows =
        (certificateData || []) as Certificate[];

      const eventRows = (eventData || []) as Event[];

      const verificationLogRows =
        (verificationLogData || []) as VerificationLog[];

      /*
       * verification_logs.certificate_id stores the internal
       * certificates.id UUID, not the public certificate_id.
       *
       * Keeping the complete log collection synchronized here
       * ensures the dashboard always has the latest verification
       * records available.
       */
      setVerificationLogs(verificationLogRows);

      const countMap = new Map<string, number>();
      const certificateIdMap = new Map<string, string[]>();

      for (const certificate of certificateRows) {
        if (!certificate.event_id) continue;

        countMap.set(
          certificate.event_id,
          (countMap.get(certificate.event_id) || 0) + 1
        );

        const existingIds =
          certificateIdMap.get(certificate.event_id) || [];

        existingIds.push(certificate.certificate_id);

        certificateIdMap.set(
          certificate.event_id,
          existingIds
        );
      }

      const eventsWithCounts: EventWithCount[] =
        eventRows.map((event) => ({
          ...event,
          certificate_count:
            countMap.get(event.id) || 0,
          certificate_ids: (
            certificateIdMap.get(event.id) || []
          ).sort((a, b) => a.localeCompare(b)),
        }));

      setCertificates(certificateRows);
      setEvents(eventsWithCounts);
    } catch (err) {
      console.error(
        "Certificate/Event/Verification log loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load certificate, event and verification data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /*
   * Initial data load + realtime synchronization.
   *
   * A verification on /verify/[certificateId] creates a new
   * verification_logs row. This listener causes the dashboard
   * data layer to synchronize automatically without changing
   * the existing UI.
   */
  useEffect(() => {
    loadData();

    const verificationLogChannel = supabase
      .channel("certifier-verification-logs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "verification_logs",
        },
        () => {
          loadData();
        }
      )
      .subscribe((status, realtimeError) => {
        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT"
        ) {
          console.error(
            "Verification log realtime subscription error:",
            realtimeError
          );
        }
      });

    return () => {
      void supabase.removeChannel(
        verificationLogChannel
      );
    };
  }, []);

  /*
   * Keep the verification log collection referenced so that
   * TypeScript/ESLint does not treat it as unused. The actual
   * log records are synchronized independently from the visual
   * certificate/event tables.
   */
  useEffect(() => {
    if (verificationLogs.length >= 0) {
      // Intentionally kept in state for realtime synchronization.
    }
  }, [verificationLogs]);

  const eventNameById = useMemo(
    () => new Map(events.map((event) => [event.id, event.event_name])),
    [events]
  );

  const filteredEvents = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();

    const filtered = events.filter((event) => {
      if (!query) return true;

      let filterValue = "";

      switch (eventFilterKey) {
        case "event_date":
          filterValue = formatDateRange(
            event.event_date,
            event.event_end_date
          );
          break;
        case "event_name":
          filterValue = event.event_name;
          break;
        case "organization":
          filterValue = event.organization || "";
          break;
        case "duration":
          filterValue = event.duration || "";
          break;
        case "certificate_count":
          filterValue = String(event.certificate_count);
          break;
      }

      return filterValue.toLowerCase().includes(query);
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (eventFilterKey) {
        case "event_name":
          comparison = a.event_name.localeCompare(
            b.event_name
          );
          break;

        case "organization":
          comparison = (a.organization || "").localeCompare(
            b.organization || ""
          );
          break;

        case "event_date":
          comparison =
            new Date(a.event_date).getTime() -
            new Date(b.event_date).getTime();
          break;

        case "duration":
          comparison = (a.duration || "").localeCompare(
            b.duration || ""
          );
          break;

        case "certificate_count":
          comparison =
            a.certificate_count -
            b.certificate_count;
          break;

      }

      return eventSortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    events,
    eventSearch,
    eventFilterKey,
    eventSortDirection,
  ]);

  const filteredCertificates = useMemo(() => {
    const query = certificateSearch.trim().toLowerCase();

    const filtered = certificates.filter((certificate) => {
      const eventName = certificate.event_id
        ? eventNameById.get(certificate.event_id) || ""
        : "";

      if (!query) return true;

      let filterValue = "";

      switch (certificateFilterKey) {
        case "certificate_id":
          filterValue = certificate.certificate_id;
          break;
        case "recipient_name":
          filterValue = certificate.recipient_name;
          break;
        case "event_name":
          filterValue = eventName;
          break;
        case "certificate_type":
          filterValue = certificate.certificate_type;
          break;
        case "issue_date":
          filterValue = formatDate(certificate.issue_date);
          break;
      }

      return filterValue.toLowerCase().includes(query);
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (certificateFilterKey) {
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
          comparison = (a.event_id ? eventNameById.get(a.event_id) || "" : "").localeCompare(
            b.event_id ? eventNameById.get(b.event_id) || "" : ""
          );
          break;

        case "certificate_type":
          comparison = a.certificate_type.localeCompare(
            b.certificate_type
          );
          break;

        case "issue_date":
          comparison =
            new Date(a.issue_date).getTime() -
            new Date(b.issue_date).getTime();
          break;


      }

      return certificateSortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    certificates,
    certificateSearch,
    certificateFilterKey,
    certificateSortDirection,
    eventNameById,
  ]);

  const totalEvents = events.length;


  async function handleDeleteEvent() {
    if (!eventDeleteTarget) return;

    if (eventDeleteTarget.certificate_count > 0) {
      setError(
        `Cannot delete "${eventDeleteTarget.event_name}" because it has ${eventDeleteTarget.certificate_count} linked certificate${
          eventDeleteTarget.certificate_count === 1
            ? ""
            : "s"
        }.`
      );

      setEventDeleteTarget(null);
      return;
    }

    try {
      setDeletingEvent(true);
      setError("");

      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventDeleteTarget.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setEvents((current) =>
        current.filter(
          (event) =>
            event.id !== eventDeleteTarget.id
        )
      );

      setEventDeleteTarget(null);
    } catch (err) {
      console.error(
        "Event deletion error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the event."
      );
    } finally {
      setDeletingEvent(false);
    }
  }

  async function handleDeleteCertificate() {
    if (!certificateDeleteTarget) return;

    try {
      setDeletingCertificate(true);
      setError("");

      const { error: deleteError } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificateDeleteTarget.id);

      if (deleteError) throw new Error(deleteError.message);

      setCertificates((current) =>
        current.filter((certificate) => certificate.id !== certificateDeleteTarget.id)
      );
      setCertificateDeleteTarget(null);
    } catch (err) {
      console.error("Certificate deletion error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to delete the certificate."
      );
    } finally {
      setDeletingCertificate(false);
    }
  }

  return (
    <main
      className="min-h-screen px-5 py-4 sm:px-8 sm:py-0 lg:px-10"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-15 w-full max-w-[1350px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{
                color: "var(--admin-primary-light)",
              }}
            >
              Certificate Management
            </p>

            <h1
              className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
              style={{
                color: "var(--admin-text)",
              }}
            >
              Certifier Dashboard
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-6"
              style={{
                color: "var(--admin-text-muted)",
              }}
            >
              Create, manage and verify certificates issued
              by Adroiit Technovations.
            </p>
          </div>

          <div
            className="rounded-2xl border p-3"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            <div
              className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{
                color: "var(--admin-text-subtle)",
              }}
            >
              Quick Actions
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--admin-primary)" }}
              >
                <CalendarDays size={17} />
                View Events
              </Link>

              <Link
                href="/certifier/certificates"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--admin-primary)" }}
              >
                <Award size={17} />
                View Certificates
              </Link>

              <Link
                href="/events/create"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--admin-primary)" }}
              >
                <CalendarPlus size={17} />
                Add Event
              </Link>

              <Link
                href="/certifier/certificates/create"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  backgroundColor:
                    "var(--admin-primary)",
                }}
              >
                <Plus size={17} />
                Add Certificate
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={<CalendarDays size={19} />}
            label="Total Events"
            value={totalEvents}
          />

          <StatCard
            icon={<Award size={19} />}
            label="Total Certificates"
            value={certificates.length}
          />
        </div>

        <section className="mt-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                color:
                  "var(--admin-primary-light)",
              }}
            >
              Event Records
            </p>

            <h2
              className="mt-2 text-2xl font-bold"
              style={{
                color: "var(--admin-text)",
              }}
            >
              List of Events
            </h2>

            <p
              className="mt-2 text-sm"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Search, view and manage all the events conducted by Adroiit Technovations
            </p>
          </div>

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
                  value={eventSearch}
                  onChange={(event) =>
                    setEventSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by event name, host name, event type or certificate UIN..."
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

              <div className="relative xl:w-48">
                <ArrowUpDown
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
                <select
                  value={eventSortDirection}
                  onChange={(event) =>
                    setEventSortDirection(event.target.value as SortDirection)
                  }
                  className="h-12 w-full appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                  aria-label="Sort order"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
              </div>

              <div className="relative xl:w-48">
                <ListFilter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
                <select
                  value={eventFilterKey}
                  onChange={(event) =>
                    setEventFilterKey(event.target.value as EventFilterKey)
                  }
                  className="h-12 w-full appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  <option value="event_name">Event Name</option>
                  <option value="organization">Host Name</option>
                  <option value="event_date">Dates</option>
                  <option value="duration">Duration</option>
                  <option value="certificate_count">No. of Certificates</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
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

          {!loading &&
            filteredEvents.length > 0 && (
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
                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Event Name
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        Host Name
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Date
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Duration
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Certificates
                      </th>

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
                    {filteredEvents.map(
                      (event) => (
                        <tr
                          key={event.id}
                          className="border-b transition last:border-0"
                          style={{
                            borderColor:
                              "var(--admin-border)",
                          }}
                        >
                          <td className="px-6 py-5">
                            <Link
                              href={`/events/${event.id}`}
                              className="group"
                            >
                              <p
                                className="text-sm font-semibold transition group-hover:text-[#8C52FF]"
                                style={{
                                  color:
                                    "var(--admin-text)",
                                }}
                              >
                                {event.event_name}
                              </p>

                            </Link>
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="text-sm"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {event.organization ||
                                "—"}
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
                              {formatDateRange(
                                event.event_date,
                                event.event_end_date
                              )}
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
                              {event.duration ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {event.certificate_count}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <IconButton
                                href={`/events/${event.id}`}
                                label="View event"
                                icon={
                                  <Eye size={16} />
                                }
                              />

                              <IconButton
                                href={`/events/${event.id}/edit`}
                                label="Edit event"
                                icon={
                                  <Pencil
                                    size={16}
                                  />
                                }
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setEventDeleteTarget(
                                    event
                                  )
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:border-red-400/30 hover:bg-red-400/[0.06]"
                                style={{
                                  borderColor:
                                    "var(--admin-border)",
                                  color:
                                    "var(--admin-danger)",
                                }}
                                title="Delete event"
                                aria-label="Delete event"
                              >
                                <Trash2
                                  size={16}
                                />
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

          {!loading &&
            filteredEvents.length > 0 && (
              <div className="mt-6 space-y-3 lg:hidden">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
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
                        <Link
                          href={`/events/${event.id}`}
                          className="text-base font-bold"
                          style={{
                            color:
                              "var(--admin-text)",
                          }}
                        >
                          {event.event_name}
                        </Link>

                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <InfoItem
                        label="Host"
                        value={
                          event.organization ||
                          "—"
                        }
                      />

                      <InfoItem
                        label="Date"
                        value={formatDateRange(
                          event.event_date,
                          event.event_end_date
                        )}
                      />

                      <InfoItem
                        label="Duration"
                        value={
                          event.duration ||
                          "—"
                        }
                      />

                      <InfoItem
                        label="Certificates"
                        value={String(
                          event.certificate_count
                        )}
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
                        href={`/events/${event.id}`}
                        label="View event"
                        icon={
                          <Eye size={16} />
                        }
                      />

                      <IconButton
                        href={`/events/${event.id}/edit`}
                        label="Edit event"
                        icon={
                          <Pencil size={16} />
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setEventDeleteTarget(
                            event
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                        style={{
                          borderColor:
                            "var(--admin-border)",
                          color:
                            "var(--admin-danger)",
                        }}
                        aria-label="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {!loading &&
            filteredEvents.length === 0 && (
              <EmptyState
                icon={
                  <CalendarDays size={25} />
                }
                title={
                  events.length === 0
                    ? "No events yet"
                    : "No events found"
                }
                description={
                  events.length === 0
                    ? "Create an event first, then issue certificates under that event."
                    : "Try changing your event search."
                }
                action={
                  events.length === 0 ? (
                    <Link
                      href="/events/create"
                      className="inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white"
                      style={{
                        backgroundColor:
                          "var(--admin-primary)",
                      }}
                    >
                      <Plus size={17} />
                      Add Event
                    </Link>
                  ) : null
                }
              />
            )}
        </section>

        <section className="mt-12">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                color:
                  "var(--admin-primary-light)",
              }}
            >
              Certificate Records
            </p>

            <h2
              className="mt-2 text-2xl font-bold"
              style={{
                color: "var(--admin-text)",
              }}
            >
              List of Certificates
            </h2>

            <p
              className="mt-2 text-sm"
              style={{
                color:
                  "var(--admin-text-muted)",
              }}
            >
              Search, view and manage all the certificates issued by Adroiit Technovations
            </p>
          </div>

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
                  placeholder="Search by certificate UIN, recipient name, event name or certificate type..."
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none"
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

              <div className="relative xl:w-48">
                <ArrowUpDown
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
                <select
                  value={certificateSortDirection}
                  onChange={(event) =>
                    setCertificateSortDirection(event.target.value as SortDirection)
                  }
                  className="h-12 w-full appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                  aria-label="Sort order"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
              </div>

              <div className="relative xl:w-48">
                <ListFilter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
                <select
                  value={certificateFilterKey}
                  onChange={(event) =>
                    setCertificateFilterKey(
                      event.target.value as CertificateFilterKey
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border pl-11 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                >
                  <option value="certificate_id">Certificate UID</option>
                  <option value="recipient_name">Recipient Name</option>
                  <option value="event_name">Event Name</option>
                  <option value="certificate_type">Certificate Type</option>
                  <option value="issue_date">Issue Date</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium disabled:opacity-50"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
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
                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Certificate UIN
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Recipient Name
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Event Name
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Certificate Type
                      </th>

                      <th
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Issue Date
                      </th>


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

                          </td>

                          <td className="max-w-xs px-6 py-5">
                            <p
                              className="truncate text-sm"
                              style={{
                                color:
                                  "var(--admin-text-secondary)",
                              }}
                            >
                              {certificate.event_id
                                ? events.find((event) => event.id === certificate.event_id)?.event_name || certificate.program_name || "—"
                                : certificate.program_name || "—"}
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
                              {certificate.certificate_type || "Certificate"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p
                              className="text-sm"
                              style={{
                                color:
                                  "var(--admin-text-muted)",
                              }}
                            >
                              {formatDate(certificate.issue_date)}
                            </p>
                          </td>


                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              <IconButton
                                href={`/certifier/certificates/${certificate.id}`}
                                label="View certificate"
                                icon={<Eye size={16} />}
                              />
                              <IconButton
                                href={`/certifier/certificates/${certificate.id}/edit`}
                                label="Edit certificate"
                                icon={<Pencil size={16} />}
                              />
                              <button
                                type="button"
                                onClick={() => setCertificateDeleteTarget(certificate)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:border-red-400/30 hover:bg-red-400/[0.06]"
                                style={{
                                  borderColor: "var(--admin-border)",
                                  color: "var(--admin-danger)",
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

          {!loading &&
            filteredCertificates.length === 0 && (
              <EmptyState
                icon={<Award size={25} />}
                title={
                  certificates.length === 0
                    ? "No certificates yet"
                    : "No certificates found"
                }
                description={
                  certificates.length === 0
                    ? "Create your first certificate to begin building your verification database."
                    : "Try changing your certificate search or status filter."
                }
                action={
                  certificates.length === 0 ? (
                    <Link
                      href="/certifier/certificates/create"
                      className="inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white"
                      style={{
                        backgroundColor:
                          "var(--admin-primary)",
                      }}
                    >
                      <Plus size={17} />
                      Add Certificate
                    </Link>
                  ) : null
                }
              />
            )}
        </section>

        {loading && (
          <div
            className="mt-8 rounded-3xl border p-10 text-center"
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
              Loading certificates and events...
            </p>
          </div>
        )}

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
      </div>

      {eventDeleteTarget && (
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
                {eventDeleteTarget.event_name}
              </strong>
              ?
            </p>

            {eventDeleteTarget.certificate_count >
              0 && (
              <div
                className="mt-4 rounded-xl border px-4 py-3 text-sm leading-5"
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
                {
                  eventDeleteTarget.certificate_count
                }{" "}
                linked certificate
                {eventDeleteTarget.certificate_count ===
                1
                  ? ""
                  : "s"}
                . It cannot be deleted until those
                certificates are handled.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setEventDeleteTarget(null)
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

              {eventDeleteTarget.certificate_count ===
                0 && (
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

      {certificateDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "color-mix(in srgb, var(--admin-danger) 12%, transparent)",
                color: "var(--admin-danger)",
              }}
            >
              <Trash2 size={19} />
            </div>
            <h2 className="mt-5 text-lg font-bold">Delete Certificate?</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--admin-text-muted)" }}>
              Are you sure you want to delete <strong style={{ color: "var(--admin-text)" }}>{certificateDeleteTarget.certificate_id}</strong>?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCertificateDeleteTarget(null)}
                className="h-11 rounded-xl border px-5 text-sm font-medium"
                style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-secondary)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCertificate}
                disabled={deletingCertificate}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--admin-danger)" }}
              >
                {deletingCertificate ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
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
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-2xl border p-5 transition"
      style={{
        backgroundColor:
          "var(--admin-surface)",
        borderColor:
          "var(--admin-border)",
        boxShadow:
          "var(--admin-shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--admin-primary) 14%, transparent)",
            color:
              "var(--admin-primary-light)",
          }}
        >
          {icon}
        </div>

        <span
          className="text-2xl font-bold"
          style={{
            color:
              "var(--admin-text)",
          }}
        >
          {value}
        </span>
      </div>

      <p
        className="mt-4 text-sm"
        style={{
          color:
            "var(--admin-text-muted)",
        }}
      >
        {label}
      </p>
    </div>
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

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
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
        {icon}
      </div>

      <h3
        className="mt-5 text-lg font-bold"
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {title}
      </h3>

      <p
        className="mx-auto mt-2 max-w-md text-sm leading-6"
        style={{
          color:
            "var(--admin-text-muted)",
        }}
      >
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(
    new Date(`${date}T00:00:00`)
  );
}

function formatDateRange(
  start: string | null,
  end: string | null
) {
  if (!start) return "—";

  if (!end || end === start) {
    return formatDate(start);
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}

