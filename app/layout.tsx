import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AgeGate } from "@/components/age-gate";
import { APP_ICON_PATH, MANIFEST_PATH } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Her Own – Premium intimate wellness for women",
  description:
    "Stronger pleasure. Deeper body awareness. Total control. Clinically tested products. Discreet delivery. Over 10,000 women trust Her Own.",
  keywords: ["intimate wellness", "self-care", "women's wellness", "discreet shipping"],
  openGraph: {
    title: "Her Own – Premium intimate wellness for women",
    description: "Clinically tested products. Discreet delivery. Free shipping $69+.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F8E1E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link rel="manifest" href={MANIFEST_PATH} />
        <link rel="apple-touch-icon" href={APP_ICON_PATH} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Her Own",
              description: "Where body answers to you. Intimate wellness products.",
              url: "https://herown.com",
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-white text-text">
        <AgeGate />
        {children}
      </body>
    </html>
  );
}
