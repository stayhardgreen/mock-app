import type { Behavior, Vendor, Part, Order } from "./types";

type DataBundle = {
  behavior: Behavior;
  vendors: Vendor[];
  parts: Part[];
  orders: Order[];
};

let cache: DataBundle | null = null;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

async function maybeFail(behavior: Behavior) {
  if (behavior.failureRate <= 0) return;
  if (Math.random() < behavior.failureRate) throw new Error("Mock API error. Please retry.");
}

function ensureCache() {
  if (!cache) throw new Error("Mock API not initialized. Call initMockApi() first.");
  return cache;
}

export async function initMockApi() {
  if (cache) return;

  const behavior = await loadJson<Behavior>("/mock-api-behavior.json");
  const [vendors, parts, orders] = await Promise.all([
    loadJson<Vendor[]>("/vendors.json"),
    loadJson<Part[]>("/parts.json"),
    loadJson<Order[]>("/orders.json"),
  ]);

  cache = { behavior, vendors, parts, orders };
}

async function simulate(behavior: Behavior) {
  await delay(randInt(behavior.latencyMs.min, behavior.latencyMs.max));
  await maybeFail(behavior);
}

export async function listVendors(q: string): Promise<Vendor[]> {
  const { behavior, vendors } = ensureCache();
  await simulate(behavior);

  const query = q.trim().toLowerCase();
  if (!query) return vendors;

  return vendors.filter(
    (v) => v.name.toLowerCase().includes(query) || v.id.toLowerCase().includes(query)
  );
}

export async function getVendorById(id: string): Promise<Vendor> {
  const { behavior, vendors } = ensureCache();
  await simulate(behavior);

  const v = vendors.find((x) => x.id === id);
  if (!v) throw new Error("Vendor not found");
  return v;
}

export async function getPartsByVendorId(vendorId: string): Promise<Part[]> {
  const { behavior, parts } = ensureCache();
  await simulate(behavior);

  return parts.filter((p) => p.defaultVendorId === vendorId);
}

export async function getOrdersByVendorId(vendorId: string): Promise<Order[]> {
  const { behavior, orders } = ensureCache();
  await simulate(behavior);

  return orders.filter((o) => o.vendorId === vendorId);
}
