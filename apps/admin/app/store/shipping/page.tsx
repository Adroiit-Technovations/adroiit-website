"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Save, Search } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

import { createClient } from "@/lib/supabase/client";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

type ShippingRate = {
  id: string;
  state_code: string;
  state_name: string;
  charge: number;
  is_active: boolean;
};

type FilterType = "ALL" | "STATES" | "UTS";

const STATE_CODES = new Set([
  "AP",
  "AR",
  "AS",
  "BR",
  "CG",
  "GA",
  "GJ",
  "HR",
  "HP",
  "JH",
  "KA",
  "KL",
  "MP",
  "MH",
  "MN",
  "ML",
  "MZ",
  "NL",
  "OD",
  "PB",
  "RJ",
  "SK",
  "TN",
  "TS",
  "TR",
  "UP",
  "UK",
  "WB",
]);

export default function ShippingPage() {
  const supabase = createClient();

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRates() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("shipping_rates")
          .select(
            "id,state_code,state_name,charge,is_active"
          )
          .order("state_name", {
            ascending: true,
          });

        if (error) {
          throw new Error(error.message);
        }

        setRates(
          (data ?? []).map((item) => ({
            id: item.id,
            state_code: item.state_code,
            state_name: item.state_name,
            charge: Number(item.charge ?? 0),
            is_active: Boolean(item.is_active),
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load shipping charges."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRates();
  }, [supabase]);

  const filteredRates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rates.filter((rate) => {
      const matchesSearch =
        !query ||
        rate.state_name.toLowerCase().includes(query) ||
        rate.state_code.toLowerCase().includes(query);

      const isState = STATE_CODES.has(rate.state_code);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "STATES" && isState) ||
        (filter === "UTS" && !isState);

      return matchesSearch && matchesFilter;
    });
  }, [rates, search, filter]);

  function updateCharge(id: string, value: string) {
    const numericValue =
      value === "" ? 0 : Math.max(0, Number(value) || 0);

    setRates((current) =>
      current.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              charge: numericValue,
            }
          : rate
      )
    );

    setSavedId(null);
  }

  async function saveRate(rate: ShippingRate) {
    try {
      setSavingId(rate.id);
      setSavedId(null);
      setError(null);

      const charge = Math.max(
        0,
        Number(rate.charge) || 0
      );

      const { error } = await supabase
        .from("shipping_rates")
        .update({
          charge,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rate.id);

      if (error) {
        throw new Error(error.message);
      }

      setRates((current) =>
        current.map((item) =>
          item.id === rate.id
            ? {
                ...item,
                charge,
              }
            : item
        )
      );

      setSavedId(rate.id);

      window.setTimeout(() => {
        setSavedId((current) =>
          current === rate.id ? null : current
        );
      }, 1600);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save shipping charge."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div
      className={`${bricolage.className} mx-auto w-full max-w-[1400px]`}
      style={{
        color: "var(--admin-text)",
      }}
    >
      <div
        className="w-full overflow-hidden rounded-[18px] border"
        style={{
          backgroundColor: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        {/* FILTER BAR */}
        <div
          className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="relative w-full sm:max-w-[360px]">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{
                color: "var(--admin-text-muted)",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search state or UT"
              className="h-[42px] w-full rounded-[10px] border pl-10 pr-3 text-[14px] outline-none"
              style={{
                backgroundColor:
                  "var(--admin-surface-2)",
                borderColor:
                  "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            />
          </div>

          <div className="flex w-full gap-1 rounded-[10px] p-1 sm:w-auto">
            {(
              [
                ["ALL", "All"],
                ["STATES", "States"],
                ["UTS", "UTs"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className="h-[36px] rounded-[8px] px-4 text-[13px] font-semibold transition"
                style={{
                  backgroundColor:
                    filter === value
                      ? "var(--admin-primary)"
                      : "transparent",
                  color:
                    filter === value
                      ? "#ffffff"
                      : "var(--admin-text-secondary)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="border-b px-4 py-3 text-[13px]"
            style={{
              backgroundColor:
                "rgba(248,113,113,0.08)",
              borderColor:
                "rgba(248,113,113,0.20)",
              color: "var(--admin-danger)",
            }}
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div
            className="flex min-h-[420px] items-center justify-center"
            style={{
              color: "var(--admin-text-muted)",
            }}
          >
            <Loader2
              size={25}
              className="animate-spin"
            />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor:
                      "var(--admin-border)",
                    backgroundColor:
                      "var(--admin-surface-2)",
                  }}
                >
                  <th
                    className="px-5 py-4 text-left text-[13px] font-bold"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    State / UT
                  </th>

                  <th
                    className="w-[260px] px-5 py-4 text-left text-[13px] font-bold"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    Shipping Charge
                  </th>

                  <th
                    className="w-[150px] px-5 py-4 text-right text-[13px] font-bold"
                    style={{
                      color:
                        "var(--admin-text-secondary)",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="border-b last:border-b-0"
                    style={{
                      borderColor:
                        "var(--admin-border)",
                      opacity: rate.is_active
                        ? 1
                        : 0.55,
                    }}
                  >
                    <td className="px-5 py-4">
                      <div
                        className="text-[15px] font-semibold"
                        style={{
                          color:
                            "var(--admin-text)",
                        }}
                      >
                        {rate.state_name}
                      </div>

                      <div
                        className="mt-0.5 text-[12px] font-medium"
                        style={{
                          color:
                            "var(--admin-text-muted)",
                        }}
                      >
                        {rate.state_code}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative max-w-[220px]">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold"
                          style={{
                            color:
                              "var(--admin-text-muted)",
                          }}
                        >
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={rate.charge}
                          onChange={(event) =>
                            updateCharge(
                              rate.id,
                              event.target.value
                            )
                          }
                          className="h-[42px] w-full rounded-[9px] border pl-8 pr-3 text-[14px] font-semibold outline-none"
                          style={{
                            backgroundColor:
                              "var(--admin-surface-2)",
                            borderColor:
                              "var(--admin-border)",
                            color:
                              "var(--admin-text)",
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          saveRate(rate)
                        }
                        disabled={
                          savingId === rate.id
                        }
                        className="ml-auto flex h-[40px] min-w-[108px] items-center justify-center gap-2 rounded-[9px] px-3 text-[13px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                          backgroundColor:
                            savedId === rate.id
                              ? "var(--admin-success)"
                              : "var(--admin-primary)",
                        }}
                      >
                        {savingId === rate.id ? (
                          <>
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                            Saving
                          </>
                        ) : savedId === rate.id ? (
                          <>
                            <Check size={15} />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save size={15} />
                            Save
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRates.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-16 text-center text-[14px]"
                      style={{
                        color:
                          "var(--admin-text-muted)",
                      }}
                    >
                      No states or UTs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

