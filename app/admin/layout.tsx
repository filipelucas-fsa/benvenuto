import { createServerSupabase } from "@/lib/supabase/server";
import AdminNavLinks from "./AdminNavLinks";
import AdminMobileNav from "./AdminMobileNav";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-benvenuto-black md:flex">
      <AdminMobileNav email={user?.email} />

      <aside className="hidden w-60 shrink-0 border-r border-benvenuto-gold/10 bg-benvenuto-charcoal p-5 md:block">
        <p className="mb-8 font-display text-lg font-bold text-benvenuto-cream">
          Benvenuto<span className="text-benvenuto-gold">.</span> Admin
        </p>
        <AdminNavLinks />
        <div className="mt-10 border-t border-benvenuto-gold/10 pt-4">
          <p className="mb-2 truncate text-xs text-benvenuto-cream/40">{user?.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}
