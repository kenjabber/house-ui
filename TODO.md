# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 10 | [Facts: skip empty items](#10-facts-skip-empty-items) | ready to start |
| 11 | [Tabs that own a panel](#11-tabs-that-own-a-panel) | idea |
| 12 | [DiffView](#12-diffview) | idea |

Next number: **13**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 10. Facts: skip empty items

Conditional rows (a temperature only on a Pi, host parts only when there
are some) need spreads with casts:
`...(x ? [["label", v] as [string, ReactNode]] : [])`. If `items` accepted
`null`, `false` and `undefined` entries and skipped them, the call would be
`x && ["label", v]`.

**Done when:** `Facts` skips falsy entries, with a test.

## 11. Tabs that own a panel

AppConfig's Edges page and NetConfig use a tab strip that sits on its
panel: the active tab joins the bordered panel below, so every control
inside visibly belongs to that tab (NetConfig's rule). house-ui's `Tabs` is
the underlined settings style only, so AppConfig keeps `.tab-strip`, `.tab`,
`.tab--active` and `.tab-panel` in its own CSS (TODO 28 kept them). Two apps
use it, so it belongs here (D-12).

**Done when:** `Tabs` has a variant (or a `PanelTabs` component) with the
joined panel, keyboard handling as `Tabs` has, on the kitchen sink; then
AppConfig's copy goes.

## 12. DiffView

`--diff-*` tokens are house-ui's, but each app colours its own unified diff:
AppConfig's `DiffView` (edge Caddyfile, `components/ui.tsx`) and
NetConfig's compile diffs. A `DiffView` component (`+`/`-`/`@@` lines
coloured, lines spanning the scroll width) would be the shared one.

**Done when:** house-ui exports `DiffView`, on the kitchen sink, and
AppConfig uses it in place of its own.
