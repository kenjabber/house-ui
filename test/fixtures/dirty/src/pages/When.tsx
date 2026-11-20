// Dates by hand: each is reported (D-25).
export const a = (iso: string) => iso.replace("T", " ").slice(0, 16)
export const b = (iso: string) => new Date(iso).toLocaleString()
export const c = (iso: string) => new Date(iso).toLocaleDateString()
export const d = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit" })
// Fine: a number's thousands separators.
export const e = (n: number) => n.toLocaleString()
