
'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (newRole: UserRole, userData?: User) => void;
  logout: () => void;
  updateUserData: (newUserData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const storedUserJson = localStorage.getItem('thiqbi-user');
      if (storedUserJson) {
        const parsedUser = JSON.parse(storedUserJson) as User;
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('AuthProvider: Failed to initialize auth state from localStorage:', e);
      setUser(null);
      localStorage.removeItem('thiqbi-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const role = useMemo(() => user?.role || 'guest', [user]);

  const performLogin = useCallback((newRole: UserRole, userData?: User) => {
    const defaultName = `${newRole.charAt(0).toUpperCase() + newRole.slice(1)} User`;
    const defaultEmail = `${newRole}@example.com`;
    const defaultAvatar = `https://placehold.co/40x40.png?text=${newRole.charAt(0).toUpperCase()}`;

    const baseUser: User = {
      id: userData?.id || `mock-id-${newRole}-${Date.now()}`,
      name: userData?.name || defaultName,
      email: userData?.email || defaultEmail,
      avatarUrl: userData?.avatarUrl || defaultAvatar,
      role: newRole,
      specializations: userData?.specializations || (newRole === 'professional' ? [] : undefined),
      availability: userData?.availability || (newRole === 'professional' ? '' : undefined),
      phoneNumber: userData?.phoneNumber || '',
      state: userData?.state || '',
      isApproved: newRole === 'professional' ? (userData?.isApproved === undefined ? false : userData.isApproved) : undefined,
    };
    
    const loggedInUser: User = {
        ...baseUser,
        ...(userData || {}),
        role: newRole,
        isApproved: newRole === 'professional' 
                      ? (userData?.isApproved !== undefined ? userData.isApproved : false) 
                      : undefined,
    };

    setUser(loggedInUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('thiqbi-user', JSON.stringify(loggedInUser));
      } catch (e) {
        console.error('AuthProvider: Failed to save auth state to localStorage:', e);
      }
    }
  }, []);

  const performLogout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('thiqbi-user');
      } catch (e) {
        console.error('AuthProvider: Failed to remove auth state from localStorage:', e);
      }
    }
  }, []);

  const performUpdateUserData = useCallback((newUserData: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...newUserData };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('thiqbi-user', JSON.stringify(updatedUser));
        } catch (e) {
          console.error('AuthProvider: Failed to save updated user state to localStorage:', e);
        }
      }
      return updatedUser;
    });
  }, []);


  const contextValue = useMemo(() => ({
    user,
    role,
    login: performLogin,
    logout: performLogout,
    updateUserData: performUpdateUserData,
    isLoading,
  }), [user, role, performLogin, performLogout, performUpdateUserData, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
