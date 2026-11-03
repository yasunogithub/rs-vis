import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '葉山町予算ビュー',
  description: '葉山町の予算と決算を公表資料から可視化する非公式サイト',
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
