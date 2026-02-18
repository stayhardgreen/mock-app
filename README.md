# Vendor Directory (React + TypeScript)

## What this is
A tiny vendor/parts directory app:
- Vendors list/table view (with search)
- Vendor detail page with related parts + orders
- Mock API layer that loads JSON from `/public` and simulates latency/errors
- Basic loading + error states with retry buttons

## Put data files here
Place these in `public/`:
- vendors.json
- parts.json
- orders.json
- mock-api-behavior.json

## Run locally
```bash
npm install
npm run dev
