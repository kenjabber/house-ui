# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 18 | [A sign-in page layout](#18-a-sign-in-page-layout) | ready to start |
| 19 | [An icon on SidebarItem](#19-an-icon-on-sidebaritem) | ready to start |
| 20 | [A table detail row](#20-a-table-detail-row) | ready to start |

Next number: **21**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 18. A sign-in page layout

Every app has passkey sign-in and register pages of the same shape: a centred
card (at most ~360px wide) on the body surface with an h1, a muted subtitle,
a form (a column with a gap, the submit button full width), an error Banner
and a muted, centred footer line (a link to register or sign in), with
padding that respects the safe-area top. NetConfig styles it itself
(`~/develop/netconfig/frontend/src/App.css` `.auth-*`) and kwicky
(`~/develop/kwicky/frontend/src/pages/LoginPage.tsx`, `RegisterPage.tsx`,
kwicky TODO 7) needs the same.

**Done when:** an `AuthPage` component (`title`, `subtitle`, `error`,
`onSubmit`, `footer`, children) renders that page, with a test, on the
kitchen sink and in STYLEGUIDE.md, released.

## 19. An icon on SidebarItem

kwicky's site tree shows a folder or page icon on each row. `SidebarItem`
takes no icon, so the app would style its own.

**Done when:** `SidebarItem` takes `icon` like `SidebarLink`: an inline SVG
before the label, about 1rem, slightly dimmed, in the row's colour (so it
reads on the active row too); with a test, on the kitchen sink and in
STYLEGUIDE.md, released.

## 20. A table detail row

kwicky Settings → Access opens a page's editor in a row right under the
clicked row (`<tr><td colSpan=4>`). house-ui has no style for such a row: it
would get the hover highlight and the pointer, and not read as part of the
selected row above it.

**Done when:** a detail row (`TableDetailRow`, class `hu-row--detail`) has
the panel surface, no hover highlight, a default cursor, and reads as
attached to the selected row above it; with a test, on the kitchen sink (both
themes) and in STYLEGUIDE.md, released.
