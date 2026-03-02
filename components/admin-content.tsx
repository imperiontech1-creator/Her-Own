"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrderRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [25, 50, 100, 250] as const;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "refunded", label: "Refunded" },
];
const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest first" },
  { value: "created_at_asc", label: "Oldest first" },
  { value: "total_cents_desc", label: "Total high → low" },
  { value: "total_cents_asc", label: "Total low → high" },
  { value: "status_asc", label: "Status A–Z" },
  { value: "status_desc", label: "Status Z–A" },
  { value: "email_asc", label: "Email A–Z" },
  { value: "email_desc", label: "Email Z–A" },
];

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const VALID_STATUSES = ["pending", "paid", "shipped", "delivered", "refunded"] as const;

/** Normalize API row so table/CSV never see undefined or invalid types; keeps UI standalone. */
function normalizeOrder(row: unknown): OrderRow {
  const r = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  const status = typeof r.status === "string" && VALID_STATUSES.includes(r.status as (typeof VALID_STATUSES)[number]) ? r.status : "pending";
  const totalCents = typeof r.total_cents === "number" && Number.isFinite(r.total_cents) ? r.total_cents : 0;
  const items = Array.isArray(r.items) ? r.items : [];
  return {
    id: typeof r.id === "string" ? r.id : "",
    stripe_session_id: typeof r.stripe_session_id === "string" ? r.stripe_session_id : null,
    stripe_payment_intent_id: typeof r.stripe_payment_intent_id === "string" ? r.stripe_payment_intent_id : null,
    email: typeof r.email === "string" ? r.email : "",
    status,
    items: items.map((it: unknown) => {
      const i = it && typeof it === "object" ? (it as Record<string, unknown>) : {};
      return {
        productId: typeof i.productId === "string" ? i.productId : "",
        quantity: typeof i.quantity === "number" && Number.isInteger(i.quantity) ? i.quantity : 0,
        price: typeof i.price === "number" && Number.isFinite(i.price) ? i.price : 0,
        name: typeof i.name === "string" ? i.name : "",
      };
    }),
    total_cents: totalCents,
    created_at: typeof r.created_at === "string" ? r.created_at : new Date().toISOString(),
    updated_at: typeof r.updated_at === "string" ? r.updated_at : new Date().toISOString(),
    tracking_number: typeof r.tracking_number === "string" ? r.tracking_number : null,
    tracking_carrier: typeof r.tracking_carrier === "string" ? r.tracking_carrier : null,
    discreet_descriptor: typeof r.discreet_descriptor === "string" ? r.discreet_descriptor : null,
  };
}

function safePagination(p: unknown): Pagination {
  const def = { page: 1, limit: 50, total: 0, totalPages: 1 };
  if (!p || typeof p !== "object") return def;
  const q = p as Record<string, unknown>;
  const page = Math.max(1, Number(q.page)) || 1;
  const limit = Math.max(1, Math.min(500, Number(q.limit))) || 50;
  const total = Math.max(0, Number(q.total)) || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { page, limit, total, totalPages };
}

export function AdminContent() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("created_at_desc");

  const fetchOrders = useCallback(() => {
    setError("");
    setLoading(true);
    const [sortBy, sortOrder] = sort.includes("_asc") ? [sort.replace("_asc", ""), "asc"] : [sort.replace("_desc", ""), "desc"];
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort: sortBy,
      order: sortOrder,
    });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    fetch(`/api/admin/orders?${params}`)
      .then(async (r) => {
        let data: { error?: string; orders?: unknown[]; pagination?: unknown };
        try {
          data = await r.json();
        } catch {
          setError("Failed to load orders");
          setOrders([]);
          return;
        }
        if (data?.error) {
          setError(String(data.error));
          setOrders([]);
          return;
        }
        setError("");
        const raw = Array.isArray(data.orders) ? data.orders : [];
        setOrders(raw.map(normalizeOrder));
        setPagination(safePagination(data.pagination));
      })
      .catch(() => {
        setError("Failed to load orders");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, status, search, dateFrom, dateTo, sort]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const applySearch = () => setSearch(searchInput.trim());
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSort("created_at_desc");
    setPage(1);
  };

  const markShipped = async (orderId: string) => {
    if (!orderId || !String(orderId).trim()) return;
    const num = trackingNumber.trim();
    const carrier = trackingCarrier.trim();
    let res: Response;
    try {
      res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: "shipped",
          tracking_number: num || undefined,
          tracking_carrier: carrier || undefined,
        }),
      });
    } catch {
      setError("Update failed");
      return;
    }
    let data: { error?: string };
    try {
      data = await res.json();
    } catch {
      setError("Update failed");
      return;
    }
    if (!res.ok) {
      setError(data?.error || "Update failed");
      return;
    }
    setError("");
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "shipped",
              tracking_number: num || null,
              tracking_carrier: carrier || null,
            }
          : o
      )
    );
    setSelectedId(null);
    setTrackingNumber("");
    setTrackingCarrier("");
  };

  const escapeCsv = (v: string | number) => {
    const s = String(v);
    if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const exportOrdersCsv = () => {
    const headers = ["id", "stripe_session_id", "email", "status", "total_cents", "created_at", "tracking_number", "tracking_carrier"];
    const rows = orders.map((o) =>
      [o.id, o.stripe_session_id ?? "", o.email, o.status, o.total_cents, o.created_at, o.tracking_number ?? "", o.tracking_carrier ?? ""].map(escapeCsv).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `her-own-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFulfillmentCsv = () => {
    const headers = ["order_id", "email", "status", "total_cents", "created_at", "line_item_name", "product_id", "quantity", "unit_price", "tracking_number", "tracking_carrier"];
    const rows: string[] = [];
    orders.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      if (items.length === 0) {
        rows.push([o.id, o.email, o.status, o.total_cents, o.created_at, "", "", "", "", o.tracking_number ?? "", o.tracking_carrier ?? ""].map(escapeCsv).join(","));
      } else {
        items.forEach((line: { name?: string; productId?: string; quantity?: number; price?: number }) => {
          rows.push(
            [
              o.id,
              o.email,
              o.status,
              o.total_cents,
              o.created_at,
              line.name ?? "",
              line.productId ?? "",
              line.quantity ?? 0,
              line.price ?? 0,
              o.tracking_number ?? "",
              o.tracking_carrier ?? "",
            ].map(escapeCsv).join(",")
          );
        });
      }
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `her-own-fulfillment-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-9 w-56 animate-pulse rounded bg-white/20" />
        <div className="mt-6 flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
        <div className="mt-8 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error && orders.length === 0 && error.includes("Unauthorized")) {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-text/80">You need to sign in to view orders.</p>
        <Link href="/admin/login">
          <Button className="mt-4">Go to login</Button>
        </Link>
      </div>
    );
  }

  const { total, totalPages } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <header className="flex flex-col gap-4 border-b border-white/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">Orders</h1>
          <p className="mt-1 text-sm text-white/70">
            {total.toLocaleString()} order{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportOrdersCsv} className="border-white/30 bg-white/5 text-white hover:bg-white/10">
            Export orders
          </Button>
          <Button variant="outline" size="sm" onClick={exportFulfillmentCsv} className="border-white/30 bg-white/5 text-white hover:bg-white/10">
            Fulfillment CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="text-white/80 hover:text-white"
          >
            Log out
          </Button>
        </div>
      </header>

      <section className="mt-6 rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label className="text-xs text-white/70">Search</Label>
            <div className="mt-1 flex gap-2">
              <Input
                placeholder="Email, order ID, session ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                className="mt-0.5 border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
              <Button size="sm" onClick={applySearch} className="shrink-0 bg-rose-gold/90 text-white hover:bg-rose-gold">
                Search
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-white/70">Status</Label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="mt-1 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs text-white/70">From date</Label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="mt-1 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-white/70">To date</Label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="mt-1 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-white/70">Sort</Label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="mt-1 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs text-white/70">Per page</Label>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="mt-1 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white/70 hover:text-white">
            Clear filters
          </Button>
        </div>
      </section>

      {error && (
        <div className="mt-4 flex flex-wrap items-center gap-3" role="alert">
          <p className="text-sm text-red-400">{error}</p>
          {(error === "Database error" || error === "Database not configured" || error === "Failed to load orders") && (
            <Button size="sm" variant="outline" onClick={() => fetchOrders()} className="border-white/30 text-white hover:bg-white/10">
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="w-8 py-3 pl-4 pr-2" aria-label="Expand" />
                <th className="py-3 pr-4 font-medium text-white/90">Order / Email</th>
                <th className="py-3 pr-4 font-medium text-white/90">Status</th>
                <th className="py-3 pr-4 font-medium text-white/90">Total</th>
                <th className="py-3 pr-4 font-medium text-white/90">Date</th>
                <th className="py-3 pl-2 pr-4 font-medium text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <Fragment key={o.id || `row-${idx}`}>
                  <tr
                    className={cn(
                      "border-b border-white/10 transition-colors hover:bg-white/5",
                      expandedId === o.id && "bg-white/10"
                    )}
                  >
                    <td className="py-2 pl-4 pr-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                        className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white"
                        aria-label={expandedId === o.id ? "Collapse" : "Expand"}
                      >
                        {expandedId === o.id ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-white">{o.email}</div>
                      <div className="text-xs text-white/60">
                        {o.stripe_session_id ? `${o.stripe_session_id.slice(0, 20)}…` : o.id.slice(0, 8)}…
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          o.status === "paid" && "bg-amber-500/20 text-amber-300",
                          o.status === "shipped" && "bg-blue-500/20 text-blue-300",
                          o.status === "delivered" && "bg-emerald-500/20 text-emerald-300",
                          o.status === "refunded" && "bg-red-500/20 text-red-300",
                          o.status === "pending" && "bg-white/20 text-white/80"
                        )}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-white">${(o.total_cents / 100).toFixed(2)}</td>
                    <td className="py-3 pr-4 text-white/90">
                      {new Date(o.created_at).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-3 pl-2 pr-4">
                      {o.status !== "shipped" && o.status !== "delivered" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedId(selectedId === o.id ? null : o.id)}
                          className="text-rose-gold hover:bg-rose-gold/20"
                        >
                          Mark shipped
                        </Button>
                      )}
                      {selectedId === o.id && (
                        <div className="mt-2 flex flex-wrap items-end gap-2">
                          <div>
                            <Label className="text-xs text-white/70">Tracking #</Label>
                            <Input
                              className="mt-0.5 h-8 w-36 border-white/20 bg-white/10 text-white"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              placeholder="1Z999..."
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-white/70">Carrier</Label>
                            <Input
                              className="mt-0.5 h-8 w-24 border-white/20 bg-white/10 text-white"
                              value={trackingCarrier}
                              onChange={(e) => setTrackingCarrier(e.target.value)}
                              placeholder="UPS"
                            />
                          </div>
                          <Button size="sm" onClick={() => markShipped(o.id)} className="bg-rose-gold text-white hover:bg-rose-gold/90">
                            Save
                          </Button>
                        </div>
                      )}
                      {o.tracking_number && (
                        <p className="mt-1 text-xs text-white/60">
                          {o.tracking_carrier} {o.tracking_number}
                        </p>
                      )}
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr key={`${o.id || idx}-detail`} className="border-b border-white/10 bg-white/5">
                      <td colSpan={6} className="py-3 pl-4 pr-4">
                        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                          <div className="text-xs font-medium uppercase tracking-wide text-white/60">Line items</div>
                          <ul className="mt-2 space-y-1.5">
                            {Array.isArray(o.items) && o.items.length > 0 ? (
                              o.items.map((line: { name?: string; productId?: string; quantity?: number; price?: number }, idx: number) => (
                                <li key={idx} className="flex justify-between text-sm text-white">
                                  <span>
                                    {line.quantity ?? 1}× {line.name ?? line.productId ?? "Item"}
                                  </span>
                                  <span className="font-mono text-white/80">${Number(line.price ?? 0).toFixed(2)}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-white/60">No line items</li>
                            )}
                          </ul>
                          {o.stripe_session_id && (
                            <p className="mt-3 text-xs text-white/60">
                              Tracking page:{" "}
                              <a
                                href={`/tracking/${o.stripe_session_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-gold hover:underline"
                              >
                                /tracking/{o.stripe_session_id.slice(0, 20)}…
                              </a>
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !error && (
          <div className="py-12 text-center text-white/60">No orders match your filters.</div>
        )}
      </div>

      {totalPages > 1 && (
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/5 px-4 py-3">
          <p className="text-sm text-white/70">
            Showing {start.toLocaleString()}–{end.toLocaleString()} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="border-white/20 text-white disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="min-w-[120px] text-center text-sm text-white/80">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="border-white/20 text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
