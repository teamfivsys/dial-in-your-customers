import { lazy, Suspense } from "react";
import MysqlAdmin from "@/pages/MysqlAdmin";

const SupabaseAdmin = lazy(() => import("@/pages/AdminSupabase"));

export default function Admin() {
  if (import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql") return <MysqlAdmin />;
  return <Suspense fallback={<p role="status">Loading administration…</p>}><SupabaseAdmin /></Suspense>;
}
