// house-ui: the components (PLAN D-9). The stylesheet is separate:
// import 'house-ui/house-ui.css' once in main.tsx, before the app's own CSS.
export { AppShell, type AppShellProps } from './components/AppShell'
export { Sidebar, SidebarLink, type SidebarProps, type SidebarLinkProps } from './components/Sidebar'
export { useShell, type ShellState } from './components/shellContext'
export { PageHead, Page, type PageHeadProps } from './components/PageHead'
export { Card, type CardProps } from './components/Card'
export { Button, type ButtonProps, type ButtonVariant } from './components/Button'
export { Chip, type ChipProps, type ChipKind } from './components/Chip'
export { Table, TableWrap, TableEmpty, type TableProps } from './components/Table'
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
} from './components/Form'
export { cx } from './cx'
