import {
  ArrowDownLeft,
  ArrowUpRight,
  FileEdit,
  History,
  RefreshCcw,
  ShieldCheck,
  Undo2,
  User,
  type LucideIcon,
} from 'lucide-react';

export type MovementType =
  | 'IN'
  | 'OUT'
  | 'TRANSFER'
  | 'ADJUSTMENT'
  | 'RETURN'
  | 'ASSIGNMENT'
  | 'REPAIR';

export interface MovementTypeConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const MOVEMENT_CONFIGS: Record<MovementType, MovementTypeConfig> = {
  IN: { label: 'Inbound', icon: ArrowDownLeft, color: 'text-success', bg: 'bg-success/10' },
  OUT: { label: 'Outbound', icon: ArrowUpRight, color: 'text-destructive', bg: 'bg-destructive/10' },
  TRANSFER: { label: 'Transfer', icon: RefreshCcw, color: 'text-primary', bg: 'bg-primary/10' },
  ADJUSTMENT: { label: 'Adjustment', icon: FileEdit, color: 'text-warning', bg: 'bg-warning/10' },
  RETURN: { label: 'Return', icon: Undo2, color: 'text-muted-foreground', bg: 'bg-muted' },
  ASSIGNMENT: { label: 'Assignment', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  REPAIR: { label: 'Repair', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

const FALLBACK_CONFIG: MovementTypeConfig = {
  label: 'Unknown',
  icon: History,
  color: 'text-muted-foreground',
  bg: 'bg-muted',
};

/**
 * Maps a stock-movement type ("IN", "OUT", etc.) to the visual config used in
 * tables and badges across the app. Falls back to a neutral "unknown" config
 * with the type string surfaced as the label so unrecognized values don't
 * disappear silently.
 */
export function getMovementTypeConfig(type: string): MovementTypeConfig {
  const config = MOVEMENT_CONFIGS[type as MovementType];
  if (!config) {
    return { ...FALLBACK_CONFIG, label: type };
  }
  return config;
}

/** Movement types whose quantity displays as a negative (outbound from a warehouse). */
const NEGATIVE_QUANTITY_TYPES: ReadonlySet<MovementType> = new Set(['OUT', 'TRANSFER']);

export function isNegativeMovement(type: string, quantity: number): boolean {
  if (NEGATIVE_QUANTITY_TYPES.has(type as MovementType)) return true;
  return type === 'ADJUSTMENT' && quantity < 0;
}
