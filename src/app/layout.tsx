import type { Metadata, Viewport } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ToastProviderWrapper } from "@/components/providers/ToastProvider";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LoclSpots — Gespräche, die verbinden",
  description:
    "Die Community für Menschen 30+. Thematische Chatrooms, Collabs, echte Verbindungen.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${lora.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen bg-light font-sans text-base text-text antialiased">
        <ToastProviderWrapper>{children}</ToastProviderWrapper>
      </body>
    </html>
  );
}
