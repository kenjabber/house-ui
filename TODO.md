# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 7 | [Button: a ghost-danger variant](#7-button-a-ghost-danger-variant) | ready to start |
| 8 | [Inline controls: Input and Select as wide as their content](#8-inline-controls-input-and-select-as-wide-as-their-content) | ready to start |
| 9 | [Card: sub-headings and space between body blocks](#9-card-sub-headings-and-space-between-body-blocks) | ready to start |
| 10 | [Facts: skip empty items](#10-facts-skip-empty-items) | ready to start |
| 11 | [Tabs that own a panel](#11-tabs-that-own-a-panel) | idea |
| 12 | [DiffView](#12-diffview) | idea |

Next number: **13**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 7. Button: a ghost-danger variant

`ConfirmButton danger` draws a secondary button with red text
(`hu-btn--ghost-danger`), but `Button` has no variant for it, so a plain
destructive button in a table row (AppConfig's Revoke token, Delete
passkey) has to borrow the class: `className="hu-btn--ghost-danger"`
(AppConfig TODO 28). `variant="danger"` is a solid red button, too loud for
a row.

**Done when:** `Button variant="ghost-danger"` (or `danger` plus a flag)
exists, is on the kitchen sink and in STYLEGUIDE.md, and ConfirmButton uses
it.

## 8. Inline controls: Input and Select as wide as their content

`.hu-input` and `.hu-select` are `width: 100%`, right inside a `Field`, but
a control in a row of others (a filter Select in `PageHead` actions or a
Card's `headActions`, a short ref or tail Input beside buttons) stretches
across the row. AppConfig adds its own `.inline-control { width: auto }`
and inline widths (TODO 28).

**Done when:** an `inline` prop (or a class house-ui documents) makes a
control as wide as its content, shown on the kitchen sink in a PageHead and
a card head.

## 9. Card: sub-headings and space between body blocks

A Card's body children sit flush against each other (a `Banner` directly
on top of a `TableWrap`), and an `h3` inside a card gets no margin from the
base styles, so a second table's heading ("Compose projects", "Timers")
touches the table above. AppConfig adds a `.sub-head` class (TODO 28);
every app with multi-part cards will.

**Done when:** a Card's body blocks have an even gap (or a documented
`stack` option) and there is a sub-heading style (an h3 in a card, or a
`CardSection` with a title), on the kitchen sink.

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
