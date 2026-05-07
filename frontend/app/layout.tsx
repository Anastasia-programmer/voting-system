import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header, Footer } from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "SecureVote — Cryptographic E-Voting",
  description:
    "A futuristic electronic voting system based on RSA, blind signatures, and an anonymizer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jbmono.variable}`}>
      <body className="relative min-h-screen flex flex-col font-sans">
        {/* Cyber grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 grid-backdrop"
        />
        {/* Aurora glows */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh]"
          style={{
            background:
              "radial-gradient(900px 400px at 20% 0%, rgba(59,80,255,.18), transparent 60%), radial-gradient(700px 350px at 85% 10%, rgba(139,92,246,.16), transparent 60%)",
          }}
        />

        <ToastProvider>
          <Header />
          <main className="relative flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
