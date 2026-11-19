// house-ui: the components (PLAN D-9). The stylesheet is separate:
// import 'house-ui/house-ui.css' once in main.tsx, before the app's own CSS.
export { AppShell, type AppShellProps } from './components/AppShell'
export {
  Sidebar,
  SidebarLink,
  SidebarSection,
  SidebarItem,
  SidebarAction,
  type SidebarProps,
  type SidebarLinkProps,
  type SidebarSectionProps,
  type SidebarItemProps,
} from './components/Sidebar'
export { useShell, type ShellState } from './components/shellContext'
export { PageHead, Page, type PageHeadProps, type PageProps } from './components/PageHead'
export { Card, type CardProps } from './components/Card'
export { Button, ButtonLink, type ButtonProps, type ButtonLinkProps, type ButtonVariant } from './components/Button'
export { Chip, type ChipProps, type ChipKind } from './components/Chip'
export { Table, TableWrap, TableEmpty, type TableProps, type TableWrapProps } from './components/Table'
export {
  TableFilter,
  useTableFilter,
  chipValue,
  type TableFilterProps,
  type TableFilterOptions,
  type TableFilterState,
  type ChipColumn,
  type ChipState,
} from './components/TableFilter'
export { Modal, type ModalProps } from './components/Modal'
export {
  Field,
  FormGrid,
  FormActions,
  Input,
  Checkbox,
  Select,
  Textarea,
  type FieldProps,
  type InputProps,
  type SelectProps,
} from './components/Form'
export { UserMenu, MenuItem, type UserMenuProps, type MenuItemProps } from './components/Menu'
export {
  Tabs,
  TabPanel,
  PanelTabs,
  type Tab,
  type TabsProps,
  type TabPanelProps,
  type PanelTabsProps,
} from './components/Tabs'
export { DiffView, type DiffViewProps } from './components/DiffView'
export { InfoButton, type InfoButtonProps } from './components/InfoButton'
export {
  Banner,
  Loading,
  ConfirmButton,
  Facts,
  type BannerProps,
  type ConfirmButtonProps,
  type FactsProps,
  type FactsItem,
} from './components/Feedback'
export { GearIcon, PersonIcon, MenuIcon, PlusIcon } from './components/icons'
export { cx } from './cx'
