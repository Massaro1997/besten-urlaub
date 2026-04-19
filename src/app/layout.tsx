import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bester Urlaub — Die besten Urlaubsangebote",
  description: "Finde die besten Reiseangebote und Urlaubsschnäppchen. Direkt für dich gefunden.",
  icons: {
    icon: '/symbol.svg',
    apple: '/symbol.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Internal traffic exclusion — ?no-track=1 sets cookie, all trackers below skip when cookie present */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var qs = new URLSearchParams(window.location.search);
                  if (qs.get('no-track') === '1') {
                    document.cookie = 'bu_no_track=1;path=/;max-age=31536000;SameSite=Lax';
                  }
                  var skip = document.cookie.indexOf('bu_no_track=1') !== -1;
                  window.__buNoTrack = skip;
                  if (skip) {
                    window['ga-disable-G-ZHCHDK62PG'] = true;
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Lucky Orange — skip on internal traffic */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!window.__buNoTrack) {
                var lo = document.createElement('script');
                lo.async = true; lo.defer = true;
                lo.src = 'https://tools.luckyorange.com/core/lo.js?site-id=78eb497d';
                document.head.appendChild(lo);
              }
            `,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHCHDK62PG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZHCHDK62PG');
            `,
          }}
        />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!window.__buNoTrack) {
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                  var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                  ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                  ttq.load('D74KVVJC77U2583OHT0G');
                  ttq.page();
                }(window, document, 'ttq');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
