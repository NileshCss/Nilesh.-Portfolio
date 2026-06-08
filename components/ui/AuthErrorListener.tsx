"use client";

import { useEffect } from "react";
import { useToast } from "@/lib/hooks/useToast";

export function AuthErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkErrors = () => {
      // Parse search params (?error=...)
      const urlParams = new URLSearchParams(window.location.search);
      let error = urlParams.get("error_description") || urlParams.get("error");
      
      // Supabase redirects auth errors in the hash fragment (#error=...)
      if (!error && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        error = hashParams.get("error_description") || hashParams.get("error");
      }

      if (error) {
        const formattedError = decodeURIComponent(error.replace(/\+/g, " "));
        
        // Show our toast notification
        toast.warning(formattedError);
        
        // Clean the URL query/hash so it doesn't re-trigger on page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    checkErrors();
  }, [toast]);

  return null;
}
