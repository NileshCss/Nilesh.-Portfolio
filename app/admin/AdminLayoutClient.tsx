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
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { setTheme } = useTheme();

  // Set admin default theme to dark on first mount & handle responsive layout
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (!stored) {
      setTheme("dark");
    }

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Close by default on mobile
      } else {
        setCollapsed(false); // Open by default on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

      {/* Sidebar container */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-out",
          isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0") : ""
        )}
        style={{ width: isMobile ? 240 : (collapsed ? 72 : 240) }}
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
          marginLeft: isMobile ? 0 : (collapsed ? 72 : 240),
          width: isMobile ? "100%" : `calc(100% - ${collapsed ? 72 : 240}px)` 
        }}
      >
        <AdminHeader 
          userEmail={userEmail} 
          isMobile={isMobile}
          onMenuToggle={() => setCollapsed(!collapsed)}
        />
        <main style={{ padding: isMobile ? "16px 16px" : "24px 32px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

