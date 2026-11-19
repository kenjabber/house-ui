# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 3 | [The rule in Ken's ~/.claude/CLAUDE.md](#3-the-rule-in-kens-claudeclaudemd) | needs Ken (his file; the text is below) |
| 5 | [Where stocker's scenario pane goes in AppShell](#5-where-stockers-scenario-pane-goes-in-appshell) | needs Ken (default: in the sidebar, below its links) |
| 6 | [The shared pieces v1.0.0 lacks](#6-the-shared-pieces-v100-lacks) | ready to start |

Next number: **7**.

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

## 6. The shared pieces v1.0.0 lacks

Surveying the five apps for their retrofit items (2026-11-18) found pieces
two or more apps have that house-ui v1.0.0 does not. By D-12 they belong
here; each app keeps its own copy until they are (each retrofit item says
so).

| Piece | Apps today |
|---|---|
| User menu and the header's gear button (`TitleBar.tsx`, `.user-menu*`, `.gear-btn`) | all five |
| Settings tabs (`.settings-tab*` in each `SettingsModal`) | all five |
| Info button and its note (`InfoButton.tsx`, `.info-btn`) | kwicky, NetConfig, AppConfig |
| Banners (`.banner-*`, `ErrorBanner`, `Warnings`) | AppConfig, NestEgg (kwicky's callouts are close) |
| `Loading`, `ConfirmButton` | AppConfig, NestEgg |
| Definition list of facts (`.facts`) | AppConfig, NestEgg |

Each one as D-18 says: component and CSS, a kitchen-sink section,
STYLEGUIDE.md, tests. Then release `v1.1.0` and say so in each app's
retrofit item if it is still open.

**Done when:** `v1.1.0` is released with these pieces.
