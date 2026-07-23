"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pizza, Tag, ClipboardList, Settings } from "lucide-react";

export const LINKS = [
  { href: "/admin/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/produtos", label: "Produtos", icon: Pizza },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const ativo = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              ativo
                ? "bg-benvenuto-red/15 text-benvenuto-red"
                : "text-benvenuto-cream/70 hover:bg-benvenuto-black hover:text-benvenuto-cream"
            }`}
          >
            <Icon size={16} /> {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
