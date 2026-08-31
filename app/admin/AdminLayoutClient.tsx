"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { setTheme } = useTheme();

  // ── Theme & responsive layout ──────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (!stored) {
      setTheme("dark");
    }

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setTheme]);

  // ── Get logged-in user ─────────────────────────────────────────────────────
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email ?? undefined);
    };
    getUser();
  }, [supabase]);

  // ── Fetch notifications from API (server-side, auth-protected) ────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return; // user might not be authed yet
      const json = await res.json();
      setNotifications(json.notifications ?? []);
      setUnreadCount(json.unreadCount ?? 0);
    } catch {
      // silently fail — user may not be authenticated
    }
  }, []);

  // ── Initial fetch + realtime for both tables ───────────────────────────────
  useEffect(() => {
    fetchNotifications();

    // Realtime: new contact_messages → refetch notifications
    const msgChannel = supabase
      .channel("admin-layout-contact-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        () => fetchNotifications()
      )
      .subscribe();

    // Realtime: new notifications → refetch
    const notifChannel = supabase
      .channel("admin-layout-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [supabase, fetchNotifications]);

  // ── Mark a single notification as read ────────────────────────────────────
  const handleMarkNotificationRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    []
  );

  // ── Mark all notifications as read ────────────────────────────────────────
  const handleMarkAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
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
      className="min-h-screen font-sans relative overflow-x-hidden"
      style={{ background: "var(--admin-bg)", color: "var(--text-primary)" }}
    >
      {/* Mobile Backdrop Overlay */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/45 z-30 transition-opacity duration-300"
          style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-out",
          isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0") : ""
        )}
        style={{ width: isMobile ? 240 : collapsed ? 72 : 240 }}
      >
        <Sidebar
          collapsed={isMobile ? false : collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />
      </div>

      {/* Main Container */}
      <div
        className="relative transition-all duration-300 ease-out min-h-screen flex flex-col"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 72 : 240,
          width: isMobile ? "100%" : `calc(100% - ${collapsed ? 72 : 240}px)`,
        }}
      >
        <AdminHeader
          userEmail={userEmail}
          isMobile={isMobile}
          onMenuToggle={() => setCollapsed(!collapsed)}
          onLogout={handleLogout}
          unreadCount={unreadCount}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllRead}
        />
        <main style={{ padding: isMobile ? "16px 16px" : "24px 32px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
