"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import type { Lang } from "@/lib/types";

const dicts: Record<Lang, Record<string, any>> = { en, id };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
    if (saved === "en" || saved === "id") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch {
      /* noop */
    }
  }

  const t = useMemo(() => {
    return (path: string) => {
      const parts = path.split(".");
      let cur: any = dicts[lang];
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in cur) cur = cur[p];
        else return path;
      }
      return typeof cur === "string" ? cur : path;
    };
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
