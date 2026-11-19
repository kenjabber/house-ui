# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 13 | [A link that looks like a button](#13-a-link-that-looks-like-a-button) | ready to start |
| 14 | [Checkbox order only inside a Field](#14-checkbox-order-only-inside-a-field) | ready to start |
| 15 | [A check Field's long label wraps beside the box](#15-a-check-fields-long-label-wraps-beside-the-box) | ready to start |
| 16 | [Click-to-sort table headers](#16-click-to-sort-table-headers) | ready to start |

Next number: **17**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 13. A link that looks like a button

`Button` renders only a `<button>`, so a download link (`<a href download>`)
cannot use it. NetConfig's QR modal
(`~/develop/netconfig/frontend/src/components/wg/QRModal.tsx`) borrows
`className="hu-btn"` on an `<a>` (NetConfig TODO 107, R-130).

**Done when:** a `ButtonLink` (an `<a>`, or a router link via `as`) takes
Button's `variant`, `sm` and `icon`, with tests, on the kitchen sink and in
STYLEGUIDE.md.

## 14. Checkbox order only inside a Field

`.hu-checkbox { order: 1 }` in `src/styles/form.css` is meant for a check
`Field`, but it also moves the box after its text in any other flex row
(NetConfig's `.rc-option` and `.ms-option` undo it with `order: -1`).

**Done when:** the ordering applies only inside `.hu-field--check`, and a
Checkbox in a plain `hu-row` sits before its text on the kitchen sink.

## 15. A check Field's long label wraps beside the box

A check `Field` whose label is longer than its column puts the whole label
on a line below the box. NetConfig's `.rc-checks > div …` rules in its
`App.css` work around it.

**Done when:** the label takes `flex: 1 1 0; min-width: 0` and wraps beside
the box, the box stays on the label's first line (`align-items: flex-start`
and a small top margin), help and error still go below; shown on the
kitchen sink.

## 16. Click-to-sort table headers

NetConfig's `TableCard` (`~/develop/netconfig/frontend/src/components/TableCard.tsx`,
CSS `.th-sort*` in its `App.css`) sorts a table by a click on a header:
ascending → descending → stored order, an arrow (▲ ▼ ↕), `aria-sort` on the
`th`. Other apps' tables want the same.

**Done when:** house-ui exports a `useTableSort` hook (natural order, empty
values last, optionally remembered in the browser) and a `SortHeader` `th`,
with tests, on the kitchen sink and in STYLEGUIDE.md.
