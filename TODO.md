# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 16 | [Click-to-sort table headers](#16-click-to-sort-table-headers) | ready to start |

Next number: **17**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 16. Click-to-sort table headers

NetConfig's `TableCard` (`~/develop/netconfig/frontend/src/components/TableCard.tsx`,
CSS `.th-sort*` in its `App.css`) sorts a table by a click on a header:
ascending → descending → stored order, an arrow (▲ ▼ ↕), `aria-sort` on the
`th`. Other apps' tables want the same.

**Done when:** house-ui exports a `useTableSort` hook (natural order, empty
values last, optionally remembered in the browser) and a `SortHeader` `th`,
with tests, on the kitchen sink and in STYLEGUIDE.md.
