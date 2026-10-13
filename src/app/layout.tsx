import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AdInjector } from "@/components/ads/ad-injector";
import { PatternsProvider } from "@/context/PatternsContext";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PatternsProvider>
      <Navigation />
      <main className="flex-1">{children}</main>
      <AdInjector />
      <Footer />
    </PatternsProvider>
  );
}