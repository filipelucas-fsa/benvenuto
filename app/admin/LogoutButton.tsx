"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const sair = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button onClick={sair} className="focus-ring flex items-center gap-2 text-xs text-benvenuto-cream/60 hover:text-benvenuto-red">
      <LogOut size={14} /> Sair
    </button>
  );
}
