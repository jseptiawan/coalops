import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { PeriodProvider } from "@/lib/period";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "CoalOps – Coal Mining Production Monitor",
  description: "Backward Tracing from Load to Barge – Bilingual mining production dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <PeriodProvider>
            <AppShell>{children}</AppShell>
          </PeriodProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
