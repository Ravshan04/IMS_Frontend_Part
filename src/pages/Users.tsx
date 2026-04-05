import { useState, useMemo } from 'react';
import { Users as UsersIcon, Loader2, Shield, MapPin, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUsers, useUpdateUserRoles, useUpdateUserWarehouses, useUpdateUserStatus, useCreateUser } from '@/hooks/useUsers';
import { useWarehouses } from '@/hooks/useWarehouses';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserSummary } from '@/types/database';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const AVAILABLE_ROLES = ['Owner', 'Admin', 'Manager', 'WarehouseOperator', 'Viewer'];

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
  const [editRole, setEditRole] = useState<string>('');
  const [editWarehouseIds, setEditWarehouseIds] = useState<string[]>([]);

  // Create user state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'Viewer'
  });

  const warehouseMap = useMemo(() => new Map((warehouses || []).map(w => [w.id, w])), [warehouses]);

  const handleEditUser = (user: UserSummary) => {
    setSelectedUser(user);
    setEditRole(user.roles[0] || 'Viewer');
    setEditWarehouseIds(user.warehouse_ids);
    setEditModalOpen(true);
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    await updateRoles.mutateAsync({ userId: selectedUser.id, roles: [editRole] });
    setEditModalOpen(false);
  };

  const handleSaveWarehouses = async () => {
    if (!selectedUser) return;
    await updateWarehouses.mutateAsync({ userId: selectedUser.id, warehouseIds: editWarehouseIds });
    setEditModalOpen(false);
  };

  const handleToggleStatus = async (user: UserSummary) => {
    await updateStatus.mutateAsync({ userId: user.id, isActive: !user.is_active });
  };

  const handleCreateUser = async () => {
    try {
      const response = await createUser.mutateAsync({
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });
      
      if (response && response.userId) {
        if (newUser.role !== 'Owner') {
          await updateRoles.mutateAsync({ userId: response.userId, roles: [newUser.role] });
        }
        setCreateModalOpen(false);
        setNewUser({ email: '', firstName: '', lastName: '', password: '', role: 'Viewer' });
      }
    } catch (e) {
      // Error handled by mutation
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
      render: (item: UserSummary) => {
        const roleVariants: Record<string, "default" | "destructive" | "secondary"> = {
          Owner: 'destructive',
          Admin: 'destructive',
          Manager: 'default',
          WarehouseOperator: 'secondary',
          Viewer: 'secondary',
        };
        return (
          <div className="flex flex-wrap gap-1">
            {item.roles.map((r) => (
              <Badge key={r} variant={roleVariants[r] || 'secondary'} className="capitalize text-[10px] font-bold">
                {r}
              </Badge>
            ))}
          </div>
        );
      },
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
            className={cn("h-8 px-3 text-xs font-bold", !item.is_active && "text-success")}
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
          >
            {item.is_active ? <ToggleRight className="w-3.5 h-3.5 mr-1" /> : <ToggleLeft className="w-3.5 h-3.5 mr-1" />}
            {item.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ], [warehouseMap, t]);

  const toggleWarehouse = (whId: string) => {
    setEditWarehouseIds(prev =>
      prev.includes(whId) ? prev.filter(id => id !== whId) : [...prev, whId]
    );
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title={t('users')}
          description={t('users_description')}
        >
          <Button onClick={() => setCreateModalOpen(true)} className="rounded-xl font-bold gap-2">
            <UsersIcon className="w-4 h-4" />
            {t('add')} {t('users')}
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UsersIcon className="w-16 h-16" />
            </div>
            <h3 className="font-black text-3xl mb-1">{users?.length || 0}</h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t('total_users')}</p>
          </div>
          <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h3 className="font-black text-3xl mb-1">{users?.filter(u => u.is_active).length || 0}</h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t('active_users')}</p>
          </div>
          <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h3 className="font-black text-3xl mb-1">
              {users?.filter(u => u.roles.includes('Admin') || u.roles.includes('Owner')).length || 1}
            </h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t('admin_count')}</p>
          </div>
        </div>

        {/* Table */}
        <div className="animate-slide-up glass border-border/30 rounded-3xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-card/50">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading users...</p>
            </div>
          ) : (
            <DataTable
              data={users || []}
              columns={columns}
              searchKeys={['first_name', 'last_name', 'email']}
              emptyMessage="No users found."
            />
          )}
        </div>

        {/* Create User Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('add')} {t('users')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('first_name')}</Label>
                  <Input 
                    value={newUser.firstName} 
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('last_name')}</Label>
                  <Input 
                    value={newUser.lastName} 
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} 
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                  placeholder="Set account password"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <Select value={newUser.role} onValueChange={(val) => setNewUser({...newUser, role: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button onClick={handleCreateUser} disabled={createUser.isPending} className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                {createUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('add')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t('edit')} - {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Role */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t('role')}</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger className="bg-secondary/50 border-border/50 rounded-xl h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleSaveRoles}
                  disabled={updateRoles.isPending}
                  className="w-full mt-2 rounded-xl h-10"
                >
                  {t('save')} {t('role')}
                </Button>
              </div>

              {/* Warehouses */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t('warehouses')}</Label>
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {warehouses?.map(wh => (
                    <button
                      key={wh.id}
                      type="button"
                      onClick={() => toggleWarehouse(wh.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                        editWarehouseIds.includes(wh.id)
                          ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {wh.name}
                    </button>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveWarehouses}
                  disabled={updateWarehouses.isPending}
                  className="w-full mt-2 rounded-xl h-10"
                >
                  {t('save')} {t('warehouses')}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
