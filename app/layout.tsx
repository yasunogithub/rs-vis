import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = '葉山町予算ビュー｜予算と決算を、わかりやすく';
const description = '葉山町の予算と決算、お金の流れや事業を公開資料からわかりやすく見る非公式サイトです。';
const image = { url: '/ogp-hayama.png', width: 1200, height: 630, alt: '葉山町予算ビュー。予算と決算をわかりやすく伝える非公式サイト。' };

export const metadata: Metadata = {
  metadataBase: new URL('https://budget.hayama.town'),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'ja_JP', siteName: '葉山町予算ビュー', title, description, url: '/', images: [image] },
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
