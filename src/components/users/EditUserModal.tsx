import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROLES, ROLE_OPTIONS } from '@/constants/roles';
import { cn } from '@/lib/utils';
import type { UserSummary, Warehouse } from '@/types/database';

interface EditUserModalProps {
  open: boolean;
  user: UserSummary | null;
  warehouses: Warehouse[] | undefined;
  onOpenChange: (open: boolean) => void;
  onSaveRole: (role: string) => Promise<void> | void;
  onSaveWarehouses: (warehouseIds: string[]) => Promise<void> | void;
  isSavingRole: boolean;
  isSavingWarehouses: boolean;
}

/**
 * Edit-user dialog. Two independent save paths (role and warehouse-list) so the
 * admin can update either one without resubmitting the other; this matches the
 * backend, which exposes them as separate mutations.
 */
export default function EditUserModal({
  open,
  user,
  warehouses,
  onOpenChange,
  onSaveRole,
  onSaveWarehouses,
  isSavingRole,
  isSavingWarehouses,
}: EditUserModalProps) {
  const { t } = useLanguage();
  const [role, setRole] = useState<string>(ROLES.Viewer);
  const [warehouseIds, setWarehouseIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setRole(user.roles[0] ?? ROLES.Viewer);
    setWarehouseIds(user.warehouse_ids);
  }, [user]);

  const toggleWarehouse = (id: string) =>
    setWarehouseIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('edit')} - {user?.first_name} {user?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              {t('role')}
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-secondary/50 border-border/50 rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => onSaveRole(role)}
              disabled={isSavingRole}
              className="w-full mt-2 rounded-xl h-10"
            >
              {t('save')} {t('role')}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              {t('warehouses')}
            </Label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
              {warehouses?.map(wh => (
                <button
                  key={wh.id}
                  type="button"
                  onClick={() => toggleWarehouse(wh.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors',
                    warehouseIds.includes(wh.id)
                      ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                      : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {wh.name}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => onSaveWarehouses(warehouseIds)}
              disabled={isSavingWarehouses}
              className="w-full mt-2 rounded-xl h-10"
            >
              {t('save')} {t('warehouses')}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
