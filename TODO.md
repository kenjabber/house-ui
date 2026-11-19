# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 3 | [The rule in Ken's ~/.claude/CLAUDE.md](#3-the-rule-in-kens-claudeclaudemd) | needs Ken (his file; the text is below) |
| 4 | [File a retrofit item in each app's backlog](#4-file-a-retrofit-item-in-each-apps-backlog) | ready to start |
| 5 | [Where stocker's scenario pane goes in AppShell](#5-where-stockers-scenario-pane-goes-in-appshell) | needs Ken (default: in the sidebar, below its links) |

Next number: **6**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 3. The rule in Ken's ~/.claude/CLAUDE.md

`~/.claude/CLAUDE.md` exists (sections: kwicky, vw, Backlogs) and has no
look-and-feel section yet. It is Ken's file, so Ken adds this section to it
(or tells a session to):

```markdown
## Web app look and feel

Web UIs use **house-ui** (`~/develop/house-ui`): read its `STYLEGUIDE.md`
before writing UI, depend on a pinned release, use its components and
semantic tokens, and write no colour, font-size or shadow literals. Run
`house-ui-check` as part of `npm test`. Something two apps would use goes
into house-ui, not into the app.
```

**Done when:** the section is in `~/.claude/CLAUDE.md`.

## 4. File a retrofit item in each app's backlog

v1.0.0 is released (2026-11-18). Add one item to each app's backlog for its
move to house-ui (PLAN.md §7 step 5 lists what a retrofit includes and the
order; STYLEGUIDE.md "Installing it in an app" the steps):
`~/develop/nestegg/TODO.md`, `~/develop/appconfig/TODO.md`,
`~/develop/kwicky/TODO.md`, `~/develop/netconfig/TODO.md`,
`~/develop/stocker/docs/todo.md`.
Each item names the app's own status mapping onto the five chip kinds
(D-11), its app-only tokens (D-12), and what `house-ui-check src` (run in the
app's `frontend/`) reports for it. On 2026-11-18 that was 139 problems in
NestEgg, 139 in AppConfig, 198 in kwicky, 458 in NetConfig and 322 in
stocker: mostly palette-token uses and colour literals, plus each app's
global element rules (`*`, `body`, `input`, …), which must go first because
they override house-ui's layered CSS (D-19). Run `check-todo.py` on each
file.

**Done when:** all five backlogs have their retrofit item.

## 5. Where stocker's scenario pane goes in AppShell

stocker has no nav sidebar. Its `Dashboard.tsx` renders `.app-shell` with a
collapsible scenario list (`<aside className="ticker-explorer">`) beside a
`main-header`. Moving stocker to `AppShell` (PLAN.md D-10) would put the nav
sidebar next to that pane: two left columns.

- **In the sidebar, below its links (the default).** D-10 already lets the
  sidebar take any content below its links; the scenario list goes there and
  collapses with it. One left column; the list is dark-on-sidebar styled.
- **A second pane slot in `AppShell`.** `AppShell` takes an optional
  `pane` beside the main area. Only stocker would use it today, so by D-12 it
  would wait for a second app.
- **In the main area.** The scenario list becomes a column inside stocker's
  page, which keeps it out of house-ui entirely.

**Done when:** Ken has chosen, D-10 records the choice, and stocker's
retrofit item (item 4) names it.
