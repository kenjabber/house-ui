// The kitchen sink (PLAN D-14): every component in every variant, light and
// dark side by side. `npm run dev`, then http://localhost:5673. Every new
// component gets a section here.
import { StrictMode, useId, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/house-ui.css'
import './kitchen.css'
import {
  AppShell,
  Banner,
  Button,
  ConfirmButton,
  Facts,
  GearIcon,
  InfoButton,
  Loading,
  MenuItem,
  SidebarAction,
  SidebarItem,
  SidebarSection,
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
  SidebarLink,
  Table,
  TableEmpty,
  TableFilter,
  TableWrap,
  Textarea,
  chipValue,
  useTableFilter,
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

function DemoShell({ title, defaultCollapsed, withBelow }: { title: string; defaultCollapsed?: boolean; withBelow?: boolean }) {
  const [section, setSection] = useState('Hosts')
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
            <UserMenu name="Ken" badge={withBelow ? undefined : 'admin'}>
              <MenuItem>Profile</MenuItem>
              <MenuItem danger>Sign out</MenuItem>
            </UserMenu>
          </>
        }
        sidebar={
          <Sidebar
            brand={title}
            below={
              withBelow ? <Scenarios /> : undefined
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
  const [selected, setSelected] = useState('stocker')
  return (
    <div className="hu-stack">
      <div>
        <TableFilter filter={filter} />
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>App</th>
                <th>Server</th>
                <th>Status</th>
                <th className="hu-num">CPU %</th>
              </tr>
            </thead>
            <tbody>
              {(filter.visible as Host[]).map((h) => (
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
                </tr>
              ))}
              {filter.visible.length === 0 && <TableEmpty colSpan={4}>No rows match.</TableEmpty>}
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
      </FormGrid>
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
    ['buttons', 'Button'],
    ['chips', 'Chip'],
    ['tables', 'Table and TableFilter'],
    ['forms', 'Form pieces'],
    ['modal', 'Modal'],
    ['tabs', 'Tabs'],
    ['feedback', 'Banner, Facts, ConfirmButton, InfoButton'],
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

      <Section id="buttons" title="Button">
        <Pair>{() => <Buttons />}</Pair>
      </Section>

      <Section id="chips" title="Chip">
        <Pair>{() => <Chips />}</Pair>
      </Section>

      <Section id="tables" title="Table and TableFilter">
        <Pair>{() => <Tables />}</Pair>
      </Section>

      <Section id="forms" title="Form pieces">
        <Pair>{() => <Forms />}</Pair>
      </Section>

      <Section id="modal" title="Modal">
        <Pair>{() => <Modals />}</Pair>
      </Section>

      <Section id="tabs" title="Tabs">
        <Pair>{() => <TabsDemo />}</Pair>
      </Section>

      <Section id="feedback" title="Banner, Facts, ConfirmButton, InfoButton">
        <Pair>{() => <FeedbackDemo />}</Pair>
      </Section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KitchenSink />
  </StrictMode>,
)
