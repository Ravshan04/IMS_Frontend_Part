import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROLE_OPTIONS, ROLES } from '@/constants/roles';

interface CreateUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

const EMPTY_FORM: CreateUserFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: ROLES.Viewer,
};

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  isSubmitting: boolean;
}

/**
 * Create-user dialog. Owns its own form state — the parent only sees the final
 * payload via <c>onSubmit</c>. Form is reset to defaults whenever the dialog opens.
 */
export default function CreateUserModal({ open, onOpenChange, onSubmit, isSubmitting }: CreateUserModalProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<CreateUserFormValues>(EMPTY_FORM);

  const handleOpenChange = (next: boolean) => {
    if (next) setValues(EMPTY_FORM);
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    await onSubmit(values);
  };

  const update = (patch: Partial<CreateUserFormValues>) =>
    setValues(prev => ({ ...prev, ...patch }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('add')} {t('users')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('first_name')}</Label>
              <Input
                value={values.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('last_name')}</Label>
              <Input
                value={values.lastName}
                onChange={(e) => update({ lastName: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => update({ email: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={values.password}
              onChange={(e) => update({ password: e.target.value })}
              placeholder="Set account password"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('role')}</Label>
            <Select value={values.role} onValueChange={(role) => update({ role })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="rounded-xl">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { CreateUserFormValues };
