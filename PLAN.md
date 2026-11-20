# PLAN — house-ui

**house-ui** is the one look and feel for Ken's web apps under `~/develop`:
AppConfig, kwicky, NestEgg, NetConfig, stocker, and every new one.
schematic-extract is not part of it and keeps its own styling.
It is an npm package of design tokens, CSS and React components that
each app depends on at a pinned version.

**How to use this file.** It records the plan as decided — nothing else.
Decisions are numbered **D-n** and are never renumbered; a changed decision is
edited in place. Open questions and pending work are in [TODO.md](TODO.md).
Implementation starts at the build order (§7).

---

## 1. Why

- **D-1** **Copies drift; a dependency does not.** Every app's `tokens.css`
  descends from stocker's (stocker → NetConfig → AppConfig → NestEgg), copied
  by hand with a `SOURCE:` comment. Each copy then changed on its own. As of
  2026-11-18 the five apps use three page layouts (sidebar, top nav, plain
  header), three status-label vocabularies (`.chip-*`, `.badge--*`,
  `.status-badge`), two modal structures, and only two of five have a dark
  theme. house-ui replaces the copies with one source.

## 2. What house-ui is

- **D-2** **One repo, one package.** `~/develop/house-ui`, GitHub
  `kenjabber/house-ui`, npm package name `house-ui`. Peer dependencies:
  `react` and `react-dom` ^19 (every app is React 19 + Vite 6).
- **D-3** **Apps pin a version.** An app's `package.json` names an exact
  tagged release (`vMAJOR.MINOR.PATCH`). Upgrading is a deliberate change in
  that app — bump the pin, check the app, commit — never automatic. No app
  keeps a copy of any house-ui file.
- **D-4** **A release is an `npm pack` tarball on the GitHub Release.**
  Components are written in TypeScript and built to `dist/` (JS + `.d.ts` +
  CSS). `release.sh` builds, runs `npm pack`, tags `vX.Y.Z`, pushes, and
  uploads `house-ui-X.Y.Z.tgz` to that tag's GitHub Release. Apps pin the
  asset's URL
  (`https://github.com/kenjabber/house-ui/releases/download/vX.Y.Z/house-ui-X.Y.Z.tgz`),
  so installing needs no build step and no git. `dist/` is never committed.
  Not the tag's `/archive/` tarball: GitHub does not promise those bytes stay
  the same, and a changed byte fails the lockfile's integrity check in
  `npm ci`.
- **D-5** **Local development uses `npm link`.** To change house-ui while
  working in an app, link the app to the working copy and run
  `npm run watch` in house-ui (the link resolves to `dist/`). Each app's `vite.config.ts` has
  `resolve.dedupe: ['react', 'react-dom']`, or the linked package loads a
  second React and hooks fail. Unlink and pin a release before the app's
  change is committed.
- **D-20** **The package's shape.** One stylesheet, `house-ui/house-ui.css`
  (tokens, base, every component), imported once in the app's `main.tsx`
  before the app's own CSS; component JS does not import CSS. `package.json`
  has an `exports` map (`.` for the components, `./house-ui.css`),
  `"sideEffects": ["*.css"]`, `bin` for `house-ui-check`, and a `files` list
  of `dist/`, `bin/` and `STYLEGUIDE.md` only (the kitchen sink is not
  shipped).
- **D-21** **The GitHub repo is public from v1.0.0.** Apps are built in
  Docker on the servers, where `npm ci` downloads the pinned release file;
  a private repo's file needs a token in every build (a vault item, an
  AppConfig build-secret feature, a download step in each Dockerfile, and
  renewal). house-ui holds only styling and generic components, nothing
  about the network or its data, so it is public and the download needs no
  credentials. It was private until `v1.0.0` and made public on 2026-11-18,
  just before that release. Never put a secret, hostname or address in this
  repo; commits use Ken's GitHub noreply email (set in the repo's git
  config), not his own address.

## 3. What is in it

- **D-6** **Tokens: AppConfig's as the base.** `tokens.css` starts from
  AppConfig's: palette, the semantic layer (`--surface-*`, `--text-*`,
  `--accent*`, `--danger*`, `--chip-*`, `--diff-*`) and the dark theme.
  **Palette tokens (`--color-*`) are house-ui's own;** app CSS uses semantic
  tokens only, so the dark theme only has to redefine the semantic layer.
  The one exception is the app's `app-tokens.css` (D-12).
- **D-7** **Light and dark in every app**, following
  `prefers-color-scheme`, from the tokens alone. The dark semantic layer
  applies in two cases: `:root:not([data-theme="light"])` inside
  `@media (prefers-color-scheme: dark)`, and `[data-theme="dark"]` on any
  element. `[data-theme="light"]` on any element gives the light layer back. So a subtree can be
  forced to one theme (the kitchen sink's side-by-side panels, D-14) and an
  app can add a theme switch later without touching house-ui.
- **D-8** **Classes are prefixed `hu-`** (`.hu-btn`, `.hu-chip--ok`), so an app
  can adopt house-ui one screen at a time without its old `.btn` / `.modal`
  rules colliding with the new ones.
- **D-19** **All of house-ui's CSS is in `@layer house-ui`.** Unlayered app
  CSS beats layered CSS whatever its specificity, so `base.css`'s element
  defaults (body, headings, links) do not restyle screens that have not moved
  yet, and an app never needs `!important` or doubled selectors to win.
  Tokens are custom properties on `:root`, so layering does not hide them.
  The other side of this: an app's own global element rules (`* { padding:
  0 }`, `button { … }`, `input { … }`, which every app has today) beat
  house-ui's classes too, so they go in the retrofit and `house-ui-check`
  flags them (D-17).
- **D-9** **Components** (React, each with its CSS):
  - `AppShell` — the sidebar layout of D-10, with a main header slot
    (`headerRight` for the user menu).
  - `Sidebar`, `SidebarLink` (icon, label, optional badge count).
  - `PageHead` (title, subtitle, actions).
  - `Card` (head, body, actions).
  - `Button` — `primary`, `secondary`, `danger`, `ghost`, `link`; `sm`;
    `icon`.
  - `Chip` — `ok`, `warn`, `bad`, `info`, `neutral` (D-11).
  - `Table` + `TableWrap`, and `TableFilter` (kwicky's filter bar, chips and
    count).
  - `Modal` (header, body, footer; `wide`), dynamic-viewport aware.
  - Form pieces: `Field` (label, help, error), `FormGrid`, and styled native
    inputs/selects/textareas meeting the 44 px touch target and 16 px input
    text from the current tokens.
  - `base.css` — element defaults: body, headings, links, `code`/`pre`,
    focus ring, scrollbars.
  - Added in v1.1 (TODO 6, pieces two or more apps had): `UserMenu` and
    `MenuItem`, `Tabs` and `TabPanel`, `InfoButton`, `Banner`, `Loading`,
    `ConfirmButton`, `Facts`, the header icons (`GearIcon`, `PersonIcon`,
    `MenuIcon`, `PlusIcon`), and for the sidebar's lower area
    `SidebarSection`, `SidebarItem`, `SidebarAction`.
- **D-10** **Layout: the sidebar shell.** NetConfig's and kwicky's (their
  CSS is identical): dark sidebar 240 px wide, collapsing to 56 px icons, main
  area with a header and its own scroll. When the shell is 980 px wide or
  less (a container query on the shell, so the kitchen sink can show it in a
  narrow frame; `--bp-compact` holds the value, written as a number because a
  custom property cannot be used in a query) the sidebar becomes an overlay
  opened from the header. The header's title is the section's name, not a
  heading; the page's h1 is its `PageHead`. The sidebar takes any content below its links.
  The sidebar's lower area (`below`) holds lists as `SidebarSection`s of
  `SidebarItem`s; the links keep their height and that area scrolls. Apps on
  a top nav (AppConfig, NestEgg) move to it. stocker's scenario pane
  (`.ticker-explorer`, today a collapsible dark column beside a
  `main-header`) goes in the sidebar's lower area, under its links, as a
  `SidebarSection`; kwicky's site tree goes there too.
- **D-11** **One status vocabulary: the five chip kinds.** `.badge--*` and
  `.status-badge` are retired; each app maps its own states onto `ok`,
  `warn`, `bad`, `info`, `neutral` in its retrofit.
- **D-12** **Two apps make it shared.** A token or component used by two or
  more apps belongs in house-ui. One used by one app stays in that app, as a
  semantic token named `--app-*` (stocker's buy/sell/SMA colours) defined in
  the app's own `app-tokens.css` for light and dark (the selectors of D-7).
  `app-tokens.css` is the only app file that may use palette tokens: an
  `--app-*` value is a `var(--color-*)`, or a literal when the palette has no
  match. `house-ui-check` skips that file (D-17).

## 4. The documentation

- **D-13** **`STYLEGUIDE.md`** — each component: when to use it, its props, a
  usage snippet; the token names by role; the rules of D-6, D-7 (the
  `data-theme` selectors), D-8, D-11, D-12, D-19; how an app installs it
  (D-20, and D-5 for `npm link`).
- **D-14** **A kitchen-sink page** (`npm run dev` in house-ui) shows every
  component in every variant, light and dark side by side. It is how a change
  to house-ui is checked by eye, and every new component appears on it.

## 5. Keeping apps on it

- **D-15** **Each app's `CLAUDE.md` has a "Look and feel" section:**

  > The UI uses **house-ui** (`~/develop/house-ui`, pinned in
  > `frontend/package.json`). Read its `STYLEGUIDE.md` before writing UI.
  > Use its components and semantic tokens; write no colour, font, font size
  > or shadow literals, and no palette (`--color-*`) tokens. A style only this
  > app needs is an `--app-*` token in `app-tokens.css`, the one file where
  > palette tokens (and, if the palette lacks the colour, a literal) are
  > allowed. If house-ui lacks
  > something two apps would use, add it to house-ui (or its `TODO.md`)
  > instead of styling it here. `npm test` runs `house-ui-check`.

- **D-16** **Ken's user-level `~/.claude/CLAUDE.md` carries the same rule in
  short**, so a new app follows it from its first commit.
- **D-17** **`house-ui-check`** — a dependency-free Node script shipped as the
  package's `bin`. Given an app's `frontend/src`, it reports `file:line:
  problem` for: hex/`rgb()`/`hsl()` colour literals, font sizes and shadows
  not from tokens, `--color-*` uses and definitions, inline `style` and SVG
  `fill`/`stroke` colours in TSX, rules that redefine `hu-` classes, and
  global element rules (D-19). It skips `app-tokens.css` (D-12) and tests. Exit 0 and
  no output when clean. Each app runs it from `npm test`
  (`"test": "house-ui-check src && vitest run"`), so the working agreement's
  test step catches drift. Its own tests are fixture files, one per problem
  it reports plus a clean one and an `app-tokens.css`, run with vitest in
  house-ui's `npm test`.

## 6. Changing house-ui

- **D-18** **A change is made in house-ui first**: component and CSS, the
  kitchen sink, `STYLEGUIDE.md`, a release. Then each app that wants it bumps
  its pin. Breaking changes (renamed class, removed prop or token) bump the
  major version.
- **D-22** **A fill page is full width and its table hugs its rows**
  (2026-11-19, Ken; v1.9.0, v1.10.0). `--page-max-width` (1200px, from the
  first commit with no recorded reason) keeps a page of cards and text to
  a readable column; a `Page fill` — a list page, or a card that fills the
  page — takes the main area's full width, since a wide table capped at
  1200px scrolls sideways on a screen that has room for it. A
  `TableWrap fill` is as tall as its rows (a short list stops after its
  last row), grows with them to the bottom of the page, then scrolls
  inside; it never stretches an empty frame to the bottom.
- **D-23** **The "?" is a superscript** (2026-11-19, Ken; v1.12.0). The
  InfoButton was a 1.5rem circle with a base-size "?", centred on its
  title's line, as loud as the title. It is now `--text-xs` in a 1rem
  circle, raised by a relative offset (`top: -0.45em`, which works in a
  flex row and in running text alike), for every disclosure button; on
  a coarse pointer an invisible `::after` keeps the target
  `--touch-target-min` wide.
- **D-24** **A tab's underline lines up with its label** (2026-11-19, Ken;
  v1.13.0). It was the button's bottom border, so it ran 0.8rem past the
  text on each side and stopped short of a tab's "?" (outside the button).
  It is now a 2px line drawn under the label only — the text, and on a tab
  with `info` the text and its "?" (`--info-size`) — so its ends meet the
  ends of what it marks. `PanelTabs` keep their joined-panel look.

## 7. Build order

1. Repo, package skeleton with the shape of D-20, `tokens.css` (D-6, D-7),
   `base.css`, all in `@layer house-ui` (D-19).
2. Components of D-9, each added to the kitchen sink (D-14) as it lands.
3. `house-ui-check` (D-17) with its fixture tests, then run against the
   current apps (it should flag what §1 found).
4. `STYLEGUIDE.md` (D-13), `release.sh` (D-4), make the repo public
   (D-21), release `v1.0.0`.
5. Retrofit, one app per item in that app's backlog, in this order:
   NestEgg (AppConfig's tokens already), AppConfig, kwicky, NetConfig,
   stocker. Each retrofit: pin house-ui, add the `resolve.dedupe` of D-5,
   import `house-ui.css` (D-20), move to `AppShell`,
   replace the app's copies of shared pieces, map statuses (D-11), move
   app-only styles to `app-tokens.css` (D-12), delete the old `tokens.css`,
   add the CLAUDE.md section (D-15), make `house-ui-check` pass.
