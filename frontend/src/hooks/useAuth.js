import { useState, useEffect } from 'react';
import authService from '../services/authService';
import userAuthService from '../services/userAuthService';

export function useAuth() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(authService.isAuthenticated());
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(userAuthService.isAuthenticated());

  // Listen for storage changes (including from other tabs)
  useEffect(() => {
    const checkAuth = () => {
      setIsAdminAuthenticated(authService.isAuthenticated());
      setIsUserAuthenticated(userAuthService.isAuthenticated());
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage events
    window.addEventListener('storage', checkAuth);

    // Custom event for same-tab updates
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return { isAdminAuthenticated, isUserAuthenticated };
}