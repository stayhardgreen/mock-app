export type VendorStatus = "active" | "inactive";

export type Vendor = {
  id: string;
  name: string;
  status: VendorStatus;
  rating: number;
  leadTimeDaysTypical: number;
  country: string;
  city: string;
  lastOrderDate: string | null;
  tags: string[];
  contact: { name: string; email: string; phone: string };
};

export type Part = {
  id: string;
  partNumber: string;
  description: string;
  uom: string;
  defaultVendorId: string;
  unitCost: number;
  stockOnHand: number;
  reorderPoint: number;
  leadTimeDays: number;
  lastPurchasedDate: string | null;
  category: string;
};

export type Order = {
  id: string;
  poNumber: string;
  vendorId: string;
  status: "open" | "closed" | "cancelled";
  createdDate: string;
  expectedDate: string | null;
  total: number;
  lineItems: { id: string; partId: string; qty: number; unitCost: number; receivedQty: number }[];
};

export type Behavior = {
  mode: "full_list" | "server_paged";
  pagination: { pageSize: number };
  failureRate: number; // 0..1
  readOnly: boolean;
  latencyMs: { min: number; max: number };
};
