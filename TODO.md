# TODO — house-ui

Open work for the shared look and feel ([PLAN.md](PLAN.md)). Paths are
relative to `~/develop/house-ui` unless they start with `~`.

| # | Item | Status |
|---|------|--------|
| 1 | [Public or private repo: how apps fetch the pinned release](#1-public-or-private-repo-how-apps-fetch-the-pinned-release) | needs Ken (default: public repo, release asset URL) |
| 2 | [Build house-ui v1.0.0](#2-build-house-ui-v100) | ready to start |
| 3 | [The rule in Ken's ~/.claude/CLAUDE.md](#3-the-rule-in-kens-claudeclaudemd) | needs Ken (his file; the text is below) |
| 4 | [File a retrofit item in each app's backlog](#4-file-a-retrofit-item-in-each-apps-backlog) | after 2 |
| 5 | [Where stocker's scenario pane goes in AppShell](#5-where-stockers-scenario-pane-goes-in-appshell) | needs Ken (default: in the sidebar, below its links) |

Next number: **6**.

**Status key:** the shared one (`~/develop/backlog/TODO-FORMAT.md`).

---

## 1. Public or private repo: how apps fetch the pinned release

Every app's frontend is built inside Docker on the server
(`deploy/docker/frontend.Dockerfile`: `node:22-alpine`, `npm ci`). That image
has no git and no SSH key, so a `git+ssh://` dependency on a **private**
`kenjabber/house-ui` cannot be fetched there.

- **Public repo (the default).** house-ui holds only styling and generic
  components — nothing about Ken's network or data. Apps pin the release's
  `npm pack` asset (PLAN.md D-4) over HTTPS, which `npm ci` fetches with no
  git and no credentials:
  `"house-ui": "https://github.com/kenjabber/house-ui/releases/download/v1.0.0/house-ui-1.0.0.tgz"`.
- **Private repo.** The Dockerfiles get a read-only GitHub token from
  Vaultwarden as a BuildKit secret and fetch the asset with it (a private
  repo's release assets need the API's asset URL and an
  `Accept: application/octet-stream` header, not the plain download URL, so
  `npm ci` cannot fetch it directly: a download step runs before it); every
  app's deploy changes, and the token needs rotating.

**Done when:** Ken has chosen, the choice is recorded as a decision in
PLAN.md §2, and this item is removed.

## 2. Build house-ui v1.0.0

PLAN.md §7 steps 1–4: package skeleton, tokens and base CSS, the D-9
components with the kitchen sink, `house-ui-check`, `STYLEGUIDE.md`,
`release.sh`. Sources to lift from: tokens from
`~/develop/appconfig/frontend/src/tokens.css`; the sidebar shell from
`~/develop/netconfig/frontend/src/App.css` (`.app-shell`, `.sidebar*`); the
table filter from `~/develop/kwicky/frontend/src/App.css` (`.table-filter*`);
chips, cards, modal and buttons from AppConfig's `App.css`. NetConfig's and
kwicky's `App.css` each have two `.app-shell` rules: an old flex one from
stocker near the top (NetConfig line 23, kwicky line 17) and the grid one
later (NetConfig line 2640, kwicky line 592). Take the grid one. Follow
D-19 (`@layer house-ui`) and D-20 (package shape) from the first commit.
Publishing the release waits on item 1's answer; everything before it does
not.

**Done when:** the kitchen sink shows every D-9 component in light and dark
side by side (D-7's `data-theme`), `house-ui-check` passes its own fixture
tests and, run against each of the five apps, lists their current literals,
and `v1.0.0` is tagged with its `.tgz` on the GitHub Release.

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

Once v1.0.0 is tagged, add one item to each app's backlog for its move to
house-ui (PLAN.md §7 step 5 lists what a retrofit includes and the order):
`~/develop/nestegg/TODO.md`, `~/develop/appconfig/TODO.md`,
`~/develop/kwicky/TODO.md`, `~/develop/netconfig/TODO.md`,
`~/develop/stocker/docs/todo.md`.
Each item names the app's own status mapping onto the five chip kinds
(D-11) and its app-only tokens (D-12). Run `check-todo.py` on each file.

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
