import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { initMockApi, listVendors } from "../api/mockApi";
import type { Vendor } from "../api/types";

export default function VendorsPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      await initMockApi();
      const res = await listVendors(q);
      setVendors(res);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload when searching (simple approach)
  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const countText = useMemo(() => `${vendors.length} vendor(s)`, [vendors.length]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Vendors</h1>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or ID..."
            aria-label="Search vendors"
          />
        </label>

        <button onClick={load} disabled={loading}>
          Refresh
        </button>

        <div aria-live="polite" style={{ marginLeft: "auto" }}>
          {countText}
        </div>
      </div>

      {loading && <div aria-live="polite">Loading vendors...</div>}

      {error && (
        <div role="alert" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span>{error}</span>
          <button onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 90px 90px 140px",
              gap: 10,
              padding: "10px 12px",
              fontWeight: 700,
              background: "#fafafa",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>ID</div>
            <div>Name</div>
            <div>Status</div>
            <div>Rating</div>
            <div>City</div>
          </div>

          {vendors.map((v) => (
            <div
              key={v.id}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 90px 90px 140px",
                gap: 10,
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                alignItems: "center",
              }}
            >
              <Link to={`/vendors/${v.id}`} style={{ textDecoration: "none" }}>
                {v.id}
              </Link>
              <div>{v.name}</div>
              <div>{v.status}</div>
              <div>{v.rating.toFixed(1)}</div>
              <div style={{ fontSize: 12 }}>{v.city}</div>
            </div>
          ))}

          {vendors.length === 0 && <div style={{ padding: 12 }}>No results</div>}
        </div>
      )}
    </div>
  );
}
