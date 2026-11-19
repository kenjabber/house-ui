# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 22 | [A sidebar row that keeps the overlay open](#22-a-sidebar-row-that-keeps-the-overlay-open) | ready to start |

Next number: **23**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 22. A sidebar row that keeps the overlay open

`SidebarItem` and `SidebarLink` always close the compact overlay on a click.
kwicky's site tree has folder rows: a click drills into the folder (the tree
then lists its contents), so on a phone the overlay should stay open to keep
browsing; only a page row should close it (found in kwicky TODO 7).

**Done when:** `SidebarItem` and `SidebarLink` take `keepOpen`, which leaves
the overlay open on a click; with a test, on the kitchen sink and in
STYLEGUIDE.md, released.
