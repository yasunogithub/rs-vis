import type { Metadata, Viewport } from "next";
import "./globals.css";

import { title, description, image, openGraph } from './lib/hayama/metadata';

export const metadata: Metadata = {
  metadataBase: new URL('https://budget.hayama.town'),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph,
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2aa693",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
