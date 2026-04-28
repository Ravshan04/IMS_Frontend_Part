import { useMemo, useState } from 'react';
import { Clock, Loader2, MapPin, Shield, ToggleLeft, ToggleRight, Users as UsersIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateUserModal, { type CreateUserFormValues } from '@/components/users/CreateUserModal';
import EditUserModal from '@/components/users/EditUserModal';
import {
  useCreateUser,
  useUpdateUserRoles,
  useUpdateUserStatus,
  useUpdateUserWarehouses,
  useUsers,
} from '@/hooks/useUsers';
import { useWarehouses } from '@/hooks/useWarehouses';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROLES, getRoleBadgeVariant } from '@/constants/roles';
import { cn } from '@/lib/utils';
import { UserSummary } from '@/types/database';

export default function Users() {
  const { t } = useLanguage();
  const { data: users, isLoading } = useUsers();
  const { data: warehouses } = useWarehouses();
  const updateRoles = useUpdateUserRoles();
  const updateWarehouses = useUpdateUserWarehouses();
  const updateStatus = useUpdateUserStatus();
  const createUser = useCreateUser();

  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const warehouseMap = useMemo(
    () => new Map((warehouses ?? []).map(w => [w.id, w])),
    [warehouses]
  );

  const handleEditUser = (user: UserSummary) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveRole = async (role: string) => {
    if (!selectedUser) return;
    await updateRoles.mutateAsync({ userId: selectedUser.id, roles: [role] });
    setEditModalOpen(false);
  };

  const handleSaveWarehouses = async (warehouseIds: string[]) => {
    if (!selectedUser) return;
    await updateWarehouses.mutateAsync({ userId: selectedUser.id, warehouseIds });
    setEditModalOpen(false);
  };

  const handleToggleStatus = (user: UserSummary) => {
    updateStatus.mutate({ userId: user.id, isActive: !user.is_active });
  };

  const handleCreateUser = async (values: CreateUserFormValues) => {
    try {
      const response = await createUser.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (response?.userId && values.role !== ROLES.Owner) {
        await updateRoles.mutateAsync({ userId: response.userId, roles: [values.role] });
      }
      setCreateModalOpen(false);
    } catch {
      // Error toasts surface via the underlying mutations.
    }
  };

  const columns = useMemo(() => [
    {
      key: 'name',
      header: t('name'),
      sortable: true,
      render: (item: UserSummary) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md">
            {(item.first_name?.charAt(0) || '') + (item.last_name?.charAt(0) || '')}
          </div>
          <div>
            <p className="font-semibold text-foreground">{item.first_name} {item.last_name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: t('role'),
      render: (item: UserSummary) => (
        <div className="flex flex-wrap gap-1">
          {item.roles.map((r) => (
            <Badge key={r} variant={getRoleBadgeVariant(r)} className="capitalize text-[10px] font-bold">
              {r}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'warehouses',
      header: t('warehouses'),
      render: (item: UserSummary) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {item.warehouse_ids.length > 0
              ? item.warehouse_ids.map(id => warehouseMap.get(id)?.name || 'Unknown').join(', ')
              : 'All'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('status'),
      render: (item: UserSummary) => (
        <Badge variant={item.is_active ? 'success' : 'destructive'} className="font-bold text-[10px]">
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'last_login',
      header: t('last_login'),
      render: (item: UserSummary) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">
            {item.last_login_at ? new Date(item.last_login_at).toLocaleDateString() : 'Never'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (item: UserSummary) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-bold"
            onClick={(e) => { e.stopPropagation(); handleEditUser(item); }}
          >
            <Shield className="w-3.5 h-3.5 mr-1" />
            {t('edit')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-8 px-3 text-xs font-bold', !item.is_active && 'text-success')}
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
          >
            {item.is_active ? <ToggleRight className="w-3.5 h-3.5 mr-1" /> : <ToggleLeft className="w-3.5 h-3.5 mr-1" />}
            {item.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ], [warehouseMap, t]);

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter(u => u.is_active).length ?? 0;
  const adminCount = users?.filter(u => u.roles.includes(ROLES.Admin) || u.roles.includes(ROLES.Owner)).length ?? 1;

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader title={t('users')} description={t('users_description')}>
          <Button onClick={() => setCreateModalOpen(true)} className="rounded-xl font-bold gap-2">
            <UsersIcon className="w-4 h-4" />
            {t('add')} {t('users')}
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <StatCard label={t('total_users')} value={totalUsers} showIcon />
          <StatCard label={t('active_users')} value={activeUsers} />
          <StatCard label={t('admin_count')} value={adminCount} />
        </div>

        <div className="animate-slide-up glass border-border/30 rounded-3xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-card/50">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                Loading users...
              </p>
            </div>
          ) : (
            <DataTable
              data={users ?? []}
              columns={columns}
              searchKeys={['first_name', 'last_name', 'email']}
              emptyMessage="No users found."
            />
          )}
        </div>

        <CreateUserModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={handleCreateUser}
          isSubmitting={createUser.isPending}
        />

        <EditUserModal
          open={editModalOpen}
          user={selectedUser}
          warehouses={warehouses}
          onOpenChange={setEditModalOpen}
          onSaveRole={handleSaveRole}
          onSaveWarehouses={handleSaveWarehouses}
          isSavingRole={updateRoles.isPending}
          isSavingWarehouses={updateWarehouses.isPending}
        />
      </div>
    </MainLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  showIcon?: boolean;
}

function StatCard({ label, value, showIcon }: StatCardProps) {
  return (
    <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      {showIcon && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <UsersIcon className="w-16 h-16" />
        </div>
      )}
      <h3 className="font-black text-3xl mb-1">{value}</h3>
      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
