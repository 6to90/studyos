"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminCode } from "@/features/admin/actions";

declare global {
  interface Window {
    /** Dev/operator convenience only — see this file's doc comment. */
    adminLogin?: (code: string) => Promise<void>;
  }
}

/**
 * Console convenience for the admin passphrase login — NOT an auth bypass.
 * `window.adminLogin("<the real ADMIN_SECRET>")` in devtools calls the exact
 * same server-verified `verifyAdminCode` action the "코드 로그인" form tab
 * uses (same passphrase check, same IP ban check, same rate limit). Nothing
 * here grants a session without the correct secret — it only skips the
 * manual form-filling. Only mounted on /admin-auth, never site-wide.
 */
export function AdminConsoleLogin() {
  const router = useRouter();

  useEffect(() => {
    window.adminLogin = async (code: string) => {
      const result = await verifyAdminCode({ code });
      if (result?.error) {
        console.error(`[adminLogin] ${result.error}`);
        return;
      }
      console.info("[adminLogin] success");
      router.push("/admin?welcome=1");
      router.refresh();
    };
    return () => {
      delete window.adminLogin;
    };
  }, [router]);

  return null;
}
