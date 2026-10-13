"use client";
import { useI18n } from "@/lib/i18n";
import { Users, Shield, Key } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "GM" | "Dept Head" | "Viewer";
  modules: string[];
  lastSeen: string;
}

const USERS: User[] = [
  { id: "U001", name: "Andi Wijaya", email: "admin@demo.coalops", role: "Admin", modules: ["ALL"], lastSeen: "2 min ago" },
  { id: "U002", name: "Ir. Bambang Susilo", email: "gm@demo.coalops", role: "GM", modules: ["READ"], lastSeen: "1 hr ago" },
  { id: "U003", name: "Hendra Hartono", email: "hse.head@demo.coalops", role: "Dept Head", modules: ["M0"], lastSeen: "5 min ago" },
  { id: "U004", name: "Sukarno Lim", email: "barging.head@demo.coalops", role: "Dept Head", modules: ["M1"], lastSeen: "12 min ago" },
  { id: "U005", name: "Maria Ulfa", email: "hauling.head@demo.coalops", role: "Dept Head", modules: ["M2"], lastSeen: "23 min ago" },
  { id: "U006", name: "Ir. Faisal R.", email: "mineop.coal@demo.coalops", role: "Dept Head", modules: ["M4"], lastSeen: "8 min ago" },
  { id: "U007", name: "Darto Suprapto", email: "mineop.ob@demo.coalops", role: "Dept Head", modules: ["M5"], lastSeen: "31 min ago" },
  { id: "U008", name: "Ir. Yani Suryani", email: "db.head@demo.coalops", role: "Dept Head", modules: ["M6"], lastSeen: "1 hr ago" },
  { id: "U009", name: "Jefri Tambunan", email: "landclear@demo.coalops", role: "Dept Head", modules: ["M7"], lastSeen: "2 hr ago" },
  { id: "U010", name: "Ir. Denny K.", email: "plant.head@demo.coalops", role: "Dept Head", modules: ["M8", "M9", "M10"], lastSeen: "6 min ago" },
  { id: "U011", name: "Linda Wang", email: "hr.head@demo.coalops", role: "Dept Head", modules: ["M11"], lastSeen: "1 hr ago" },
  { id: "U012", name: "Ir. Sugeng R.", email: "engineering@demo.coalops", role: "Dept Head", modules: ["M12"], lastSeen: "15 min ago" },
  { id: "U013", name: "Wawan Setiawan", email: "env.head@demo.coalops", role: "Dept Head", modules: ["M13"], lastSeen: "20 min ago" },
  { id: "U014", name: "Dr. Rika Maharani", email: "qc.head@demo.coalops", role: "Dept Head", modules: ["M14"], lastSeen: "9 min ago" },
  { id: "U015", name: "Yusuf Ali", email: "sales.head@demo.coalops", role: "Dept Head", modules: ["M15"], lastSeen: "3 min ago" },
  { id: "U016", name: "Hendrik Tan", email: "finance.head@demo.coalops", role: "Dept Head", modules: ["M16", "M17"], lastSeen: "7 min ago" },
];

const roleColor: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-700",
  GM: "bg-amber-100 text-amber-700",
  "Dept Head": "bg-blue-100 text-blue-700",
  Viewer: "bg-coal-100 text-coal-700",
};

export default function UsersPage() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3 max-w-[1400px] mx-auto">
      <header className="bg-white rounded-lg border border-coal-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Users size={18} className="text-amber-600" />
            {lang === "id" ? "Pengguna & Peran" : "Users & Roles"}
          </h1>
          <p className="text-xs text-coal-500 mt-1">
            {lang === "id"
              ? "Admin: kelola semua. GM: read-only semua + persetujuan. Dept Head: tulis hanya di modulnya. Viewer: read-only."
              : "Admin: manage all. GM: read-only all + approval. Dept Head: write only in their module(s). Viewer: read-only."}
          </p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded bg-amber-500 text-coal-950 font-semibold flex items-center gap-1">
          <Shield size={12} /> {lang === "id" ? "Pengguna Baru" : "New User"}
        </button>
      </header>

      <section className="bg-white rounded-lg border border-coal-200">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Nama" : "Name"}</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Peran" : "Role"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kepemilikan Modul" : "Module Ownership"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Terakhir Dilihat" : "Last seen"}</th>
                <th className="px-3 py-2 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{u.id}</td>
                  <td className="px-3 py-2 font-semibold">{u.name}</td>
                  <td className="px-3 py-2 font-mono text-coal-500">{u.email}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${roleColor[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-0.5">
                      {u.modules.map((m) => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-coal-500">{u.lastSeen}</td>
                  <td className="px-3 py-2">
                    <button className="p-1 hover:bg-coal-100 rounded" title="Reset">
                      <Key size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
