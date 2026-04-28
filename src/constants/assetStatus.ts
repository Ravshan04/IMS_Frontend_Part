import type { AssetStatus, AssetCondition } from '@/types/database';

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'success' | 'outline';

const ASSET_STATUS_VARIANTS: Record<AssetStatus, BadgeVariant> = {
  InWarehouse: 'success',
  Assigned: 'default',
  InRepair: 'secondary',
  Lost: 'destructive',
  Retired: 'outline',
};

export function getAssetStatusVariant(status: AssetStatus): BadgeVariant {
  return ASSET_STATUS_VARIANTS[status] ?? 'secondary';
}

const ASSET_CONDITION_VARIANTS: Record<AssetCondition, BadgeVariant> = {
  New: 'success',
  Good: 'default',
  Damaged: 'secondary',
  Broken: 'destructive',
};

export function getAssetConditionVariant(condition: AssetCondition): BadgeVariant {
  return ASSET_CONDITION_VARIANTS[condition] ?? 'secondary';
}
