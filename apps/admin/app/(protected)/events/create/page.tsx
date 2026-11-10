"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EventType =
  | "Internship"
  | "Workshop"
  | "Bootcamp"
  | "Course"
  | "Participation"
  | "Appreciation"
  | "Employment";

const EVENT_TYPES: EventType[] = [
  "Internship",
  "Workshop",
  "Bootcamp",
  "Course",
  "Participation",
  "Appreciation",
  "Employment",
];

const supabase = createClient();

export default function CreateEventPage() {
  const router = useRouter();

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [organization, setOrganization] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [duration, setDuration] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEventName = eventName.trim();
    const cleanDescription = description.trim();
    const cleanEventType = eventType.trim();
    const cleanOrganization = organization.trim();
    const cleanDuration = duration.trim();

    if (!cleanEventName) {
      setError("Event name is required.");
      return;
    }

    if (!cleanDescription) {
      setError("Short description is required.");
      return;
    }

    if (!cleanEventType) {
      setError("Event type is required.");
      return;
    }

    if (!cleanOrganization) {
      setError("Host name is required.");
      return;
    }

    if (!eventDate) {
      setError("Start date is required.");
      return;
    }

    if (eventEndDate && eventEndDate < eventDate) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    if (!cleanDuration) {
      setError("Duration is required.");
      return;
    }

    try {
      setSaving(true);

      const { data, error: insertError } = await supabase
        .from("events")
        .insert({
          event_name: cleanEventName,
          event_date: eventDate,
          event_end_date: eventEndDate || null,
          event_type: cleanEventType,
          organization: cleanOrganization,
          duration: cleanDuration,
          description: cleanDescription,
          status: "ACTIVE",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error(
          "Error creating event:",
          insertError
        );

        setError(
          insertError.message ||
            "Unable to create the event. Please try again."
        );

        return;
      }

      if (!data?.id) {
        setError(
          "Event was created, but its ID could not be retrieved."
        );

        return;
      }

      router.push(
        `/events/${data.id}?created=true`
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Unexpected error creating event:",
        err
      );

      setError(
        "Something went wrong while creating the event."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      className="min-h-screen px-5 py-8 sm:px-8 sm:py-1 lg:px-10"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <div className="mx-auto -mt-18 w-full max-w-[1350px]">
        <Link
          href="/events"
          className="inline-flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            color: "var(--admin-text-secondary)",
          }}
        >
          <ArrowLeft
            size={16}
            strokeWidth={2}
            style={{
              color: "var(--admin-primary)",
            }}
          />
          Back to Events
        </Link>

        <div className="mt-5">
          <h1
            className="text-3xl font-bold tracking-tight sm:text-2xl"
            style={{
              color: "var(--admin-text)",
            }}
          >
            Create Event
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            Create an event that can be used to issue and
            manage certificates.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 overflow-hidden rounded-3xl border"
          style={{
            backgroundColor: "var(--admin-surface)",
            borderColor: "var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
          }}
        >
          <div
            className="border-b px-7 py-5 sm:px-8"
            style={{
              borderColor: "var(--admin-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--admin-primary) 12%, transparent)",
                  color: "var(--admin-primary)",
                }}
              >
                <FileText
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h2
                  className="text-base font-bold"
                  style={{
                    color: "var(--admin-text)",
                  }}
                >
                  Event Information
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Enter the basic information for this
                  event.
                </p>
              </div>
            </div>
          </div>

          <div className="px-7 py-7 sm:px-8 sm:py-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="event-name"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    color: "var(--admin-text)",
                  }}
                >
                  Event Name{" "}
                  <span
                    style={{
                      color: "var(--admin-danger)",
                    }}
                  >
                    *
                  </span>
                </label>

                <input
                  id="event-name"
                  type="text"
                  value={eventName}
                  onChange={(event) =>
                    setEventName(event.target.value)
                  }
                  placeholder="Enter event name"
                  className="h-[52px] w-full rounded-xl border px-4 text-[15px] outline-none transition placeholder:opacity-70 focus:border-[var(--admin-primary)]"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    color: "var(--admin-text)",
                  }}
                >
                  Short Description{" "}
                  <span
                    style={{
                      color: "var(--admin-danger)",
                    }}
                  >
                    *
                  </span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Enter a short description of the event"
                  rows={4}
                  className="w-full resize-y rounded-xl border px-4 py-3 text-[15px] leading-6 outline-none transition placeholder:opacity-70 focus:border-[var(--admin-primary)]"
                  style={{
                    backgroundColor: "var(--admin-bg)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="event-type"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    Event Type{" "}
                    <span
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(event) =>
                        setEventType(event.target.value)
                      }
                      className="h-[52px] w-full appearance-none rounded-xl border px-4 pr-11 text-[15px] outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    >
                      <option value="">
                        Select event type
                      </option>

                      {EVENT_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          "var(--admin-text-secondary)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    Host Name{" "}
                    <span
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      *
                    </span>
                  </label>

                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(event) =>
                      setOrganization(
                        event.target.value
                      )
                    }
                    placeholder="Enter host name"
                    className="h-[52px] w-full rounded-xl border px-4 text-[15px] outline-none transition placeholder:opacity-70 focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="event-date"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    Start Date{" "}
                    <span
                      style={{
                        color: "var(--admin-danger)",
                      }}
                    >
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />

                    <input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={(event) =>
                        setEventDate(event.target.value)
                      }
                      className="h-[52px] w-full rounded-xl border pl-11 pr-4 text-[15px] outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                        colorScheme: "light dark",
                        accentColor:
                          "var(--admin-primary)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="event-end-date"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      color: "var(--admin-text)",
                    }}
                  >
                    End Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />

                    <input
                      id="event-end-date"
                      type="date"
                      value={eventEndDate}
                      min={eventDate || undefined}
                      onChange={(event) =>
                        setEventEndDate(
                          event.target.value
                        )
                      }
                      className="h-[52px] w-full rounded-xl border pl-11 pr-4 text-[15px] outline-none transition focus:border-[var(--admin-primary)]"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                        colorScheme: "light dark",
                        accentColor:
                          "var(--admin-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2">
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    color: "var(--admin-text)",
                  }}
                >
                  Duration{" "}
                  <span
                    style={{
                      color: "var(--admin-danger)",
                    }}
                  >
                    *
                  </span>
                </label>

                <div className="relative">
                  <Clock3
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                    style={{
                      color:
                        "var(--admin-primary)",
                    }}
                  />

                  <input
                    id="duration"
                    type="text"
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    placeholder="e.g. 2 Days, 30 Hours"
                    className="h-[52px] w-full rounded-xl border pl-11 pr-4 text-[15px] outline-none transition placeholder:opacity-70 focus:border-[var(--admin-primary)]"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div
                className="mt-7 rounded-xl border px-4 py-3 text-sm leading-6"
                style={{
                  borderColor:
                    "rgba(248,113,113,0.25)",
                  backgroundColor:
                    "rgba(248,113,113,0.08)",
                  color: "var(--admin-danger)",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            className="flex flex-col-reverse gap-3 border-t px-7 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8"
            style={{
              borderColor: "var(--admin-border)",
            }}
          >
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition hover:opacity-90"
              style={{
                borderColor: "var(--admin-border)",
                color: "var(--admin-text-secondary)",
                backgroundColor: "var(--admin-surface)",
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "var(--admin-primary)",
              }}
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

