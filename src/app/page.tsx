import { Day } from "@/components/Day";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { MenuList } from "@/components/MenuList";
import { Navbar } from "@/components/Navbar";
import { Reviews } from "@/components/Reviews";
import { Ribbons } from "@/components/Ribbons";
import { Sky } from "@/components/Sky";
import { Story } from "@/components/Story";
import { Visit } from "@/components/Visit";
import { Window } from "@/components/Window";

export default function Home() {
  return (
    <>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to menu
      </a>
      <Intro />
      <Sky />
      {/* faint film grain over the whole page */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.06] mix-blend-multiply max-lg:hidden" />
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Ribbons />
        <Day />
        <MenuList />
        <Window />
        <Story />
        <Reviews />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
