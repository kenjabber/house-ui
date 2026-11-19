# house-ui style guide

house-ui is the one look and feel for Ken's web apps (AppConfig, kwicky,
NestEgg, NetConfig, stocker, and every new one). It ships design tokens, one
stylesheet and React components. This guide is what an app's author, or a
Claude session writing UI in an app, reads first. The decisions behind it are
in [PLAN.md](PLAN.md) (D-n below).

To see every component in light and dark: `npm run dev` in `~/develop/house-ui`,
then <http://localhost:5673> (the kitchen sink).

## The rules

1. **Use house-ui's components and semantic tokens.** Write no colour, font
   size or shadow literals and no palette (`--color-*`) tokens in app CSS or
   inline styles (D-6, D-15). `house-ui-check` enforces this.
2. **A style only this app needs** is an `--app-*` token in the app's
   `app-tokens.css`, defined for light and dark (D-12). That file is the one
   place palette tokens (and, if the palette lacks the colour, a literal) are
   allowed. App CSS then uses `var(--app-…)`.
3. **Something two apps would use belongs in house-ui** (D-12): add it here
   (component, CSS, kitchen sink, this guide, a release), or note it in
   house-ui's `TODO.md`, instead of styling it in the app (D-18).
4. **Never style a `hu-` class from an app** (D-8). Change house-ui instead.
5. **No global element rules in app CSS** (`*`, `body`, `button`, `input`,
   `a:hover`, `h2`, …). house-ui's CSS is in `@layer house-ui` (D-19), and any
   unlayered rule beats it, so an app's `* { padding: 0 }` would strip every
   component's padding. Element defaults come from house-ui's base; scope
   anything else under a class.
6. **Status labels are `<Chip>` with one of five kinds** (D-11): `ok`, `warn`,
   `bad`, `info`, `neutral`. Map the app's own states onto them.
7. **Light and dark come from the tokens** (D-7). Use semantic tokens and dark
   works with no extra CSS.

## Installing it in an app

```bash
npm install https://github.com/kenjabber/house-ui/releases/download/v1.5.0/house-ui-1.5.0.tgz
```

`package.json` then pins that URL (D-3, D-4). In `main.tsx`, before the app's
own CSS:

```tsx
import 'house-ui/house-ui.css'
import './app-tokens.css'
import './App.css'
```

In `index.html`, the viewport meta needs `viewport-fit=cover` for the
safe-area insets, and `<meta name="color-scheme" content="light dark" />`.

In `vite.config.ts`, so a linked working copy (below) does not load a second
React (D-5):

```ts
resolve: { dedupe: ['react', 'react-dom'] },
```

In `package.json`, the check runs with the tests (D-17):

```json
"test": "house-ui-check src && vitest run"
```

**Upgrading** is a deliberate change in the app: install the new release URL,
check the app, commit. A new major version means something was renamed or
removed (D-18); read the release notes.

**Changing house-ui while working in an app** (D-5):

```bash
cd ~/develop/house-ui && npm run watch
```

```bash
cd ~/develop/<app>/frontend && npm link ../../house-ui
```

Before committing the app, run `npm install` there to put the pinned release
back, and check that `package.json` still names the release URL.

## Tokens

All in `src/styles/tokens.css`. App CSS uses only the semantic ones.

| Role | Tokens |
|---|---|
| Surfaces | `--surface-body` (page), `--surface-raised` (cards, header, inputs), `--surface-panel` (tab panels, form sections), `--surface-hover`, `--surface-sunken` (code, pre), `--surface-thead`, `--surface-sidebar`, `--surface-modal-overlay` |
| Borders | `--border-subtle`, `--border-default`, `--border-sidebar` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-blue` (links), `--text-error`, `--text-error-strong`, `--text-on-dark`, `--text-on-dark-muted` |
| Accent | `--accent`, `--accent-hover`, `--accent-soft`, `--accent-soft-border`, `--accent-soft-fg`, `--on-accent` |
| Danger | `--danger`, `--danger-hover` |
| Status | `--chip-{ok,warn,bad,info,neutral}-{bg,fg}` |
| Diff | `--diff-add-bg`, `--diff-add-fg`, `--diff-del-bg`, `--diff-del-fg`, `--diff-hunk-fg` |
| Shadows | `--shadow-card`, `--shadow-tab`, `--shadow-popover`, `--shadow-modal`, `--shadow-focus` (the focus ring) |
| Type | `--font-sans`, `--font-mono`; sizes `--text-micro` · `xs` · `sm` · `base` · `md` (body) · `body` · `card` · `subhead` · `lg` · `xl` · `2xl` (page title) · `price`; `--text-input` (16px, touch) |
| Space | `--space-1` … `--space-6` (0.25rem steps to 1.5rem) |
| Radii | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` |
| Controls | `--input-height`, `--input-height-touch` and `--touch-target-min` (44px), `--focus-ring-width`, `--disabled-opacity` |
| Layout | `--sidebar-width` (240px), `--sidebar-width-collapsed` (56px), `--page-max-width`, `--app-height` and `--modal-max-height` (dynamic-viewport aware), `--safe-top` · `right` · `bottom` · `left`, `--z-overlay`, `--z-modal` |

**Breakpoints.** CSS cannot use a custom property in `@media`, so write the
number: **980px** is compact (one column; the sidebar becomes an overlay),
**1280px** is tablet. `--bp-compact` and `--bp-tablet` hold the same values
for reference.

**Themes** (D-7). Dark follows the system setting. `data-theme="dark"` or
`data-theme="light"` on any element forces that theme on it and everything
inside; put it on `<html>` to add a theme switch to an app.

**Palette** (`--color-slate-*`, `--color-blue-*`, `--color-green-*`,
`--color-amber-*`, `--color-red-*`, `--color-purple-600`, `--color-white`) is
house-ui's, for its semantic layer and for an app's `app-tokens.css`.

## Components

Import from `house-ui`:

```tsx
import { AppShell, Sidebar, SidebarLink, PageHead, Card, Button, Chip } from 'house-ui'
```

### AppShell, Sidebar, SidebarLink

The layout of every app (D-10): a dark sidebar (240px, collapsing to 56px of
icons), a main header, and the page, which scrolls on its own. At 980px and
below the sidebar becomes an overlay opened by the header's menu button and
closed by a link, the backdrop or Escape.

| AppShell prop | |
|---|---|
| `sidebar` | A `<Sidebar>` |
| `title` | The header's title, usually the section's name (not a heading; the page's h1 is its `PageHead`) |
| `headerRight` | Settings button, user menu |
| `children` | The page |
| `collapsed`, `onCollapsedChange`, `defaultCollapsed` | Collapsed state, controlled or not |

| Sidebar prop | |
|---|---|
| `brand` | The app's name |
| `children` | `SidebarLink`s |
| `below` | Anything under the links, usually `SidebarSection`s (stocker's scenarios, kwicky's site tree); hidden when collapsed |
| `navLabel` | The nav's accessible name, default "Sections" |

| SidebarLink prop | |
|---|---|
| `label` | Text, and the tooltip when collapsed |
| `icon` | An inline SVG (house-ui has no icon set). Without one, the label's first letter shows when collapsed |
| `badge` | A count |
| `active` | The current section (a router `NavLink` marks itself) |
| `as` | `"button"` (default), `"a"` with `href`, or a router link with its props |

```tsx
<AppShell
  title={section.label}
  headerRight={<UserMenu />}
  sidebar={
    <Sidebar brand="NetConfig">
      <SidebarLink as={NavLink} to="/hosts" label="Hosts" icon={<HostsIcon />} badge={7} />
      <SidebarLink as={NavLink} to="/domains" label="Domains" icon={<GlobeIcon />} />
    </Sidebar>
  }
>
  <Outlet />
</AppShell>
```

`useShell()` gives a component inside the shell `collapsed`, `navOpen` and
their setters.

**The area below the links** holds lists on the dark sidebar:
`SidebarSection` (`title`, `actions`) with `SidebarAction`s (small icon
buttons, each with an `aria-label`; `danger` for a delete) and `SidebarItem`
rows (`active`, `icon` before the label, `meta` at the right, `as` like
SidebarLink). An `icon` is an inline SVG drawn 1rem square in the row's
colour (`stroke="currentColor"`), a little dimmed, so it reads on the active
row too: kwicky's folder and page icons. A row's click
also closes the compact overlay. The links keep their height (up to 60% of
the sidebar) and this area scrolls.

```tsx
<Sidebar brand="stocker" below={
  <SidebarSection title="Scenarios" actions={<SidebarAction aria-label="Add scenario" onClick={add}><PlusIcon /></SidebarAction>}>
    {scenarios.map((s) => (
      <SidebarItem key={s.name} active={s.name === selected} meta={s.is_locked ? '🔒' : undefined} onClick={() => select(s.name)}>
        {s.name}
      </SidebarItem>
    ))}
  </SidebarSection>
} />
```

**The header's right side** is a ghost icon `Button` with `GearIcon` for
settings, then a `UserMenu`:

```tsx
headerRight={
  <>
    <Button variant="ghost" icon aria-label="Settings" onClick={openSettings}><GearIcon /></Button>
    <UserMenu name={user.display_name} badge={user.is_admin ? 'admin' : undefined}>
      <MenuItem danger onClick={signOut}>Sign out</MenuItem>
    </UserMenu>
  </>
}
```

`UserMenu` (`name`, `badge`, `MenuItem` children, each `danger` or not)
closes on a choice, Escape or a click elsewhere; the arrow keys move
between items.

### Page, PageHead

`Page` centres the content at `--page-max-width` with even gaps. `PageHead`
is the top of a page: `title` (the h1), `subtitle`, `actions` (they wrap
under the title when narrow).

```tsx
<Page>
  <PageHead title="Hosts" subtitle="Every host NetConfig knows about." actions={<Button variant="primary">Add host</Button>} />
  <Card title="…">…</Card>
</Page>
```

**List pages: `hideTitle`.** AppShell's header already names the section, so
a list page whose title is the same ("Runs" in the header, "Runs" as the h1)
passes `hideTitle`: the h1 stays for screen readers (and `getByRole('heading')`)
but is visually hidden, and the head becomes a toolbar of its `actions` at the
right. With no actions and no subtitle only the hidden h1 is rendered, so no
empty gap appears. A detail page, whose title is the record's name, keeps a
visible title.

**A table that scrolls by itself: `Page fill` and `TableWrap fill`.** A list
page puts its table straight in the page (no Card around it). `<Page fill>`
is as tall as the main area; its children keep their natural height (a
PageHead, a Banner is never squashed), and a `<TableWrap fill>` straight in it
takes the rest and scrolls both ways by itself, so the main area does not
scroll. Use it with `<Table stickyHead>` so the header row stays in view.

```tsx
<Page fill>
  <PageHead title="Runs" hideTitle actions={<Button variant="primary">New run</Button>} />
  <ErrorBanner error={error} />
  <TableWrap fill>
    <Table stickyHead>…</Table>
  </TableWrap>
</Page>
```

**A card that fills the page: `Card fill`.** For one card the height of the
main area whose content scrolls by itself (a list beside a form), put a
`<Card fill>` straight in a `<Page fill>`. The card takes the page's remaining
height and is a flex column: its head, its `actions` row and its other
children (a Banner) keep their natural height, and one child takes the rest:
a `<TableWrap fill>`, or any element with `className="hu-fill"` (`flex: 1 1
auto; min-height: 0; min-width: 0`). A `.hu-fill` lays itself out (the app's
own grid), and each box in it that should scroll carries `overflow: auto;
min-height: 0`. For a grid, give it one row as tall as the box,
`grid-template-rows: minmax(0, 1fr)`, or the row grows with its content.
A `.hu-fill` straight in a `<Page fill>` (no card) takes the rest the same way.

```tsx
<Page fill>
  <Card fill title="Router config" headActions={<Button sm>Fetch</Button>}>
    <ErrorBanner error={error} />
    <div className="hu-fill rc-split">   {/* the app's grid: list | form */}
      <ul className="rc-list">…</ul>    {/* overflow: auto; min-height: 0 */}
      <div className="rc-panel">…</div>
    </div>
  </Card>
</Page>
```

```css
.rc-split { display: grid; grid-template-columns: 16rem minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); gap: var(--space-4); }
.rc-list, .rc-panel { overflow: auto; min-height: 0; }
```

In a fill card the blocks keep their even gap, but the card is a flex column,
so text straight in it is not on one line with its neighbours: wrap it in a
`<p>`. Put only one fill child in a card. **At phone width** (the shell 600px
wide or less) a box the rest of a small screen high is too small for a list
beside a form, so a page holding a fill card is an ordinary page: the page,
the card and its fill child take their natural height and the main area
scrolls (stack the app's grid there too). A `<TableWrap fill>` straight in a
`<Page fill>` keeps filling at every width.

### Card

A raised box. `title` (an h2), `headActions` (right of the title), the body
as children, `actions` (a right-aligned row under the body), `fill` (in a
`Page fill`, take the rest of the page's height; see Page, PageHead).

```tsx
<Card title="Backups" headActions={<Button sm>Run now</Button>} actions={<Button variant="primary">Save</Button>}>
  …
</Card>
```

The body's blocks (a Banner, a table, a paragraph) get an even gap, and an
`h3` straight in a card is a sub-heading, with more space above than below,
for a card of several parts. Elsewhere (a tab panel, a modal), give the
heading `className="hu-subhead"`.

```tsx
<Card title="Containers">
  <ErrorBanner error={error} />
  <TableWrap>…</TableWrap>
  <h3>Timers</h3>
  <TableWrap>…</TableWrap>
</Card>
```

### Button

`variant`: `primary` (one per view, the main action), `secondary` (default),
`danger` (destroys something: solid red, a dialog's confirm), `ghost-danger`
(a secondary button with red text: Delete or Revoke in a table row, where
solid red is too loud), `ghost` (toolbar, header icons), `link` (inline,
looks like a link). `sm` for tables and card heads. `icon` for a square
icon-only button, which needs an `aria-label`. `type` defaults to `"button"`;
pass `type="submit"` in a form.

```tsx
<Button variant="ghost" icon aria-label="Settings"><GearIcon /></Button>
```

**A link that looks like a button: `ButtonLink`.** A download, or a
button-shaped way to another page, is a link, not a `<button>`. `ButtonLink`
renders an `<a>` with the same `variant`, `sm` and `icon`; `as` renders a
router link instead, with its props. A link cannot be disabled: leave it out
instead.

```tsx
<ButtonLink href={configUrl(device.id)} download>Download .conf</ButtonLink>
<ButtonLink as={Link} to="/hosts/new" variant="primary">Add host</ButtonLink>
```

### Chip

`kind`: `ok`, `warn`, `bad`, `info`, `neutral` (default). Several in a row:
wrap them in `<div className="hu-chip-row">`.

```tsx
<Chip kind={host.up ? 'ok' : 'bad'}>{host.up ? 'Up' : 'Down'}</Chip>
```

### Table, TableWrap, TableEmpty

`TableWrap` is the bordered box (scrolls sideways when wide; `fill` in a
`Page fill` takes the page's remaining height and scrolls both ways, see
Page above); `Table` the table, with `stickyHead` to keep the header in view. Write `thead`/`tbody`
yourself. Cell classes: `hu-num` (right-aligned figures), `hu-nowrap`. Row
classes: `hu-row--clickable`, `hu-row--selected`, `hu-row--detail` (below).
`TableEmpty colSpan={n}` is the "nothing here" row.

**A row's editor under it: `TableDetailRow`.** A click on a row opens its
editor (or its details) in a row right under it: kwicky Settings → Access.
`<TableDetailRow colSpan={n}>` is that row, one cell across the table, with
the panel surface, no hover highlight and a default cursor. Mark the row
above `hu-row--selected`: there is no line between the two, and an accent
line under the detail row closes the pair.

```tsx
{rows.map((r) => (
  <Fragment key={r.path}>
    <tr className={cx('hu-row--clickable', open === r.path && 'hu-row--selected')} onClick={() => toggle(r.path)}>
      <td>{r.path}</td>…
    </tr>
    {open === r.path && (
      <TableDetailRow colSpan={4}>
        <AccessEditor path={r.path} />
      </TableDetailRow>
    )}
  </Fragment>
))}
```

### TableFilter, useTableFilter, chipValue

kwicky's filter bar for any table: a box that keeps the rows containing every
typed word, a count, Show all, and per chip column one on/off chip per value
with its count (shift-click shows only that value).

```tsx
const filter = useTableFilter(hosts, {
  text: (h) => `${h.name} ${h.server} ${h.status}`,
  chips: [{ name: 'Status', value: (h) => chipValue(h.status) }],
})
return (
  <>
    <TableFilter filter={filter} />
    <TableWrap><Table>…{filter.visible.map(…)}…</Table></TableWrap>
  </>
)
```

Values are grouped regardless of case. `chipValue` drops a bracketed note, so
"needs Ken (the token)" groups with "needs Ken". `TableFilter` also takes
`placeholder` and `noun` ("rows"). For rows that are DOM elements (kwicky's
rendered markdown), pass them to `useTableFilter` and show or hide them from
`filter.visible`.

### useTableSort, SortHeader

Headers that sort on a click: ascending ▲, descending ▼, then the rows' own
order again (↕ on a column not sorted), with `aria-sort` on the active `th`.
`useTableSort(rows, options)` takes the rows (after any filter) and
`columns`, the columns that sort by key, each giving a row's value (usually
what its cell shows). Show `sorted`; each sortable header is a
`<SortHeader sort column>` in place of its `th` (it takes `th` props, such
as `className="hu-num"`); a column that does not sort keeps a plain `th`.

```tsx
const filter = useTableFilter(hosts, { text: (h) => `${h.name} ${h.server}` })
const sort = useTableSort(filter.visible, {
  columns: { name: (h) => h.name, cpu: (h) => h.cpu },
  storageKey: 'appconfig.sort.hosts',
})
…
<thead><tr>
  <SortHeader sort={sort} column="name">Name</SortHeader>
  <SortHeader sort={sort} column="cpu" className="hu-num">CPU %</SortHeader>
  <th aria-label="Actions" />
</tr></thead>
<tbody>{sort.sorted.map((h) => …)}</tbody>
```

The order is natural: numbers, dates and booleans numerically, text without
regard to case and with digit runs as numbers (ether2 before ether10,
10.0.0.2 before 10.0.0.11); empty values last either way; equal values keep
the rows' order. The sort is a view only. `initial` is the sort before any
click; `storageKey` remembers it in this browser (a remembered column that no
longer sorts is ignored). The state also has `sort`, `setSort`, `dirOf` and
`cycle`; an app keeping its own sort state passes `SortHeader` any object
with `dirOf` and `cycle`. `compareSortValues(a, b, dir)` is the comparison.

### Modal

A dialog over the page: `title`, `onClose` (Escape, ×, backdrop), `children`,
`footer` (buttons, right-aligned), `wide` (820px instead of 460px),
`closeOnBackdrop` (default true; turn off for a form that would lose input).
Focus moves in (to an element with `autoFocus`, or the dialog), Tab stays
inside, and focus returns on close. Its height follows the dynamic viewport.

```tsx
{confirming && (
  <Modal title="Delete kwicky?" onClose={() => setConfirming(false)}
    footer={<><Button onClick={() => setConfirming(false)}>Cancel</Button><Button variant="danger" onClick={del}>Delete</Button></>}>
    This removes the app's containers. Its data volume is kept.
  </Modal>
)}
```

### Field, FormGrid, FormActions, Input, Select, Textarea, Checkbox

`Field` wraps one control with its `label`, `help` and `error`: the label
points at the control, help and error describe it, and an error marks it
invalid. `required` adds the marker; `wide` spans every column of a
`FormGrid`. A `Checkbox` gets its label beside it (a long label wraps
beside the box, which stays on its first line). A `Checkbox` outside a
Field (a list row, `<label className="hu-row"><Checkbox /> Text</label>`)
stays where it is written, before its text. `FormGrid` fits as many
220px columns as there is room for; `FormActions` is the button row under a
form. The controls are the native elements with house-ui's look: 44px tall
and 16px text on touch screens.

`Input` and `Select` fill their field. One in a row of other controls (a
filter in a `PageHead`'s actions or a Card's `headActions`, a short Input
beside buttons) takes `inline`: as wide as its content, or an Input's
`size`.

```tsx
<PageHead title="Runs" actions={
  <Select inline aria-label="kind" value={kind} onChange={…}>…</Select>
} />
<Input inline size={6} aria-label="tail" value={tail} onChange={…} />
```

```tsx
<FormGrid>
  <Field label="Name" help="Letters, digits and dashes." required>
    <Input value={name} onChange={(e) => setName(e.target.value)} required />
  </Field>
  <Field label="Port" error={portError}>
    <Input type="number" value={port} onChange={…} />
  </Field>
  <Field label="Deploy on push">
    <Checkbox checked={auto} onChange={…} />
  </Field>
</FormGrid>
<FormActions><Button type="submit" variant="primary">Save</Button></FormActions>
```

### Tabs, TabPanel, PanelTabs

A row of tabs, the selected one underlined: the settings modals' tabs.
`tabs` (`key`, `label`, `sub`, `disabled`; `sub` is quieter text after the
label, a server name or a count), `value`, `onChange`, `label` (the
list's accessible name). Arrow keys, Home and End move between tabs. Render
the selected tab's content yourself; with `idPrefix`, wrap it in
`<TabPanel idPrefix tabKey>` and the two are wired for screen readers.

```tsx
<Tabs label="Settings" idPrefix="settings" value={tab} onChange={setTab}
  tabs={[{ key: 'users', label: 'Users' }, { key: 'tokens', label: 'API tokens' }]} />
<TabPanel idPrefix="settings" tabKey={tab}>{tab === 'users' ? <Users /> : <Tokens />}</TabPanel>
```

`PanelTabs` is tabs that own a panel: the strip sits on a bordered panel and
the selected tab joins it, so every control inside visibly belongs to that
tab (AppConfig's Edges, NetConfig). Use it when the tabs switch between
things (edges, devices), not settings pages. It takes the same props as
`Tabs`, the selected tab's content as children (in a column with a gap),
and `panelLabel` to name the panel itself. The tabs and panel are wired
for screen readers without an `idPrefix`.

```tsx
<PanelTabs label="Edges" value={edgeId} onChange={select} panelLabel={`${edge.name} edge`}
  tabs={edges.map((e) => ({ key: e.id, label: e.name, sub: `· ${e.server_name}` }))}>
  <EdgePanel key={edgeId} edge={edge} />
</PanelTabs>
```

### Banner, Loading

`Banner` is a message across a page or card: `kind` (the five of D-11,
default `info`), optional `title`, the text as children, and `items` for a
list (warnings). `bad` is announced at once (role alert), the rest politely.
An empty banner renders nothing, so `<Banner kind="warn" items={warnings} />`
can always be there. An app's `ErrorBanner` is one line on top of it:

```tsx
export const ErrorBanner = ({ error }: { error: unknown }) => (error ? <Banner kind="bad">{errorText(error)}</Banner> : null)
```

`Loading` shows "Loading…" (`what` changes the word).

### ConfirmButton

A button that asks first, in a Modal, and runs `onConfirm` on yes: `label`,
`title`, `message`, `confirmLabel`, `danger` (a `ghost-danger` button, a red
confirm), `sm`,
`disabled`.

```tsx
<ConfirmButton label="Delete" title={`Delete ${app.name}?`} message="Its data volume is kept." danger onConfirm={del} />
```

### Facts

A two-column list of labels and values (one column on a phone): `items` as
`[label, value]` pairs, a missing value shown as "—"; `mono` for ids, paths
and hashes. Falsy entries are skipped, so a row that only sometimes applies
is `cond && [label, value]`.

```tsx
<Facts mono items={[['Commit', run.sha], ['Image', run.image]]} />
<Facts items={[['Host', s.name], s.is_pi && ['Temperature', s.temp]]} />
```

### InfoButton

The "?" beside a title: `title` (it reads "About <title>") and the note as
children. A click opens the note (above or below, wherever there is room,
in the theme around the button); a second click, Escape or a click elsewhere
closes it.

```tsx
<h2 className="hu-row">Edges <InfoButton title="Edges">An edge is a Caddy that routes names to apps.</InfoButton></h2>
```

### DiffView

A unified diff (`diff -u`, `git diff`) with `+` lines green, `-` lines red
and `@@` hunk lines blue, on the `--diff-*` tokens. Lines span the scroll
width, so a long line's colour does not stop at the box's edge. `diff` (the
text), `label` (its accessible name, default "diff").

```tsx
{preview.diff ? <DiffView diff={preview.diff} /> : <p className="hu-muted">The applied file matches.</p>}
```

### AuthPage

The passkey sign-in and register page, outside the AppShell: a card at most
360px wide, centred on the body surface, clear of the notch. `title` (the
h1), `subtitle` (a muted line), `error` (a `bad` Banner above the form,
nothing when empty), `onSubmit` (the children become a `<form>` that calls
it; without it they are a plain column, for a browser with no passkeys),
`footer` (a muted, centred line: the link to register or sign in), and the
fields and submit button as children, in a column with a gap. A `Button`
straight in the form is full width.

```tsx
<AuthPage
  title={`Sign in to ${siteName}`}
  subtitle="Use your passkey to sign in. Username is optional."
  error={error}
  onSubmit={handleLogin}
  footer={<>New here? <Link to="/register">Register your passkey</Link>.</>}
>
  <Field label="Username (optional)">
    <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username webauthn" />
  </Field>
  <Button type="submit" variant="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in with passkey'}</Button>
</AuthPage>
```

### Icons

`GearIcon`, `PersonIcon`, `MenuIcon`, `PlusIcon`: the few house-ui's own
pieces and every header use. They take SVG props and are 1em square. Apps
bring their own icons for everything else.

### Base and helpers

`house-ui.css` also sets element defaults (body, headings, links, `code`,
`pre`, focus ring, scrollbars) and a few helper classes: `hu-muted`,
`hu-hint`, `hu-mono`, `hu-row` (a wrapping row with a gap), `hu-stack` (a
column with a gap), `hu-fill` (the child that takes the rest of a `Card fill`
or a `Page fill`), `hu-subhead` (a sub-heading outside a Card),
`hu-visually-hidden`.

## house-ui-check

```bash
npx house-ui-check src
```

Reports `file:line: problem` for colour literals, font sizes not from a
`--text-*` token, shadows not from a `--shadow-*` token, palette tokens used
or defined, rules styling `hu-` classes, and global element rules. It skips
`app-tokens.css`, tests, `node_modules` and `dist`. No output and exit 0 means
clean.

## Changing house-ui

A change is made here first (D-18): the component and its CSS, its section
on the kitchen sink, this guide, then a release. Every CSS file stays inside
`@layer house-ui { … }`, uses semantic tokens, and works in both themes (check
both columns of the kitchen sink).

```bash
npm test         # components, tokens, house-ui-check
npm run lint
npm run build    # dist/: index.js, index.d.ts, house-ui.css
./release.sh 1.5.0
```

A renamed class, removed prop or removed token is a breaking change and bumps
the major version.
