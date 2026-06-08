"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { setTheme } = useTheme();

  // Set admin default theme to dark on first mount
  useEffect(() => {
    setMounted(true);
    // Only set to dark if no preference stored yet
    const stored = localStorage.getItem("theme");
    if (!stored) {
      setTheme("dark");
    }
  }, [setTheme]);

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

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  // Prevent flash before mount
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0F1E" }}
      >
        <div
          className="rounded-full animate-spin"
          style={{
            width: 32,
            height: 32,
            border: "2.5px solid rgba(59,130,246,0.2)",
            borderTopColor: "#3B82F6",
          }}
        />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "var(--admin-bg)", color: "var(--text-primary)" }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      <div
        className={cn("relative transition-all duration-300 ease-out min-h-screen")}
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        <AdminHeader userEmail={userEmail} />
        <main style={{ padding: "24px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

