# Grids week: talking points from the form-systems build

```json
{
  "course": "INST408V",
  "week": "Grids",
  "captured": "2026-09-30",
  "goes_with": "/workspace/form-systems/index.html",
  "status": "working notes, not student-facing"
}
```

Each point is marked **checked** (confirmed against a live source on 2026-09-30) or **unchecked** (general knowledge or Alex's own observation; confirm before putting on a slide).

## Where this sits on the attention ladder

Grids week adds **position and alignment** as the lever for directing the eye. The demo holds the form and its grid constant while color, type and shape change from tab to tab, so students can see which variable is doing the work in each one.

## 1. The same grid can carry very different characters

- USWDS and Bootstrap both use a 12-column grid with near-identical ideas under different class names (`grid-col-6` vs `col-md-6`). Demo: swap between those two tabs. **Checked.**
- Bootstrap and Spotify-style share identical markup and grid classes; only the stylesheet differs. You can only tell it is Bootstrap by reading the class names. Demo: swap between those two tabs.
- Material changes column count with window width: 4 compact, 8 medium and expanded, 12 large and extra-large; margins 16 then 24. Demo: the phone and desktop chips on the Material tab. **Checked** against m3.material.io. The gutter width between columns is not published; the demo uses 16 and 24.
- Material's "Material Studies" (Fortnightly, Rally, Basil, Shrine, Crane, Reply, Owl) are fictional apps built to show one system taking on different characters through grid and type. On the archived Material 2 site. **Unchecked.**

## 1a. Apple: a module instead of columns

- Apple's layout guidance specifies safe areas, layout guides (standard margins, readable text width), two size classes (compact and regular) and alignment as a principle. It gives no column count, gutter or spans for iPhone or iPad. The only "Grids" heading is under tvOS. **Checked** against Apple's layout page.
- The implied grid is a module, closer to Vignelli's Unigrid than to a column system: Apple's minimum touch target is 44 points and body text sits on a 22-point line, so one row is a line of text with 11 points of padding above and below (11 + 22 + 11 = 44). **Unchecked** (the 44 and 17/22 figures are from general knowledge).
- The module governs size, not position. Demo: the Apple tab uses Apple's real control sizes, and "Show grids" lays 44-point graph paper over it and marks each control. Fields and list rows are exactly one module tall; the segmented control (32), the buttons (50) and the text area miss. Positions drift off the lines because the title, labels and gaps are not multiples of 44.
- Caveat for class: the control sizes are Apple's, but the gaps between controls are my approximation of an iOS grouped list, so the drift in positions is illustrative, not a measurement of a real iPhone screen.

## 2. "Free" gets expensive to leave

People build on a free framework, and then migrating off it, or even staying current on it, costs real work.

- **Material on Android.** Google's May 2026 post "Material Android is Compose-first" puts the older Views library in maintenance mode; new features arrive only in Jetpack Compose (Kotlin). **Checked.**
- **Material on the web.** The Material Web components are "in maintenance mode pending new maintainers" per the project README. Material's spacing tokens are listed as available for Compose and unavailable for Web. **Checked.**
- **Bootstrap.** Grid class names changed between major versions (`col-xs-6` in version 3 became `col-6` in version 4 and later), so staying on the free option still meant rewriting markup. **Unchecked.**
- **In the demo.** `css/spotify-style.css` is commented in three parts: Bootstrap's variables (cheap to change), page chrome, and the controls, where Bootstrap hard-codes its blue and each one has to be overridden by hand.

## 3. Spotify and Bootstrap

- Archived copies of spotify.com from June 2014, 2015 and 2016 use Bootstrap 3 grid class names (`col-xs-6`, `col-sm-4`, `col-md-8`). The word "bootstrap" does not appear, since it was compiled into `spotify.css`. Strong circumstantial evidence, marketing site only. **Checked** via the Wayback Machine: https://web.archive.org/web/20150601000000/https://www.spotify.com/us/
- Spotify could not have started from Material: Spotify launched in 2008, Material was announced in 2014. **Unchecked.**
- Spotify now runs its own design system, Encore. Its desktop app is a web interface inside embedded Chromium (the Chromium Embedded Framework, not Electron). **Unchecked.**

## 4. Web app to Electron to web view

- The usual first pass for a startup is a web app (React or similar), not Electron. Electron wraps that same web code when an installable desktop app is needed.
- Electron is desktop-only. On phones the equivalents are React Native, Flutter, or a web view in a thin native shell.
- Electron is not only an MVP stage: VS Code, Slack, Discord, Figma desktop and Notion are long-lived Electron products.
- Compose code cannot run in Electron. For an Electron app, Material means the guidelines, the aging Material Web components, and hand-written CSS for everything else (the app bar, window and grid in the demo are all hand-written).
- All **unchecked** general knowledge.

## 5. Alex's observations to develop

- Material 3 presents itself as neutral while its baseline scheme is heavily lavender, which reads as gendered. In the demo, all of that lavender comes from one block of color roles at the top of `css/material.css`.
- Business-model framing: Apple is a hardware house with about a third of its business now in services, built up since 2014; Google sells ads in return for running the web; Meta sells ads against content and social spaces. Platform owners fund native toolkits to make their platform attractive; the web is the one target no single company controls.
- The "neutral" system is fully supported on one platform only (Android).

## 6. Where to watch for industry updates

- Stack Overflow Developer Survey, State of JS (desktop and mobile frameworks section), JetBrains State of Developer Ecosystem.
- Google I/O (May), Apple WWDC (June), Microsoft Build.
- The Electron blog: electronjs.org/blog
- MDN "Baseline" labels and the annual Interop project, for which web features work everywhere.
- The EU Digital Markets Act and what it forces Apple to open up on iPhone.
- Kotlin Multiplatform and Compose Multiplatform (JetBrains), the route by which Compose could reach beyond Android.

## Open threads

- A Material tab in the manner of Fortnightly or Rally (different grid and typeface, same components), offered but not built.
- The Material: Midnight tab was removed; the Spotify-style tab makes the reskin point.
