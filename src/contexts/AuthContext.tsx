import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile, AppRole } from '@/types/database';
import { apiService } from '@/services/apiService';

interface User {
  id: string;
  email: string;
}

interface Session {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
}

interface SessionStorage extends Session {
  userId?: string;
  access_token?: string;
}

interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: string | null;
  permissions: string[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAdminOrManager: boolean;
  canManageCatalog: boolean;
  canManageInventory: boolean;
  canManageUsers: boolean;
  canReadEverything: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedSession = localStorage.getItem('ombor_session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession) as SessionStorage;
        const userId = sessionData.userId ?? '1';
        const now = new Date().toISOString();
        setSession(sessionData);
        setUser({ id: userId, email: sessionData.email });
        setProfile({
          id: userId,
          first_name: sessionData.firstName ?? null,
          last_name: sessionData.lastName ?? null,
          email: sessionData.email ?? null,
          phone: null,
          avatar_url: null,
          created_at: now,
          updated_at: now,
        });
        setRole(sessionData.roles?.[0] || 'Viewer');
        setPermissions(sessionData.permissions || []);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', { email, password });
      const sessionData: Session = {
        token: response.token,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        organizationId: response.organizationId,
        roles: response.roles,
        permissions: response.permissions
      };
      
      localStorage.setItem('ombor_session', JSON.stringify(sessionData));
      setSession(sessionData);
      const userId = response.userId ?? '1';
      const now = new Date().toISOString();
      setUser({ id: userId, email: response.email });
      setProfile({
        id: userId,
        first_name: response.firstName ?? null,
        last_name: response.lastName ?? null,
        email: response.email ?? null,
        phone: null,
        avatar_url: null,
        created_at: now,
        updated_at: now,
      });
      setRole(response.roles?.[0] || 'Viewer');
      setPermissions(response.permissions || []);
      
      return { error: null };
    } catch (error: unknown) {
      console.error('Login failed:', error);
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await apiService.post<void>('/auth/register', { 
        email, 
        password, 
        firstName, 
        lastName,
        organizationId: '00000000-0000-0000-0000-000000000001'
      });
      return signIn(email, password);
    } catch (error: unknown) {
      return { error: error instanceof Error ? error : new Error('Registration failed') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('ombor_session');
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
  };

  const hasPermission = (permission: string) => permissions.includes(permission);

  const isAdminOrManager = role === 'Owner' || role === 'Admin' || role === 'Manager';
  
  const canManageCatalog = hasPermission('CatalogWrite');
  const canManageInventory = hasPermission('InventoryWrite');
  const canManageUsers = hasPermission('UserWrite');
  const canReadEverything = hasPermission('InventoryRead') || hasPermission('CatalogRead');

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        permissions,
        loading,
        signIn,
        signUp,
        signOut,
        hasPermission,
        isAdminOrManager,
        canManageCatalog,
        canManageInventory,
        canManageUsers,
        canReadEverything,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
