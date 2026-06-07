import { AdminLayoutClient } from "./AdminLayoutClient";

// Force dynamic rendering — admin pages require Supabase auth
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
