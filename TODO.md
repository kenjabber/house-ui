# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 15 | [A check Field's long label wraps beside the box](#15-a-check-fields-long-label-wraps-beside-the-box) | ready to start |
| 16 | [Click-to-sort table headers](#16-click-to-sort-table-headers) | ready to start |

Next number: **17**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

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
