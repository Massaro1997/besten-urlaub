import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Besten Urlaub — Die besten Urlaubsangebote",
  description: "Finde die besten Reiseangebote und Urlaubsschnäppchen. Direkt für dich gefunden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
