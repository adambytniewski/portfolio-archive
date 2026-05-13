# Adam Bytniewski — Personal Archive (Vol. 01)

Drugie portfolio, kompletnie inne charakterem od `portfolio-adam`. Brutalist editorial-magazine z interaktywnym **force-directed knowledge graph** jako sercem strony. Stack: **Next.js 15 + React 19 + GSAP + d3-force + Lenis + Tailwind**.

> Treści współdzielone z `portfolio-adam` (te same `content/*.json`), ale interpretacja wizualna jest absolutnie różna — żadne shadery, ciepłe paper-tone, monumentalna typografia, drag-and-drop physics graf, scrapbook polaroidy, kursor crosshair.

---

## Uruchomienie

```bash
cd portfolio-archive
npm install
npm run dev
```

Strona startuje na `http://localhost:3036`.

---

## Sekcje

| #   | Sekcja            | O co chodzi                                                                                   |
| --- | ----------------- | --------------------------------------------------------------------------------------------- |
| 01  | Issue Cover       | Magazine cover — masthead, SVG portret z czerwoną koszulką, big "BUILDS WITH AI", barcode    |
| —   | Live Ticker       | Czarny pasek scrolling marquee — status, focus, kawa, listening, lokalizacja                  |
| 02  | Manifest          | Drop-cap editorial paragraph + pull quote + 4 zasady w gridzie                                |
| 03  | The Network ⭐    | Interactive force-directed graph — drag any node, click to pin, filter by category            |
| 04  | Archive Index     | Brutalist sortable table — wszystkie projekty, hover ujawnia floating polaroid preview        |
| 05  | Folio             | 4 polaroid scrapbook karty z taśmą i odręcznymi annotacjami                                   |
| 06  | Field Notes       | Dziennik pracowni — wpisy ze stempelkiem LATEST, notebook paper z marginesem                  |
| 07  | Colophon          | Dark contact section — duży email z click-to-copy, imprint grid, big "ADAM B." wordmark      |

---

## Jak dodawać nowe rzeczy (co 2 dni)

```bash
npm run add:now    # interaktywny CLI dla wpisu Field Notes
npm run add:work   # interaktywny CLI dla projektu portfolio
```

Lub edytuj bezpośrednio:

- `content/now.json` — Field Notes (najnowszy na górze)
- `content/work.json` — projekty (pojawiają się w Network grafie + Archive Index)
- `content/skills.json` — skille
- `content/profile.json` — name, email, status, social

> Wszystkie zmiany są live od razu. Projekty automatycznie pojawiają się jako węzły w grafie.

---

## Knowledge Network — jak działa

- 8 projekty + 6 category hubs + 10 skill nodes + 28 edges
- d3-force fizyka (link, charge, collide, center, x/y forces)
- Drag node — przesuwasz fizycznie. Network się reorganizuje.
- Click node — pin/unpin (active state)
- Hover — pokazuje powiązania (czerwone linie do connected nodes)
- Filter — kategoryzuje, dimmed nodes są szare
- Canvas-based draw (60fps), DPR-aware, auto-resize

---

## Stack różny od portfolio-adam

| portfolio-adam (cinematic-dark)    | portfolio-archive (editorial-paper)        |
| ---------------------------------- | ------------------------------------------ |
| GLSL shader background w Hero      | SVG portrait + halftone bg + grain overlay |
| Fraunces serif display             | Space Grotesk sans display                 |
| Magnetic dot+ring cursor           | Crosshair + label + hairlines cursor       |
| Iris-out preloader                 | Magazine-cover splitter preloader          |
| Black bg                           | Paper #ece8de bg                           |
| Smooth cinematic scroll narrative  | Sortable archive table + interactive graph |

Ten sam content, dwie zupełnie różne dusze.

---

## Domena

Push na GitHub → vercel.com/new → import repo → deploy. Settings → Domains → "Add domain" → wklej rekordy DNS u rejestratora (OVH, home.pl, Cloudflare). SSL automatycznie.

---

## Notatki

- Lokalnie fonty Google Fonts mogą się nie pobrać przez SSL (cert env Windows) — fallbacki systemowe wystarczą do dev. Na Vercelu w produkcji wszystko zaciągnie się normalnie.
- React Strict Mode w dev. Dlatego reveal-animacje używają data-attribute + IntersectionObserver zamiast GSAP delayed tweens — sidesteps strict-mode tween-revert race.
- Prefers-reduced-motion: szanowany w Lenis i CSS animations.
