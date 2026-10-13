"use client";
import { useI18n } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Shield,
  Truck,
  Wrench,
  Users,
  Ruler,
  Leaf,
  Beaker,
  Briefcase,
  Banknote,
  AlertTriangle,
  FileText,
  Settings,
  Languages,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: ReactNode; module?: string }[];
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const groups: NavGroup[] = [
    {
      label: t("nav.overview"),
      items: [
        { href: "/", label: t("nav.dashboard"), icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      label: t("nav.safety"),
      items: [
        { href: "/module/0", label: t("modules.m0"), icon: <Shield size={18} />, module: "0" },
      ],
    },
    {
      label: t("nav.productionChain"),
      items: [
        { href: "/module/1", label: t("modules.m1"), icon: <Truck size={18} />, module: "1" },
        { href: "/module/2", label: t("modules.m2"), icon: <Truck size={18} />, module: "2" },
        { href: "/module/3", label: t("modules.m3"), icon: <Truck size={18} />, module: "3" },
        { href: "/module/4", label: t("modules.m4"), icon: <Truck size={18} />, module: "4" },
        { href: "/module/5", label: t("modules.m5"), icon: <Truck size={18} />, module: "5" },
        { href: "/module/6", label: t("modules.m6"), icon: <Truck size={18} />, module: "6" },
        { href: "/module/7", label: t("modules.m7"), icon: <Truck size={18} />, module: "7" },
      ],
    },
    {
      label: t("nav.plantMaintenance"),
      items: [
        { href: "/module/8", label: t("modules.m8"), icon: <Wrench size={18} />, module: "8" },
        { href: "/module/9", label: t("modules.m9"), icon: <Wrench size={18} />, module: "9" },
        { href: "/module/10", label: t("modules.m10"), icon: <Wrench size={18} />, module: "10" },
      ],
    },
    {
      label: t("nav.hr"),
      items: [
        { href: "/module/11", label: t("modules.m11"), icon: <Users size={18} />, module: "11" },
      ],
    },
    {
      label: t("nav.engineering"),
      items: [
        { href: "/module/12", label: t("modules.m12"), icon: <Ruler size={18} />, module: "12" },
      ],
    },
    {
      label: t("nav.environment"),
      items: [
        { href: "/module/13", label: t("modules.m13"), icon: <Leaf size={18} />, module: "13" },
      ],
    },
    {
      label: t("nav.coalQuality"),
      items: [
        { href: "/module/14", label: t("modules.m14"), icon: <Beaker size={18} />, module: "14" },
      ],
    },
    {
      label: t("nav.sales"),
      items: [
        { href: "/module/15", label: t("modules.m15"), icon: <Briefcase size={18} />, module: "15" },
      ],
    },
    {
      label: t("nav.finance"),
      items: [
        { href: "/module/16", label: t("modules.m16"), icon: <Banknote size={18} />, module: "16" },
        { href: "/module/17", label: t("modules.m17"), icon: <Banknote size={18} />, module: "17" },
      ],
    },
    {
      label: t("nav.risk"),
      items: [
        { href: "/module/18", label: t("modules.m18"), icon: <AlertTriangle size={18} />, module: "18" },
      ],
    },
    {
      label: t("nav.reports"),
      items: [
        { href: "/reports", label: t("execSummary.preview"), icon: <FileText size={18} /> },
        { href: "/module/19", label: t("modules.m19"), icon: <FileText size={18} />, module: "19" },
      ],
    },
    {
      label: t("nav.admin"),
      items: [
        { href: "/admin", label: "Initialization", icon: <Settings size={18} /> },
        { href: "/admin/users", label: "Users & Roles", icon: <Settings size={18} /> },
        { href: "/admin/audit", label: "Audit Log", icon: <Settings size={18} /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-coal-50 text-coal-900">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-16"
        } transition-all duration-200 bg-coal-950 text-coal-50 flex-shrink-0 hidden md:flex flex-col`}
      >
        <div className="h-14 flex items-center gap-2 px-3 border-b border-coal-800">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-coal-950 font-bold">C</div>
          {open && (
            <div className="flex flex-col">
              <div className="font-semibold text-sm">{t("app.name")}</div>
              <div className="text-[10px] text-coal-300">{t("app.tagline")}</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map((g, gi) => (
            <div key={gi} className="px-2 mb-2">
              {open && (
                <div className="text-[10px] uppercase tracking-wider text-coal-400 px-2 py-1">
                  {g.label}
                </div>
              )}
              {g.items.map((it, ii) => {
                const active = pathname === it.href;
                return (
                  <Link
                    key={ii}
                    href={it.href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-coal-800 transition-colors ${
                      active ? "bg-coal-800 text-amber-300" : "text-coal-200"
                    }`}
                  >
                    <span className="flex-shrink-0">{it.icon}</span>
                    {open && <span className="truncate">{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-coal-800 p-2 text-[10px] text-coal-400">
          {open && (
            <>
              <div>{t("footer.timezone")}</div>
              <div className="mt-1">{t("footer.version")}</div>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-coal-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded hover:bg-coal-100 hidden md:block"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded hover:bg-coal-100 md:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] text-coal-500 uppercase tracking-wider">{t("app.subtitle")}</span>
              <span className="text-sm font-semibold">PT Mitra Tambang Nusantara (Demo)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PeriodSelectorInline />
            <div className="flex items-center gap-1 bg-coal-100 rounded-md p-0.5">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 text-xs rounded ${
                  lang === "en" ? "bg-white shadow text-coal-900 font-semibold" : "text-coal-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("id")}
                className={`px-2 py-1 text-xs rounded ${
                  lang === "id" ? "bg-white shadow text-coal-900 font-semibold" : "text-coal-600"
                }`}
              >
                ID
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-coal-100 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">GM</div>
              <div>
                <div className="font-semibold">General Manager</div>
                <div className="text-coal-500 text-[10px]">gm@demo.coalops</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-coal-950 text-coal-50 p-3 border-b border-coal-800">
            {groups.map((g, gi) => (
              <div key={gi} className="mb-2">
                <div className="text-[10px] uppercase text-coal-400 mb-1">{g.label}</div>
                {g.items.map((it, ii) => (
                  <Link
                    key={ii}
                    href={it.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1 text-sm text-coal-200"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

import { PeriodSelectorInline } from "./PeriodSelectorInline";
