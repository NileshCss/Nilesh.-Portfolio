"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email ?? undefined);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      setUnreadCount(count ?? 0);
    };
    fetchUnread();

    // Realtime subscription for new messages
    const channel = supabase
      .channel("admin-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        () => fetchUnread()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white/90 font-sans">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/[0.02] rounded-full blur-[100px]" />
      </div>

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      <div
        className={cn(
          "relative transition-all duration-300 ease-out",
          collapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        <AdminHeader userEmail={userEmail} />
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
