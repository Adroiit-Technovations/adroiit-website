
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

type VerificationRecord = {
  id: string;
  certificate_id: string;
  verified_at: string;
  certificate: {
    id: string;
    certificate_id: string;
    recipient_name: string;
    program_name: string | null;
    status: string;
  } | null;
};

type ApiResponse = {
  records: VerificationRecord[];
  hasMore: boolean;
  error?: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function VerificationLogsTable() {
  const [records, setRecords] = useState<VerificationRecord[]>([]);

  const [certificateUid, setCertificateUid] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [error, setError] = useState("");

  const fetchRecords = useCallback(
    async (
      offset: number,
      append: boolean,
      signal?: AbortSignal
    ) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams({
          offset: String(offset),
          limit: "10",
        });

        if (certificateUid.trim()) {
          params.set("uid", certificateUid.trim());
        }

        if (selectedDate) {
          params.set("date", selectedDate);
        }

        const response = await fetch(
          `/api/verification-logs?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal,
          }
        );

        const result = (await response.json()) as ApiResponse;

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load verification logs."
          );
        }

        setRecords((previous) =>
          append
            ? [...previous, ...result.records]
            : result.records
        );

        setHasMore(result.hasMore);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading verification logs."
        );

        if (!append) {
          setRecords([]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [certificateUid, selectedDate]
  );

  // Fetch the latest 10 records whenever filters change.
  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(() => {
      fetchRecords(0, false, controller.signal);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [fetchRecords]);

  // Load the next 10 records.
  const handleLoadMore = () => {
    if (loadingMore || loading || !hasMore) return;

    fetchRecords(records.length, true);
  };

  // Clear all active filters.
  const clearFilters = () => {
    setCertificateUid("");
    setSelectedDate("");
  };

  const hasActiveFilters =
    certificateUid.trim().length > 0 ||
    selectedDate.length > 0;

  return (
    <div className="mt-6 space-y-6">

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <Filter size={17} className="text-[#a77dff]" />

            <h2 className="text-sm font-semibold text-white">
              Filter Verification Logs
            </h2>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Certificate UID Filter */}
          <div>
            <label
              htmlFor="certificateUid"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Certificate UID
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="certificateUid"
                type="text"
                value={certificateUid}
                onChange={(event) =>
                  setCertificateUid(event.target.value)
                }
                placeholder="Search by certificate UID..."
                className="w-full rounded-xl border border-white/10 bg-[#111018] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#8c52ff]"
              />
            </div>
          </div>

          {/* Verification Date Filter */}
          <div>
            <label
              htmlFor="verificationDate"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Verification Date
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="verificationDate"
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#111018] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#8c52ff] [color-scheme:dark]"
              />
            </div>
          </div>

        </div>

        <p className="mt-4 text-xs text-gray-500">
          Filters are applied automatically. You can search using a
          complete or partial certificate UID.
        </p>

      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchRecords(0, false)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-red-300 transition hover:text-white"
          >
            <RefreshCw size={14} />
            Retry
          </button>

        </div>
      )}

      {/* Verification Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

        {/* Table Header */}
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-white">
            Verification Activity
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Latest certificate verification records
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3">

            <Loader2
              size={25}
              className="animate-spin text-[#8c52ff]"
            />

            <p className="text-sm text-gray-500">
              Loading verification logs...
            </p>

          </div>
        ) : records.length === 0 ? (

          /* Empty State */
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Search size={20} className="text-gray-500" />
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              No verification records found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {hasActiveFilters
                ? "Try changing or clearing your filters."
                : "Verification activity will appear here when certificates are verified."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#8c52ff]/30 bg-[#8c52ff]/10 px-4 py-2 text-sm font-semibold text-[#b99aff] transition hover:bg-[#8c52ff]/20"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          <>
            {/* Records Table */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Certificate UID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Recipient
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Program
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Verified At
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => {
                    const certificate = record.certificate;

                    return (
                      <tr
                        key={record.id}
                        className="border-b border-white/[0.06] transition last:border-0 hover:bg-white/[0.025]"
                      >

                        <td className="px-6 py-5">
                          <p className="font-mono text-sm font-semibold text-[#a77dff]">
                            {certificate?.certificate_id ?? "Unknown"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-white">
                            {certificate?.recipient_name ?? "Unknown"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-400">
                            {certificate?.program_name ?? "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              certificate?.status === "VALID"
                                ? "bg-green-500/10 text-green-400"
                                : certificate?.status === "REVOKED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {certificate?.status ?? "UNKNOWN"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="whitespace-nowrap text-sm text-gray-400">
                            {formatDateTime(record.verified_at)}
                          </p>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

            {/* Load More */}
            <div className="flex items-center justify-center border-t border-white/10 px-5 py-6">

              {hasMore ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#8c52ff]/30 bg-[#8c52ff]/10 px-5 py-3 text-sm font-semibold text-[#c5aaff] transition hover:border-[#8c52ff]/60 hover:bg-[#8c52ff]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-gray-500">
                  You have reached the end of the verification logs.
                </p>
              )}

            </div>

          </>
        )}

      </div>
    </div>
  );
}
