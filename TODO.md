# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 17 | [A Card that fills the page](#17-a-card-that-fills-the-page) | ready to start |

Next number: **18**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).


## 17. A Card that fills the page

`<Page fill>` is as tall as the main area, but only `<TableWrap fill>` takes
the rest of its height, so a Card cannot fill the page and hold content that
scrolls by itself. NetConfig's Router Config tab
(`~/develop/netconfig/frontend/src/components/RouterConfigTab.tsx`) wants one
card the height of the main area: a head, a Banner, then a list that scrolls
by itself beside a form panel.

**Done when:** `<Card fill>` straight in a `<Page fill>` takes the page's
remaining height as a flex column; its head, actions row and other children
keep their height; a `<TableWrap fill>` or an element with the helper class
`hu-fill` straight in it takes the rest; the gap between blocks still holds;
what it does at phone width is a documented rule. With a test, on the kitchen
sink and in STYLEGUIDE.md, released as v1.5.0.
