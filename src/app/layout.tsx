import type { Metadata } from "next";
import { Inter, Lora, DM_Mono, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CapyFi | User Feedback Dashboard",
  description:
    "Monitor and analyze real-time user feedback for CapyFi — the next-generation fintech platform.",
  keywords: ["fintech", "feedback", "dashboard", "analytics", "CapyFi"],
  authors: [{ name: "CapyFi Team" }],
  openGraph: {
    title: "CapyFi Feedback Dashboard",
    description: "Real-time user feedback analytics for CapyFi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${syne.variable} ${lora.variable} ${dmMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
