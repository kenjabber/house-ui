# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 12 | [DiffView](#12-diffview) | idea |

Next number: **13**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 12. DiffView

`--diff-*` tokens are house-ui's, but each app colours its own unified diff:
AppConfig's `DiffView` (edge Caddyfile, `components/ui.tsx`) and
NetConfig's compile diffs. A `DiffView` component (`+`/`-`/`@@` lines
coloured, lines spanning the scroll width) would be the shared one.

**Done when:** house-ui exports `DiffView`, on the kitchen sink, and
AppConfig uses it in place of its own.
