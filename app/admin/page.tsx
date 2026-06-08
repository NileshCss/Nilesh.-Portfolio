"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    };
    handleRedirect();
  }, [router]);

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
