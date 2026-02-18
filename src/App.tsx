import { Routes, Route, Navigate } from "react-router-dom";
import VendorsPage from "./pages/VendorsPage";
import VendorDetailPage from "./pages/VendorDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vendors" replace />} />
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/vendors/:vendorId" element={<VendorDetailPage />} />
      <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
    </Routes>
  );
}
