import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hato Daily | Heartopia dailies",
  description:
    "Heartopia daily discoveries, community looks, village photos, and house-build tutorials.",
  appleWebApp: {
    capable: true,
    title: "Hato Daily",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/hato-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8e4e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
