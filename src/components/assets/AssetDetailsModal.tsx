import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUpdateAssetStatus } from '@/hooks/useAssets';
import { AssetItem, AssetStatus, AssetCondition } from '@/types/database';
import { Loader2, User as UserIcon, MapPin, Tag, Clipboard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetDetailsModalProps {
  asset: AssetItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  locationName?: string;
}

export default function AssetDetailsModal({ asset, open, onOpenChange, productName, locationName }: AssetDetailsModalProps) {
  const updateStatus = useUpdateAssetStatus();
  
  const [formData, setFormData] = useState({
    status: '' as AssetStatus,
    condition: '' as AssetCondition,
    assignedUserId: '',
    notes: '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        status: asset.status,
        condition: asset.condition,
        assignedUserId: asset.assigned_to_user_id || '',
        notes: asset.notes || '',
      });
    }
  }, [asset]);

  if (!asset) return null;

  const handleUpdate = async () => {
    try {
      await updateStatus.mutateAsync({
        assetCode: asset.asset_code,
        status: formData.status,
        condition: formData.condition,
        assignedUserId: formData.assignedUserId || undefined,
        notes: formData.notes,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border border-2 rounded-3xl overflow-hidden p-0">
        <div className="bg-primary/5 p-8 border-b border-border/50">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs font-black text-primary tracking-widest">{asset.asset_code}</span>
                 </div>
                 <DialogTitle className="text-3xl font-black tracking-tight text-foreground uppercase">
                  {productName || 'Equipment Unit'}
                 </DialogTitle>
                 <p className="text-xs text-muted-foreground font-mono font-bold uppercase tracking-tight">S/N: {asset.serial_number || 'N/A'}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 border-2 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                Internal Asset
              </Badge>
           </div>
        </div>

        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status & Condition */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Clipboard className="w-3 h-3" /> Operational Status
                        </Label>
                        <Select value={formData.status} onValueChange={(val: AssetStatus) => setFormData(p => ({ ...p, status: val }))}>
                            <SelectTrigger className="bg-secondary/30 border-border h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="InWarehouse">In Storage</SelectItem>
                                <SelectItem value="Assigned">Assigned to Person</SelectItem>
                                <SelectItem value="InRepair">Maintenance / Repair</SelectItem>
                                <SelectItem value="Lost">Lost / Missing</SelectItem>
                                <SelectItem value="Retired">Retired / Written Off</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5">
                             <AlertCircle className="w-3 h-3" /> Physical Condition
                        </Label>
                        <Select value={formData.condition} onValueChange={(val: AssetCondition) => setFormData(p => ({ ...p, condition: val }))}>
                            <SelectTrigger className="bg-secondary/30 border-border h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">Brand New</SelectItem>
                                <SelectItem value="Good">Functional / Good</SelectItem>
                                <SelectItem value="Damaged">Damaged (Working)</SelectItem>
                                <SelectItem value="Broken">Broken (Not Working)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Assignment & Location */}
                <div className="space-y-6 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Current Location</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-bold text-foreground">
                                {locationName || 'Unspecified Building/Room'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5">
                             <UserIcon className="w-3 h-3" /> Responsible Person
                        </Label>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-foreground">{asset.assigned_to_user_id ? "Assigned User" : "Unassigned"}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Organization Staff</p>
                            </div>
                        </div>
                        {/* Assignment select could go here if we had a list of staff */}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Maintenance Notes / Remarks</Label>
                <textarea 
                    className="w-full h-24 bg-secondary/30 border-border border-2 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Enter any recent changes, issues or maintenance history..."
                    value={formData.notes}
                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                />
            </div>

            <DialogFooter className="pt-4 gap-3">
                <Button 
                    variant="ghost" 
                    className="rounded-full px-8 font-bold"
                    onClick={() => onOpenChange(false)}
                >
                    Discard Changes
                </Button>
                <Button 
                    className="bg-primary hover:bg-primary/90 rounded-full px-12 font-black h-12 shadow-xl shadow-primary/30"
                    onClick={handleUpdate}
                    disabled={updateStatus.isPending}
                >
                    {updateStatus.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save System Record'}
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
