import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type UserRole = 'ROLE_AGENT' | 'ROLE_ADMIN';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: UserRole | null;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedRole = localStorage.getItem('user_role') as UserRole | null;
    
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newRole: UserRole) => {
    setToken(newToken);
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_role', newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
