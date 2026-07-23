import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Somente a Publishable Key é usada no navegador — nunca a service_role.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
