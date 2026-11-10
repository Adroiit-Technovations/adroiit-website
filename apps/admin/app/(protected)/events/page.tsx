"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Building2,
  Clock3,
  Award,
  Zap,
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

type EventWithCount = Event & {
  certificate_count: number;
};

type SortKey =
  | "latest"
  | "event_name"
  | "duration"
  | "certificate_count";

type SortDirection = "asc" | "desc";

const supabase = createClient();

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");
  const [deleteTarget, setDeleteTarget] =
    useState<EventWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadEvents(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const [
        { data: eventData, error: eventError },
        { data: certificateData, error: certificateError },
      ] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("event_date", {
            ascending: false,
          }),
        supabase
          .from("certificates")
          .select("id, event_id"),
      ]);

      if (eventError) {
        throw new Error(eventError.message);
      }

      if (certificateError) {
        throw new Error(certificateError.message);
      }

      const eventRows =
        (eventData || []) as Event[];

      const certificates =
        certificateData || [];

      const certificateCounts =
        new Map<string, number>();

      for (const certificate of certificates) {
        if (!certificate.event_id) continue;

        certificateCounts.set(
          certificate.event_id,
          (certificateCounts.get(
            certificate.event_id
          ) || 0) + 1
        );
      }

      const eventsWithCounts: EventWithCount[] =
        eventRows.map((event) => ({
          ...event,
          certificate_count:
            certificateCounts.get(event.id) || 0,
        }));

      setEvents(eventsWithCounts);
    } catch (err) {
      console.error(
        "Event loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load event data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = events.filter((event) => {
      if (!query) return true;

      return (
        event.event_name
          .toLowerCase()
          .includes(query) ||
        (event.organization || "")
          .toLowerCase()
          .includes(query) ||
        event.event_type
          .toLowerCase()
          .includes(query) ||
        (event.duration || "")
          .toLowerCase()
          .includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "latest":
          comparison =
            new Date(a.event_date).getTime() -
            new Date(b.event_date).getTime();
          break;

        case "event_name":
          comparison = a.event_name.localeCompare(
            b.event_name,
            undefined,
            {
              sensitivity: "base",
            }
          );
          break;

        case "duration":
          comparison =
            getDurationValue(a.duration) -
            getDurationValue(b.duration);

          if (comparison === 0) {
            comparison =
              (a.duration || "").localeCompare(
                b.duration || ""
              );
          }
          break;

        case "certificate_count":
          comparison =
            a.certificate_count -
            b.certificate_count;
          break;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    events,
    search,
    sortKey,
    sortDirection,
  ]);

  const totalEvents = events.length;

  function handleSortChange(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(key);

    if (
      key === "latest" ||
      key === "certificate_count"
    ) {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  }

  async function handleDeleteEvent() {
    if (!deleteTarget) return;

    if (deleteTarget.certificate_count > 0) {
      setError(
        `Cannot delete "${deleteTarget.event_name}" because it has ${deleteTarget.certificate_count} linked certificate${
          deleteTarget.certificate_count === 1
            ? ""
            : "s"
        }.`
      );

      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const { error: deleteError } =
        await supabase
          .from("events")
          .delete()
          .eq("id", deleteTarget.id);

      if (deleteError) {
        throw new Error(
          deleteError.message
        );
      }

      setEvents((current) =>
        current.filter(
          (event) =>
            event.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
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
      setDeleting(false);
    }
  }

  return (
    <main
      className="min-h-screen px-5 py-8 sm:px-8 sm:py-1 lg:px-10"
      style={{
        backgroundColor:
          "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-18 w-full max-w-[1350px]">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/certifier"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:opacity-90"
            style={{
              borderColor:
                "var(--admin-border)",
              color:
                "var(--admin-text-secondary)",
              backgroundColor:
                "var(--admin-surface)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Certifier Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mt-6">
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em]"
            style={{
              color:
                "var(--admin-primary-light)",
            }}
          >
            Event Management
          </p>

          <h1
            className="mt-2 text-3xl font-bold tracking-tight sm:text-3xl"
            style={{
              color: "var(--admin-text)",
            }}
          >
            Events
          </h1>

          <p
            className="mt-3 max-w-2xl text-sm leading-6"
            style={{
              color:
                "var(--admin-text-muted)",
            }}
          >
            Manage events and view certificates
            issued under each event.
          </p>
        </div>

        {/* Search / Sort / Refresh */}
        <section className="mt-5">
          <div
            className="rounded-2xl border p-4"
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
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by event name, host, event type or duration..."
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

              {/* Sort Direction */}
              <button
                type="button"
                onClick={() =>
                  setSortDirection(
                    (current) =>
                      current === "asc"
                        ? "desc"
                        : "asc"
                  )
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:opacity-90 xl:w-auto"
                style={{
                  borderColor:
                    "var(--admin-border)",
                  color:
                    "var(--admin-text-secondary)",
                  backgroundColor:
                    "var(--admin-bg)",
                }}
                title={`Sort ${
                  sortDirection === "asc"
                    ? "descending"
                    : "ascending"
                }`}
              >
                <span className="text-base leading-none">
                  {sortDirection === "asc"
                    ? "↑"
                    : "↓"}
                </span>

                {sortDirection === "asc"
                  ? "Ascending"
                  : "Descending"}
              </button>

              <div className="relative xl:w-60">
                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--admin-text-subtle)",
                  }}
                />

                <select
                  value={sortKey}
                  onChange={(event) =>
                    handleSortChange(
                      event.target
                        .value as SortKey
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
                  <option value="latest">
                    Date
                  </option>

                  <option value="event_name">
                    Event Name
                  </option>

                  <option value="duration">
                    Duration
                  </option>

                  <option value="certificate_count">
                    No. of Certificates
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
                onClick={() =>
                  loadEvents(true)
                }
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
        </section>

        {/* Events Table */}
        {!loading &&
          filteredEvents.length > 0 && (
            <section
              className="mt-6 overflow-hidden rounded-3xl border"
              style={{
                backgroundColor:
                  "var(--admin-surface)",
                borderColor:
                  "var(--admin-border)",
                boxShadow:
                  "var(--admin-shadow-sm)",
              }}
            >
              {/* Table Header */}
              <div
                className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  borderColor:
                    "var(--admin-border)",
                }}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2
                      className="text-lg font-bold"
                      style={{
                        color:
                          "var(--admin-text)",
                      }}
                    >
                      Events
                    </h2>

                    <span
                      className="text-sm"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      Total Events:{" "}
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        {totalEvents}
                      </span>
                    </span>
                  </div>
                </div>

                <Link
                  href="/events/create"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor:
                      "var(--admin-primary)",
                  }}
                >
                  <Plus size={17} />
                  Add Event
                </Link>
              </div>

              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
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
                        label="Event Name"
                        icon={
                          <CalendarDays
                            size={15}
                          />
                        }
                        active={
                          sortKey ===
                          "event_name"
                        }
                        direction={
                          sortDirection
                        }
                        onClick={() =>
                          handleSortChange(
                            "event_name"
                          )
                        }
                      />

                      <SortableHeader
                        label="Host"
                        icon={
                          <Building2
                            size={15}
                          />
                        }
                        active={false}
                        direction={
                          sortDirection
                        }
                        onClick={() => {}}
                      />

                      <SortableHeader
                        label="Dates"
                        icon={
                          <CalendarDays
                            size={15}
                          />
                        }
                        active={
                          sortKey ===
                          "latest"
                        }
                        direction={
                          sortDirection
                        }
                        onClick={() =>
                          handleSortChange(
                            "latest"
                          )
                        }
                      />

                      <SortableHeader
                        label="Duration"
                        icon={
                          <Clock3 size={15} />
                        }
                        active={
                          sortKey ===
                          "duration"
                        }
                        direction={
                          sortDirection
                        }
                        onClick={() =>
                          handleSortChange(
                            "duration"
                          )
                        }
                      />

                      <SortableHeader
                        label="Certificates"
                        icon={
                          <Award size={15} />
                        }
                        active={
                          sortKey ===
                          "certificate_count"
                        }
                        direction={
                          sortDirection
                        }
                        onClick={() =>
                          handleSortChange(
                            "certificate_count"
                          )
                        }
                      />

                      <SortableHeader
                        label="Actions"
                        icon={
                          <Zap size={15} />
                        }
                        active={false}
                        direction={
                          sortDirection
                        }
                        onClick={() => {}}
                        align="right"
                      />
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
                                className="text-sm font-semibold transition"
                                style={{
                                  color:
                                    "var(--admin-text)",
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
                                {event.event_type}
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
                              {
                                event.certificate_count
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <IconButton
                                href={`/events/${event.id}`}
                                label="View event"
                                icon={
                                  <Eye
                                    size={16}
                                  />
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
                                  setDeleteTarget(
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

              {/* Mobile Cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {filteredEvents.map(
                  (event) => (
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
                      <div>
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

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          {event.event_type}
                        </p>
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
                          label="Dates"
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
                            setDeleteTarget(
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
                  )
                )}
              </div>
            </section>
          )}

        {/* Empty State */}
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
              }
            />
          )}

        {/* Loading */}
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
              Loading events...
            </p>
          </div>
        )}

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
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
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
                {deleteTarget.event_name}
              </strong>
              ?
            </p>

            {deleteTarget.certificate_count >
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
                    deleteTarget.certificate_count
                  }{" "}
                  linked certificate
                  {deleteTarget.certificate_count ===
                  1
                    ? ""
                    : "s"}
                  . It cannot be deleted until
                  those certificates are handled.
                </div>
              )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
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

              {deleteTarget.certificate_count ===
                0 && (
                <button
                  type="button"
                  onClick={
                    handleDeleteEvent
                  }
                  disabled={deleting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "var(--admin-danger)",
                  }}
                >
                  {deleting ? (
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

function SortableHeader({
  label,
  icon,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
          align === "right"
            ? "justify-end"
            : ""
        }`}
        style={{
          color: active
            ? "var(--admin-primary-light)"
            : "var(--admin-text-muted)",
        }}
      >
        {icon}
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

function getDurationValue(
  duration: string | null
) {
  if (!duration) return 0;

  const normalized = duration
    .trim()
    .toLowerCase();

  const numberMatch =
    normalized.match(
      /(\d+(?:\.\d+)?)/
    );

  if (!numberMatch) return 0;

  const value = Number(
    numberMatch[1]
  );

  if (
    normalized.includes("week")
  ) {
    return value * 7;
  }

  if (
    normalized.includes("month")
  ) {
    return value * 30;
  }

  if (
    normalized.includes("year")
  ) {
    return value * 365;
  }

  if (
    normalized.includes("hour") ||
    normalized.includes("hr")
  ) {
    return value / 24;
  }

  if (
    normalized.includes("minute") ||
    normalized.includes("min")
  ) {
    return value / 1440;
  }

  return value;
}

function formatDate(
  date: string | null
) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
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

