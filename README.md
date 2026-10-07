# Ember & Oak — café landing page

A sample landing page for a fictional Portland café, part of the `landing-pages` portfolio set.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion (`motion/react`), Lucide icons.

```bash
pnpm install
pnpm dev
```

## Concept: one day at the café

Scrolling the page walks through a day from 6am to 6pm.

- **Palette:** four colors. Paper `#FFFCF7` and oat `#F5EEE3` alternate section by section, with ink `#2B2521` for type and sun orange `#F26B2A` as the single accent (the sun, times, stars and the main button). Tokens live in `src/app/globals.css`.
- **Sky:** a fixed layer behind the page blends between paper and oat as you scroll. Each section declares its tone with `data-sky` (`components/Sky.tsx`).
- **Sun:** a soft orange glow arcs across the page and sets before the Visit section.
- **Live clock:** the nav shows the real time in Portland (`cafe.timeZone` in `src/lib/data.ts`), with a sun or moon for the hour and whether the café is open. The hero's open status and the "Today" row in the hours table use the same Portland time (`src/lib/useCafeClock.ts`).
- **Type:** Bricolage Grotesque, using its optical-size axis for the large headlines.

## Sections

| Section | Hour | What moves |
| --- | --- | --- |
| Hero | Dawn | Headline springs in letter by letter; three photos float at different depths with the scroll and the pointer, and tilt on hover |
| Ribbons | | Two crossing infinite sliders (farms and the café's rhythm) that slow on hover |
| Our day | Morning | Pinned horizontal scroll through six moments, with a live clock and progress bar (swipe row on phones) |
| Menu | Noon | Tabbed list; hovering a dish shows its photo trailing the cursor (thumbnails on touch) |
| Pull up a chair | | A café photo opens from an inset window to full screen as you scroll (pinned on desktop) |
| Story | Afternoon | Sticky photo that opens like the sun from behind a cloud; chapters slide in |
| Reviews | Golden hour | Number ticker heading; pinned-note cards that tilt toward the cursor |
| Visit | Evening | Hours, map and the booking form |

## Polish, from award-winning café sites

References: [Escape Coffee](https://www.awwwards.com/sites/escape-coffee) (Awwwards Site of the Day), [Assembly Specialty Coffee](https://www.awwwards.com/sites/assembly-specialty-coffee), [Verve Coffee Roasters](https://www.awwwards.com/sites/verve-coffee-roasters), and D.E Café and Passalacqua from [Orpetron's roundup](https://orpetron.com/blog/10-award-winning-hotel-restaurant-websites-you-shouldnt-miss/).

- **Intro curtain** (`Intro.tsx`): a sun rises over a horizon line and the wordmark slides up, then the screen lifts. It shows once per session; an inline script in `layout.tsx` hides it before first paint for repeat visits and reduced motion. A click or any key skips it, and the hero's entrance waits for it.
- **Smooth scrolling** with [Lenis](https://lenis.darkroom.engineering) on mouse and trackpad; touch keeps native scrolling, and reduced motion turns smoothing off.
- **Full-bleed window** (`Window.tsx`), described in the table above.
- **Rolling button labels** (`RollLink.tsx`): the label slides up and a copy rolls in on hover.
- **Spinning stamp** on the hero photos, like the sticker on a retail bag.
- **Rolling clock digits** in the nav.
- **Film grain** over the page on desktop.

## Components from 21st.dev

Free components, adapted in `src/components/ui/`:

- From [Motion Primitives](https://motion-primitives.com) by ibelick (MIT, listed free on 21st.dev): `magnetic`, `text-effect`, `infinite-slider`, `tilt`, `text-roll`, `in-view`, `spinning-text`, `sliding-number`
- Local fixes to those, marked `local change` in the source: touch taps ignored in `tilt` and `magnetic`, measurement-free digits in `sliding-number` (it used to render blank until a ResizeObserver fired), and spans instead of divs so it can sit inside text
- From 21st.dev directly: `number-ticker` ([dillionverma](https://21st.dev/@dillionverma/components/number-ticker))

The Motion Primitives components come from its public registry, which doesn't count against 21st.dev's daily download limit.

The menu's hover preview and the pinned "Our day" gallery follow 21st.dev's popular "Hover Image List" and "Horizontal Scroll Gallery" patterns.

Run `npx @21st-dev/cli review src` to check UI rules. Design context for the 21st CLI is in `.21st/`.

## Accessibility and fallbacks

- `prefers-reduced-motion` turns off parallax, pinning, tilt, magnetic pull and the sliders. The sky still changes color.
- Without JavaScript, a `<noscript>` rule paints each section's own sky and shows every element in its final state.
- Animated headlines keep their text for screen readers; decorative motion is `aria-hidden`.

## On phones

- "Our day" becomes a swipe row with its own progress bar and clock; pinning is desktop only.
- Hero photos drift less with the scroll so they never slide over the headline.
- Tilt, magnetic pull, the menu's cursor preview and hover-to-pause only respond to a real mouse or trackpad (`src/lib/pointer.ts`). Taps on a phone used to leave cards stuck tilted.
- The sun uses `svh` units so it doesn't jump when the address bar slides in or out, and the sky re-measures on resize.
- `main` and the footer use `overflow-x: clip`, so entrance animations can't cause sideways scrolling, and the sticky story photo keeps working.
- Checked at 320px and 375px: no sideways overflow or clipped text, and every tap target is at least 44px.

## Editing content

All copy, prices, hours, the day's moments, farms and photos are in `src/lib/data.ts`.

## Notes

- The booking form validates in the browser but doesn't send anything yet.
- Anything based on the current time renders after hydration, so the server and browser never disagree.
