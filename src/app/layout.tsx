import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  title: "Ember & Oak Coffee, a Portland café from sunrise to six",
  description:
    "A downtown Portland café that roasts its own coffee and bakes every morning. Croissants at 6:30, doors at 7, last call at 5:30.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <head>
        {/* runs before first paint: skip the intro curtain on repeat visits and for reduced motion */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('eo-intro-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-seen')}catch(e){}`,
          }}
        />
        {/* without JavaScript: no intro, animated elements in their final state, each section's own sky */}
        <noscript>
          <style>{`#intro{display:none}[style*="transform"]{transform:none!important}[style*="opacity"]{opacity:1!important}[style*="clip-path"]{clip-path:none!important}[data-sky]{background-color:var(--sky)}`}</style>
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
