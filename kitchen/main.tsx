// The kitchen sink (PLAN D-14): every component in every variant, light and
// dark side by side. `npm run dev`, then http://localhost:5673. Every new
// component gets a section here.
import { Fragment, StrictMode, useId, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/house-ui.css'
import './kitchen.css'
import {
  AppShell,
  AuthPage,
  Banner,
  Button,
  ButtonLink,
  ConfirmButton,
  DiffView,
  Facts,
  GearIcon,
  InfoButton,
  Loading,
  MenuItem,
  SidebarAction,
  SidebarItem,
  SidebarSection,
  PanelTabs,
  TabPanel,
  Tabs,
  UserMenu,
  PlusIcon as HuPlusIcon,
  Card,
  Checkbox,
  Chip,
  Field,
  FormActions,
  FormGrid,
  Input,
  Modal,
  Page,
  PageHead,
  Select,
  Sidebar,
  SortHeader,
  SidebarLink,
  Table,
  TableDetailRow,
  TableEmpty,
  TableFilter,
  TableWrap,
  Textarea,
  chipValue,
  useTableFilter,
  useTableSort,
  type ChipKind,
} from '../src'

type Theme = 'light' | 'dark'

/** Renders its children twice: light on the left, dark on the right. */
function Pair({ children }: { children: (theme: Theme) => ReactNode }) {
  return (
    <div className="ks-pair">
      {(['light', 'dark'] as const).map((t) => (
        <div key={t} className="ks-panel" data-theme={t}>
          <span className="ks-panel-label">{t}</span>
          {children(t)}
        </div>
      ))}
    </div>
  )
}

/** Light then dark, each the full width (for the desktop shell, which needs > 980px). */
function Stacked({ children }: { children: (theme: Theme) => ReactNode }) {
  return (
    <>
      {(['light', 'dark'] as const).map((t) => (
        <div key={t} className="ks-panel ks-wide" data-theme={t}>
          <span className="ks-panel-label">{t}</span>
          {children(t)}
        </div>
      ))}
    </>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="ks-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

// ── Icons (inline SVG; house-ui has no icon set) ──
const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const HomeIcon = icon('M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z')
const ServerIcon = icon('M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01')
const GlobeIcon = icon('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18')
const PlusIcon = icon('M12 5v14M5 12h14')
const FolderIcon = icon('M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z')
const PageIcon = icon('M6 3h8l4 4v14H6zM14 3v4h4')

// ── Sample data ──
interface Host {
  name: string
  server: string
  status: string
  kind: ChipKind
  cpu: number
}
const HOSTS: Host[] = [
  { name: 'kwicky', server: 'srv-a', status: 'Running', kind: 'ok', cpu: 3 },
  { name: 'stocker', server: 'srv-b', status: 'Running', kind: 'ok', cpu: 11 },
  { name: 'netconfig', server: 'srv-b', status: 'Degraded (slow health check)', kind: 'warn', cpu: 41 },
  { name: 'appconfig', server: 'srv-a', status: 'Running', kind: 'ok', cpu: 6 },
  { name: 'nestegg', server: 'srv-c', status: 'Stopped', kind: 'bad', cpu: 0 },
  { name: 'vault', server: 'srv-a', status: 'Deploying', kind: 'info', cpu: 22 },
  { name: 'backup', server: 'srv-c', status: 'Unknown', kind: 'neutral', cpu: 0 },
]

function Scenarios() {
  const [picked, setPicked] = useState('Base case')
  return (
    <SidebarSection
      title="Scenarios"
      actions={
        <>
          <SidebarAction aria-label="Add scenario">
            <HuPlusIcon />
          </SidebarAction>
          <SidebarAction aria-label="Delete scenario" danger>
            −
          </SidebarAction>
        </>
      }
    >
      {['Base case', 'Early retirement', 'Sell the house', 'A very long scenario name that is cut off'].map((n, i) => (
        <SidebarItem key={n} active={picked === n} meta={i === 0 ? '🔒' : undefined} onClick={() => setPicked(n)}>
          {n}
        </SidebarItem>
      ))}
    </SidebarSection>
  )
}

/** kwicky's site tree: SidebarItems with an icon, indented by depth. */
function SiteTree() {
  const [picked, setPicked] = useState('projects/netconfig')
  const rows: [string, string, number, boolean][] = [
    ['home', 'Home', 0, false],
    ['projects', 'Projects', 0, true],
    ['projects/netconfig', 'NetConfig', 1, false],
    ['projects/kwicky', 'kwicky', 1, false],
    ['networks', 'Networks', 0, true],
  ]
  return (
    <SidebarSection title="Pages">
      {rows.map(([path, label, depth, folder]) => (
        <SidebarItem
          key={path}
          icon={folder ? FolderIcon : PageIcon}
          keepOpen={folder}
          active={picked === path}
          onClick={() => setPicked(path)}
          style={{ paddingLeft: `calc(var(--space-2) + ${depth} * var(--space-4))` }}
        >
          {label}
        </SidebarItem>
      ))}
    </SidebarSection>
  )
}

/** 60 rows for the fill demo, so the table is longer than the main area. */
const RUNS = Array.from({ length: 60 }, (_, i) => {
  const h = HOSTS[i % HOSTS.length]
  return { id: 1000 - i, app: h.name, server: h.server, status: h.status, kind: h.kind, took: `${(i * 7) % 90 + 4}s` }
})

/** A list page: no visible title (the header says it), the table fills the page and scrolls by itself. */
function ListPage({ section }: { section: string }) {
  const [rowCount, setRowCount] = useState(RUNS.length)
  return (
    <Page fill>
      <PageHead
        title={section}
        hideTitle
        actions={
          <>
            <Select inline aria-label="status" defaultValue="">
              <option value="">all statuses</option>
              <option>Running</option>
            </Select>
            <Select inline aria-label="rows" value={rowCount} onChange={(e) => setRowCount(Number(e.target.value))}>
              <option value={RUNS.length}>{RUNS.length} rows</option>
              <option value={5}>5 rows</option>
            </Select>
            <Button variant="primary">Add</Button>
          </>
        }
      />
      <Banner kind="info">Page fill: a short table stops after its last row; a long one reaches the bottom and scrolls inside its wrap, the header row stays, the main area does not scroll.</Banner>
      <TableWrap fill>
        <Table stickyHead>
          <thead>
            <tr><th>Run</th><th>App</th><th>Server</th><th>Status</th><th className="hu-num">Took</th></tr>
          </thead>
          <tbody>
            {RUNS.slice(0, rowCount).map((r) => (
              <tr key={r.id}>
                <td className="hu-num">{r.id}</td>
                <td>{r.app}</td>
                <td>{r.server}</td>
                <td><Chip kind={r.kind}>{chipValue(r.status)}</Chip></td>
                <td className="hu-num">{r.took}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  )
}

/** Groups of items for the fill-card demo, so the list is longer than the card. */
const RC_GROUPS = ['Interfaces', 'Firewall rules', 'NAT', 'Static routes'].map((g, gi) => ({
  group: g,
  items: Array.from({ length: 8 }, (_, i) => `${g.split(' ')[0].toLowerCase()}-${gi * 8 + i + 1}`),
}))

/** One card the height of the main area: head, Banner, then a list that scrolls by itself beside a form. */
function FillCardPage() {
  const [selected, setSelected] = useState(RC_GROUPS[0].items[0])
  return (
    <Page fill>
      <Card
        fill
        title={
          <>
            Router config <InfoButton title="Router config">The card fills the page; the list scrolls by itself.</InfoButton>
          </>
        }
        headActions={
          <>
            <Button sm>Fetch</Button>
            <Button sm variant="primary">Apply</Button>
          </>
        }
      >
        <Banner kind="warn">Card fill: the head and this Banner keep their height, the split below takes the rest.</Banner>
        <div className="hu-fill ks-split">
          <ul className="ks-split__list" role="listbox" aria-label="Config items">
            {RC_GROUPS.map((g) => (
              <li key={g.group} role="presentation">
                <div className="ks-split__group">{g.group}</div>
                <ul role="presentation">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      role="option"
                      aria-selected={it === selected}
                      className="ks-split__item"
                      onClick={() => setSelected(it)}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="ks-split__panel">
            <FormGrid>
              <Field label="Name"><Input value={selected} readOnly /></Field>
              <Field label="Comment"><Input placeholder="optional" /></Field>
              <Field label="Notes" wide><Textarea rows={4} /></Field>
            </FormGrid>
          </div>
        </div>
      </Card>
    </Page>
  )
}

function DemoShell({
  title,
  defaultCollapsed,
  withBelow,
  list,
  card,
  user = 'Ken',
  badge,
  initial,
}: {
  title: string
  defaultCollapsed?: boolean
  withBelow?: boolean
  /** Show a list page (Page fill, PageHead hideTitle, TableWrap fill). */
  list?: boolean
  /** Show a fill card page (Page fill, Card fill, .hu-fill). */
  card?: boolean
  /** The signed-in user's name and badge, and the first section (a long one for the phone demo). */
  user?: string
  badge?: string
  initial?: string
}) {
  const [section, setSection] = useState(initial ?? 'Hosts')
  return (
    <div className="ks-frame">
      <AppShell
        defaultCollapsed={defaultCollapsed}
        title={section}
        headerRight={
          <>
            <Button variant="ghost" icon aria-label="Settings">
              <GearIcon />
            </Button>
            <UserMenu name={user} badge={badge ?? (withBelow ? undefined : 'admin')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem danger>Sign out</MenuItem>
            </UserMenu>
          </>
        }
        sidebar={
          <Sidebar
            brand={title}
            below={
              withBelow ? (
                <>
                  <Scenarios />
                  <SiteTree />
                </>
              ) : undefined
            }
          >
            {[
              { label: 'Overview', icon: HomeIcon },
              { label: 'Hosts', icon: ServerIcon, badge: 7 },
              { label: 'Domains', icon: GlobeIcon },
              { label: 'Exports', badge: 2 },
              { label: 'Settings', icon: <GearIcon /> },
            ].map((l) => (
              <SidebarLink
                key={l.label}
                label={l.label}
                icon={l.icon}
                badge={l.badge}
                active={section === l.label}
                onClick={() => setSection(l.label)}
              />
            ))}
          </Sidebar>
        }
      >
        {list ? (
          <ListPage section={section} />
        ) : card ? (
          <FillCardPage />
        ) : (
          <Page>
            <PageHead title={section} subtitle="The page scrolls inside the main area." actions={<Button variant="primary">Add</Button>} />
            <Card title="A card">
              <p>Content.</p>
            </Card>
            <Card title="Another card">
              <p>More content, to make the page scroll.</p>
            </Card>
            <Card title="A third card">
              <p>The end.</p>
            </Card>
          </Page>
        )}
      </AppShell>
    </div>
  )
}

function Swatches() {
  const tokens = [
    'surface-body',
    'surface-raised',
    'surface-panel',
    'surface-hover',
    'surface-sunken',
    'surface-sidebar',
    'border-subtle',
    'border-default',
    'text-primary',
    'text-secondary',
    'text-muted',
    'text-blue',
    'accent',
    'accent-soft',
    'danger',
    'text-error-strong',
  ]
  return (
    <div className="ks-swatches">
      {tokens.map((t) => (
        <div key={t} className="ks-swatch">
          <span style={{ background: `var(--${t})` }} />
          <span>--{t}</span>
        </div>
      ))}
    </div>
  )
}

function TypeScale() {
  const sizes = ['micro', 'xs', 'sm', 'base', 'md', 'body', 'subhead', 'lg', 'xl', '2xl', 'price']
  return (
    <div className="ks-type">
      {sizes.map((s) => (
        <div key={s} style={{ fontSize: `var(--text-${s})` }}>
          <span className="ks-label">--text-{s}</span> The quick brown fox
        </div>
      ))}
    </div>
  )
}

function Buttons() {
  const variants = ['primary', 'secondary', 'danger', 'ghost-danger', 'ghost', 'link'] as const
  return (
    <div className="hu-stack">
      {variants.map((v) => (
        <div key={v} className="hu-row">
          <span className="ks-label" style={{ width: '6.5rem' }}>
            {v}
          </span>
          <Button variant={v}>Save</Button>
          <Button variant={v} sm>
            Small
          </Button>
          <Button variant={v} disabled>
            Disabled
          </Button>
          {v !== 'link' && (
            <>
              <Button variant={v} icon aria-label="Add">
                {PlusIcon}
              </Button>
              <Button variant={v} icon sm aria-label="Add">
                {PlusIcon}
              </Button>
              <Button variant={v}>
                {PlusIcon} With icon
              </Button>
            </>
          )}
        </div>
      ))}
      <div className="hu-row">
        <span className="ks-label" style={{ width: '6.5rem' }}>
          ButtonLink
        </span>
        <ButtonLink href="data:text/plain,peer" download="peer.conf">
          Download .conf
        </ButtonLink>
        <ButtonLink href="#buttons" variant="primary">
          Primary link
        </ButtonLink>
        <ButtonLink href="#buttons" sm>
          Small
        </ButtonLink>
        <ButtonLink href="#buttons" variant="ghost" icon aria-label="Add">
          {PlusIcon}
        </ButtonLink>
      </div>
    </div>
  )
}

function Chips() {
  const kinds: ChipKind[] = ['ok', 'warn', 'bad', 'info', 'neutral']
  return (
    <div className="hu-chip-row">
      {kinds.map((k) => (
        <Chip key={k} kind={k}>
          {k}
        </Chip>
      ))}
      <Chip kind="ok">● Running</Chip>
      <Chip kind="bad">3 failed</Chip>
    </div>
  )
}

function Tables() {
  const filter = useTableFilter(HOSTS, {
    text: (h) => `${h.name} ${h.server} ${h.status}`,
    chips: [
      { name: 'Status', value: (h) => chipValue(h.status) },
      { name: 'Server', value: (h) => h.server },
    ],
  })
  const sort = useTableSort(filter.visible, {
    columns: { name: (h) => h.name, server: (h) => h.server, status: (h) => h.status, cpu: (h) => h.cpu },
  })
  const [selected, setSelected] = useState('stocker')
  return (
    <div className="hu-stack">
      <div>
        <TableFilter filter={filter} />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <SortHeader sort={sort} column="name">
                  App
                </SortHeader>
                <SortHeader sort={sort} column="server">
                  Server
                </SortHeader>
                <SortHeader sort={sort} column="status">
                  Status
                </SortHeader>
                <SortHeader sort={sort} column="cpu" className="hu-num">
                  CPU %
                </SortHeader>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {sort.sorted.map((h) => (
                <tr
                  key={h.name}
                  className={`hu-row--clickable${h.name === selected ? ' hu-row--selected' : ''}`}
                  onClick={() => setSelected(h.name)}
                >
                  <td>{h.name}</td>
                  <td className="hu-mono">{h.server}</td>
                  <td>
                    <Chip kind={h.kind}>{h.status}</Chip>
                  </td>
                  <td className="hu-num">{h.cpu}</td>
                  <td className="hu-muted">{h.name === 'stocker' ? 'pinned' : ''}</td>
                </tr>
              ))}
              {filter.visible.length === 0 && <TableEmpty colSpan={5}>No rows match.</TableEmpty>}
            </tbody>
          </Table>
        </TableWrap>
      </div>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Empty table</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            <TableEmpty colSpan={2} />
          </tbody>
        </Table>
      </TableWrap>
    </div>
  )
}

/** kwicky Settings → Access: a click on a page's row opens its editor in a detail row under it. */
function AccessTable() {
  const rows = [
    ['/projects', 'admins, family', 'Folder'],
    ['/networks', 'admins', 'Folder'],
    ['/ranchero/notes/heater', 'everyone', 'Page'],
  ]
  const [open, setOpen] = useState<string | null>('/networks')
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>Path</th>
            <th>Readers</th>
            <th>Kind</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map(([path, readers, kind]) => (
            <Fragment key={path}>
              <tr
                className={`hu-row--clickable${open === path ? ' hu-row--selected' : ''}`}
                onClick={() => setOpen(open === path ? null : path)}
              >
                <td className="hu-mono">{path}</td>
                <td>{readers}</td>
                <td>{kind}</td>
                <td className="hu-num hu-muted">{open === path ? '▾' : '▸'}</td>
              </tr>
              {open === path && (
                <TableDetailRow colSpan={4}>
                  <div className="hu-stack">
                    <Field label="Readers" help="Admins always read everything.">
                      <Input defaultValue={readers} />
                    </Field>
                    <label className="hu-row">
                      <Checkbox defaultChecked /> Restrict this path
                    </label>
                    <div className="hu-row">
                      <Button sm variant="primary">Save</Button>
                      <Button sm onClick={() => setOpen(null)}>Cancel</Button>
                    </div>
                  </div>
                </TableDetailRow>
              )}
            </Fragment>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  )
}

/** The sign-in page, with an error, and the page for a browser with no passkeys. */
function AuthPages() {
  return (
    <div className="ks-auth">
      <AuthPage
        title="Sign in to kwicky"
        subtitle="Use your passkey to sign in. Username is optional: leave it blank to let the browser pick a passkey."
        error="The passkey was not accepted."
        onSubmit={(e) => e.preventDefault()}
        footer={
          <>
            New here? <a href="#auth">Register your passkey</a>.
          </>
        }
      >
        <Field label="Username (optional)">
          <Input autoComplete="username webauthn" />
        </Field>
        <Button type="submit" variant="primary">
          Sign in with passkey
        </Button>
      </AuthPage>
      <AuthPage
        title="Sign in"
        subtitle="This browser does not support passkeys. Use a current version of Safari, Chrome, Edge, or Firefox."
      />
    </div>
  )
}

function Forms() {
  const [name, setName] = useState('')
  return (
    <Card title="A form" actions={<FormActions style={{ marginTop: 0 }}><Button>Cancel</Button><Button variant="primary">Save</Button></FormActions>}>
      <FormGrid>
        <Field label="Name" help="Letters, digits and dashes." required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app" required />
        </Field>
        <Field label="Port" error="Must be between 1 and 65535.">
          <Input type="number" defaultValue={70000} />
        </Field>
        <Field label="Server">
          <Select defaultValue="srv-b">
            <option>srv-a</option>
            <option>srv-b</option>
            <option>srv-c</option>
          </Select>
        </Field>
        <Field label="Disabled">
          <Input disabled defaultValue="read only" />
        </Field>
        <Field label="Notes" wide help="Monospace, resizable.">
          <Textarea defaultValue={'one\ntwo'} />
        </Field>
        <Field label="Deploy on push" help="A checkbox field puts its label beside the box.">
          <Checkbox defaultChecked />
        </Field>
        <Field label="Answer DNS queries from the guest VLAN as well as from the trusted one" help="A long label wraps beside the box.">
          <Checkbox />
        </Field>
      </FormGrid>
      <h3>A Checkbox outside a Field</h3>
      <div className="hu-stack" style={{ gap: 'var(--space-1)' }}>
        <label className="hu-row">
          <Checkbox defaultChecked /> In a row, the box stays before its text
        </label>
        <label className="hu-row">
          <Checkbox /> ip firewall filter <span className="hu-muted">Drop invalid</span>
        </label>
      </div>
    </Card>
  )
}

function Modals() {
  const [open, setOpen] = useState<'' | 'normal' | 'wide'>('')
  const here = useRef<HTMLDivElement>(null)
  return (
    <div ref={here} className="hu-row">
      <Button onClick={() => setOpen('normal')}>Open modal</Button>
      <Button onClick={() => setOpen('wide')}>Open wide modal</Button>
      {open && (
        <Modal
          title={open === 'wide' ? 'A wide modal' : 'Delete kwicky?'}
          wide={open === 'wide'}
          container={here.current?.closest('[data-theme]')}
          onClose={() => setOpen('')}
          footer={
            <>
              <Button onClick={() => setOpen('')}>Cancel</Button>
              <Button variant={open === 'wide' ? 'primary' : 'danger'} onClick={() => setOpen('')}>
                {open === 'wide' ? 'Save' : 'Delete'}
              </Button>
            </>
          }
        >
          {open === 'wide' ? (
            <FormGrid>
              <Field label="Name">
                <Input autoFocus defaultValue="kwicky" />
              </Field>
              <Field label="Server">
                <Input defaultValue="srv-a" />
              </Field>
              <Field label="Notes" wide>
                <Textarea defaultValue="Escape, the ×, or a click outside closes it." />
              </Field>
            </FormGrid>
          ) : (
            <p>This removes the app's containers. Its data volume is kept.</p>
          )}
        </Modal>
      )}
    </div>
  )
}

function TabsDemo() {
  const [tab, setTab] = useState('users')
  const id = useId()
  return (
    <Card title="Settings (as in a SettingsModal)">
      <Tabs
        label="Settings"
        idPrefix={`tabs${id}`}
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'users', label: 'Users' },
          { key: 'groups', label: 'Groups' },
          { key: 'tokens', label: 'API tokens' },
          { key: 'later', label: 'Disabled', disabled: true },
        ]}
      />
      <TabPanel idPrefix={`tabs${id}`} tabKey={tab}>
        <p>The {tab} tab's content. Arrow keys, Home and End move between tabs.</p>
      </TabPanel>
    </Card>
  )
}

function PanelTabsDemo() {
  const [edge, setEdge] = useState('main')
  return (
    <PanelTabs
      label="Edges"
      value={edge}
      onChange={setEdge}
      tabs={[
        { key: 'main', label: 'main', sub: '· srv1a' },
        { key: 'admin', label: 'admin', sub: '· srv1b' },
        { key: 'later', label: 'spare', disabled: true },
      ]}
    >
      <h2>{edge} edge</h2>
      <p>Everything in the panel belongs to the {edge} tab. Arrow keys, Home and End move between tabs.</p>
      <div className="hu-row">
        <Button sm>Preview</Button>
        <Button sm variant="primary">Apply</Button>
      </div>
    </PanelTabs>
  )
}

const DIFF = `--- applied/Caddyfile
+++ generated/Caddyfile
@@ -4,7 +4,7 @@
 kwicky.kenjabber.ai {
-  reverse_proxy kwicky-backend:8000
+  reverse_proxy kwicky-backend:8080
 }
@@ -20,3 +20,6 @@ stocker.kenjabber.ai {
 }
+nestegg.kenjabber.ai {
+  reverse_proxy nestegg-web:3000 # a long line to show the colour spanning the scroll width when the box scrolls sideways
+}
`

function FeedbackDemo() {
  return (
    <div className="hu-stack">
      <Banner kind="ok">Deployed kwicky at a1b2c3d.</Banner>
      <Banner kind="info">The NAS is off; backups wait for it.</Banner>
      <Banner kind="warn" title="2 warnings" items={['FINNHUB_API_KEY is not in the vault.', 'The edge has not been applied.']} />
      <Banner kind="bad">Could not reach srv-b: connection refused.</Banner>
      <Banner kind="neutral">A neutral note.</Banner>
      <Loading what="Loading servers" />
      <Facts
        items={[
          ['App', 'kwicky'],
          ['Commit', <span className="hu-mono">a1b2c3d4e5f6</span>],
          ['Server', 'srv-a'],
          ['Last backup', null],
          HOSTS.length > 99 && ['Temperature', '48 °C (skipped: a falsy entry)'],
        ]}
      />
      <Facts mono items={[['Path', '/opt/kwicky/src'], ['Image', 'kwicky-backend:ac-a1b2c3d4e5f6']]} />
      <div className="hu-row">
        <ConfirmButton label="Delete" title="Delete kwicky?" message="This removes the app's containers. Its data volume is kept." danger onConfirm={() => {}} />
        <ConfirmButton label="Restart" title="Restart stocker?" message="The app is down for a few seconds." sm onConfirm={() => {}} />
      </div>
      <h3 className="hu-row">
        Edges <InfoButton title="Edges">An edge is a Caddy that routes names to apps. Escape or a click elsewhere closes this.</InfoButton>
      </h3>
    </div>
  )
}

function Base() {
  return (
    <div className="hu-stack">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>
        Body text with a <a href="#base">link</a>, some <code>inline code</code>, and a <kbd>⌘K</kbd>.
        <span className="hu-muted"> Muted text.</span>
      </p>
      <p className="hu-hint">A hint, in --text-secondary.</p>
      <pre>
        <code>{'npm install house-ui\nimport "house-ui/house-ui.css"'}</code>
      </pre>
      <div className="hu-row">
        <Button>Tab to me: focus ring</Button>
        <Input placeholder="Focus me" style={{ width: '12rem' }} />
      </div>
    </div>
  )
}

function KitchenSink() {
  const sections = [
    ['tokens', 'Tokens'],
    ['base', 'Base'],
    ['shell', 'AppShell'],
    ['page', 'PageHead and Card'],
    ['fill', 'Page fill (list page)'],
    ['fillcard', 'Card fill'],
    ['buttons', 'Button'],
    ['chips', 'Chip'],
    ['tables', 'Table and TableFilter'],
    ['forms', 'Form pieces'],
    ['modal', 'Modal'],
    ['tabs', 'Tabs and PanelTabs'],
    ['diff', 'DiffView'],
    ['feedback', 'Banner, Facts, ConfirmButton, InfoButton'],
    ['auth', 'AuthPage'],
  ]
  return (
    <div className="ks">
      <div className="ks-top">
        <h1>house-ui kitchen sink</h1>
        <nav>
          {sections.map(([id, t]) => (
            <a key={id} href={`#${id}`}>
              {t}
            </a>
          ))}
        </nav>
      </div>

      <Section id="tokens" title="Tokens">
        <Pair>{() => <Swatches />}</Pair>
        <Pair>{() => <TypeScale />}</Pair>
      </Section>

      <Section id="base" title="Base">
        <Pair>{() => <Base />}</Pair>
      </Section>

      <Section id="shell" title="AppShell">
        <p className="hu-hint">Desktop (wider than 980px): the sidebar's « collapses it to icons.</p>
        <Stacked>{() => <DemoShell title="NetConfig" />}</Stacked>
        <p className="hu-hint">A SidebarSection of SidebarItems below the links (stocker's scenarios, kwicky's site tree).</p>
        <Stacked>{() => <DemoShell title="stocker" withBelow />}</Stacked>
        <p className="hu-hint">Collapsed: icons only; the area below the links is hidden.</p>
        <Stacked>{() => <DemoShell title="stocker" defaultCollapsed withBelow />}</Stacked>
        <p className="hu-hint">Compact (980px and below): the header's menu button opens the sidebar as an overlay.</p>
        <Pair>
          {() => (
            <div className="ks-narrow">
              <DemoShell title="kwicky" withBelow />
            </div>
          )}
        </Pair>
        <p className="hu-hint">
          Phone width (600px and below): the UserMenu is its icon alone, with the name and badge at the top of the open
          menu, and the title keeps its room.
        </p>
        <Pair>
          {() => (
            <div className="ks-narrow">
              <DemoShell title="kwicky" user="bootstrap" badge="admin" initial="Settings and access for every page" />
            </div>
          )}
        </Pair>
      </Section>

      <Section id="page" title="PageHead and Card">
        <Pair>
          {() => (
            <div className="hu-stack">
              <PageHead
                title="Hosts"
                subtitle="Every host NetConfig knows about."
                actions={
                  <>
                    <Button>Download CSV</Button>
                    <Button variant="primary">Add host</Button>
                  </>
                }
              />
              <PageHead title="A title alone" />
              <PageHead
                title="Runs"
                hideTitle
                actions={
                  <>
                    <Input inline size={12} aria-label="filter" placeholder="Filter…" />
                    <Button variant="primary">New run</Button>
                  </>
                }
              />
              <p className="hu-hint">
                hideTitle (above): the h1 is there for screen readers only, so the head is a toolbar of its actions.
                A list page whose title is AppShell&apos;s title uses it.
              </p>
              <PageHead
                title="Runs"
                subtitle="An inline Select in the actions is as wide as its content."
                actions={
                  <Select inline aria-label="kind" defaultValue="">
                    <option value="">all kinds</option>
                    <option>deploy</option>
                    <option>rollback</option>
                  </Select>
                }
              />
              <Card title="Card with head actions" headActions={<Button sm>Edit</Button>}>
                <p>The body.</p>
              </Card>
              <Card title="Card with actions" actions={<><Button>Cancel</Button><Button variant="primary">Save</Button></>}>
                <p>The actions sit under the body, right-aligned.</p>
              </Card>
              <Card>
                <p>A card with only a body.</p>
              </Card>
              <Card
                title="Logs (inline controls in the head)"
                headActions={
                  <>
                    <Select inline aria-label="service" defaultValue="">
                      <option value="">all services</option>
                      <option>backend</option>
                    </Select>
                    <Input inline size={6} aria-label="tail" defaultValue="200" />
                    <Button sm>Refresh</Button>
                  </>
                }
              >
                <p className="hu-hint">The head's Select and Input stay their own width.</p>
              </Card>
              <Card title="Containers (blocks and sub-headings)">
                <Banner kind="warn">2 containers are restarting.</Banner>
                <TableWrap>
                  <Table>
                    <thead>
                      <tr><th>Name</th><th>State</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>kwicky-backend</td><td><Chip kind="ok">running</Chip></td></tr>
                      <tr><td>stocker-web</td><td><Chip kind="warn">restarting</Chip></td></tr>
                    </tbody>
                  </Table>
                </TableWrap>
                <h3>Timers</h3>
                <TableWrap>
                  <Table>
                    <thead>
                      <tr><th>Timer</th><th>Next</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>appconfig-backup@kwicky</td><td>in 41 min</td></tr>
                    </tbody>
                  </Table>
                </TableWrap>
                <p className="hu-hint">Body blocks get an even gap; an h3 in a card is a sub-heading, more space above than below.</p>
              </Card>
            </div>
          )}
        </Pair>
      </Section>

      <Section id="fill" title="Page fill (list page)">
        <p className="hu-hint">
          Page fill, PageHead hideTitle and TableWrap fill with Table stickyHead: the AppShell header names the page, the
          table takes the rest of the height and scrolls by itself.
        </p>
        <Stacked>{() => <DemoShell title="AppConfig" list />}</Stacked>
        <p className="hu-hint">Compact (375px).</p>
        <Pair>
          {() => (
            <div className="ks-narrow">
              <DemoShell title="AppConfig" list />
            </div>
          )}
        </Pair>
      </Section>

      <Section id="fillcard" title="Card fill">
        <p className="hu-hint">
          Page fill with one Card fill: the card is as tall as the main area, its head and Banner keep their height, and a
          .hu-fill split takes the rest; the list on the left scrolls by itself, the main area does not.
        </p>
        <Stacked>{() => <DemoShell title="NetConfig" card />}</Stacked>
        <p className="hu-hint">Compact (375px): at 600px and below the card is an ordinary card and the main area scrolls.</p>
        <Pair>
          {() => (
            <div className="ks-narrow">
              <DemoShell title="NetConfig" card />
            </div>
          )}
        </Pair>
      </Section>

      <Section id="buttons" title="Button">
        <Pair>{() => <Buttons />}</Pair>
      </Section>

      <Section id="chips" title="Chip">
        <Pair>{() => <Chips />}</Pair>
      </Section>

      <Section id="tables" title="Table and TableFilter">
        <Pair>{() => <Tables />}</Pair>
        <p className="hu-hint">TableDetailRow: a click on a row opens its editor right under it (kwicky Settings → Access).</p>
        <Pair>{() => <AccessTable />}</Pair>
      </Section>

      <Section id="forms" title="Form pieces">
        <Pair>{() => <Forms />}</Pair>
      </Section>

      <Section id="modal" title="Modal">
        <Pair>{() => <Modals />}</Pair>
      </Section>

      <Section id="tabs" title="Tabs and PanelTabs">
        <Pair>{() => <TabsDemo />}</Pair>
        <p className="hu-hint">PanelTabs: tabs that own a panel (AppConfig's Edges, NetConfig).</p>
        <Pair>{() => <PanelTabsDemo />}</Pair>
      </Section>

      <Section id="diff" title="DiffView">
        <Pair>{() => <DiffView diff={DIFF} />}</Pair>
      </Section>

      <Section id="feedback" title="Banner, Facts, ConfirmButton, InfoButton">
        <Pair>{() => <FeedbackDemo />}</Pair>
      </Section>

      <Section id="auth" title="AuthPage">
        <Pair>{() => <AuthPages />}</Pair>
      </Section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KitchenSink />
  </StrictMode>,
)
