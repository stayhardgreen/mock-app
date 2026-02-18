import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { initMockApi, getVendorById, getPartsByVendorId, getOrdersByVendorId } from "../api/mockApi";
import type { Vendor, Part, Order } from "../api/types";

export default function VendorDetailPage() {
  const { vendorId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      await initMockApi();
      const v = await getVendorById(vendorId!);
      const [p, o] = await Promise.all([getPartsByVendorId(v.id), getOrdersByVendorId(v.id)]);
      setVendor(v);
      setParts(p);
      setOrders(o);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!vendorId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  if (loading) return <div style={{ padding: 16 }} aria-live="polite">Loading vendor...</div>;

  if (error)
    return (
      <div style={{ padding: 16, display: "grid", gap: 10 }} role="alert">
        <div>{error}</div>
        <button onClick={load}>Retry</button>
        <Link to="/vendors">Back</Link>
      </div>
    );

  if (!vendor) return <div style={{ padding: 16 }}>Not found</div>;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ marginTop: 0 }}>{vendor.name}</h1>
        <Link to="/vendors">← Back to list</Link>
      </div>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Vendor Info</h2>
        <div><b>ID:</b> {vendor.id}</div>
        <div><b>Status:</b> {vendor.status}</div>
        <div><b>Rating:</b> {vendor.rating.toFixed(1)}</div>
        <div><b>Lead time:</b> {vendor.leadTimeDaysTypical} days</div>
        <div><b>Location:</b> {vendor.city}, {vendor.country}</div>
        <div><b>Last order:</b> {vendor.lastOrderDate ?? "—"}</div>
        <div><b>Tags:</b> {vendor.tags.join(", ")}</div>

        <div style={{ marginTop: 10 }}>
          <h3 style={{ marginBottom: 6 }}>Contact</h3>
          <div>{vendor.contact.name}</div>
          <div>{vendor.contact.email}</div>
          <div>{vendor.contact.phone}</div>
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Parts (default vendor)</h2>
        {parts.length === 0 ? (
          <div>None</div>
        ) : (
          <ul>
            {parts.map((p) => (
              <li key={p.id}>
                <b>{p.partNumber}</b> — {p.description} · ${p.unitCost.toFixed(2)} · stock {p.stockOnHand}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Orders</h2>
        {orders.length === 0 ? (
          <div>None</div>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id}>
                <b>{o.poNumber}</b> — {o.status} · total ${o.total.toFixed(2)} · created {o.createdDate}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
