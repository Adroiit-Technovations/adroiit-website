"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Loader2,
  Save,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

type EventData = {
  id: string;
  event_name: string;
  event_date: string;
  event_end_date: string | null;
  event_type: string;
  organization: string | null;
  duration: string | null;
  description: string | null;
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const supabase = createClient();

  const [event, setEvent] = useState<EventData | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [organization, setOrganization] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!eventId) return;

    async function loadEvent() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("events")
        .select(`
          id,
          event_name,
          event_date,
          event_end_date,
          event_type,
          organization,
          duration,
          description
        `)
        .eq("id", eventId)
        .single();

      if (fetchError) {
        setError(
          fetchError.message || "Unable to load event."
        );
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Event not found.");
        setLoading(false);
        return;
      }

      const eventData = data as EventData;

      setEvent(eventData);
      setEventName(eventData.event_name || "");
      setEventDate(eventData.event_date || "");
      setEventEndDate(eventData.event_end_date || "");
      setEventType(eventData.event_type || "");
      setOrganization(eventData.organization || "");
      setDuration(eventData.duration || "");
      setDescription(eventData.description || "");

      setLoading(false);
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!eventId) {
      setError("Invalid event ID.");
      return;
    }

    if (!eventName.trim()) {
      setError("Event name is required.");
      return;
    }

    if (!eventDate) {
      setError("Event date is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("events")
      .update({
        event_name: eventName.trim(),
        event_date: eventDate,
        event_end_date: eventEndDate || null,
        event_type: eventType.trim(),
        organization: organization.trim() || null,
        duration: duration.trim() || null,
        description: description.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (updateError) {
      setError(
        updateError.message || "Unable to update event."
      );
      setSaving(false);
      return;
    }

    setSuccess("Event updated successfully.");
    setSaving(false);

    setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 700);
  }

  if (loading) {
    return (
      <main
        className={`${bricolage.className} min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10`}
        style={{
          backgroundColor: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1350px] items-center justify-center">
          <Loader2
            className="h-7 w-7 animate-spin"
            style={{
              color: "var(--admin-primary)",
            }}
          />
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main
        className={`${bricolage.className} min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10`}
        style={{
          backgroundColor: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto w-full max-w-[1350px]">
          <Link
            href="/events"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-surface)",
              color: "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div
            className="mt-8 rounded-2xl border p-6"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-surface)",
              color: "var(--admin-text)",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            <p
              className="text-sm"
              style={{
                color: "var(--admin-danger)",
              }}
            >
              {error || "Event not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main
        className={`${bricolage.className} min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10`}
        style={{
          backgroundColor: "var(--admin-bg)",
          color: "var(--admin-text)",
        }}
      >
        <div className="mx-auto -mt-28 w-full max-w-[1350px]">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-surface)",
              color: "var(--admin-text-secondary)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          {/* Page Header */}
          <div className="mt-7">
            <h1
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{
                color: "var(--admin-text)",
              }}
            >
              Edit Event
            </h1>

            <p
              className="mt-2 text-sm sm:text-base"
              style={{
                color: "var(--admin-text-muted)",
              }}
            >
              Update the event details and information.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 overflow-hidden rounded-2xl border"
            style={{
              borderColor: "var(--admin-border)",
              backgroundColor: "var(--admin-surface)",
              boxShadow: "var(--admin-shadow-sm)",
            }}
          >
            <div className="p-5 sm:p-7 lg:p-8">
              {/* Event Information */}
              <div>
                <h2
                  className="text-lg font-semibold"
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
                  Update the basic information for this event.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Event Name */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="event-name"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Event Name
                    <span
                      className="ml-1"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    >
                      *
                    </span>
                  </label>

                  <input
                    id="event-name"
                    type="text"
                    value={eventName}
                    onChange={(e) =>
                      setEventName(e.target.value)
                    }
                    placeholder="Enter event name"
                    className="admin-input h-12 w-full rounded-xl border px-4 text-sm outline-none transition"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                    required
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label
                    htmlFor="event-type"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Event Type
                  </label>

                  <input
                    id="event-type"
                    type="text"
                    value={eventType}
                    onChange={(e) =>
                      setEventType(e.target.value)
                    }
                    placeholder="e.g. Workshop, Bootcamp, Seminar"
                    className="admin-input h-12 w-full rounded-xl border px-4 text-sm outline-none transition"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Host */}
                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Host
                  </label>

                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) =>
                      setOrganization(e.target.value)
                    }
                    placeholder="Enter host name"
                    className="admin-input h-12 w-full rounded-xl border px-4 text-sm outline-none transition"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label
                    htmlFor="event-date"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Event Date
                    <span
                      className="ml-1"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    >
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />

                    <input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) =>
                        setEventDate(e.target.value)
                      }
                      className="admin-input h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                        colorScheme: "light dark",
                        accentColor:
                          "var(--admin-primary)",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Event End Date */}
                <div>
                  <label
                    htmlFor="event-end-date"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Event End Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />

                    <input
                      id="event-end-date"
                      type="date"
                      value={eventEndDate}
                      onChange={(e) =>
                        setEventEndDate(e.target.value)
                      }
                      className="admin-input h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
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

                {/* Duration */}
                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Duration
                  </label>

                  <div className="relative">
                    <Clock3
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
                      style={{
                        color: "var(--admin-primary)",
                      }}
                    />

                    <input
                      id="duration"
                      type="text"
                      value={duration}
                      onChange={(e) =>
                        setDuration(e.target.value)
                      }
                      placeholder="e.g. 2 Days, 10 Hours"
                      className="admin-input h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition"
                      style={{
                        backgroundColor: "var(--admin-bg)",
                        borderColor: "var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Enter event description"
                    rows={6}
                    className="admin-input w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{
                      backgroundColor: "var(--admin-bg)",
                      borderColor: "var(--admin-border)",
                      color: "var(--admin-text)",
                    }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="mt-6 rounded-xl border px-4 py-3 text-sm"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--admin-danger) 30%, var(--admin-border))",
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-danger) 8%, var(--admin-surface))",
                    color: "var(--admin-danger)",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  className="mt-6 rounded-xl border px-4 py-3 text-sm"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--admin-success) 30%, var(--admin-border))",
                    backgroundColor:
                      "color-mix(in srgb, var(--admin-success) 8%, var(--admin-surface))",
                    color: "var(--admin-success)",
                  }}
                >
                  {success}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div
              className="flex flex-col-reverse gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-7 lg:px-8"
              style={{
                borderColor: "var(--admin-border)",
                backgroundColor: "var(--admin-bg)",
              }}
            >
              <Link
                href={`/events/${eventId}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  borderColor: "var(--admin-border)",
                  backgroundColor: "var(--admin-surface)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "var(--admin-primary)",
                  color: "#ffffff",
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        .admin-input::placeholder {
          color: var(--admin-text-subtle);
        }

        .admin-input:focus {
          border-color: var(--admin-primary) !important;
          box-shadow: 0 0 0 3px
            color-mix(
              in srgb,
              var(--admin-primary) 12%,
              transparent
            );
        }
      `}</style>
    </>
  );
}