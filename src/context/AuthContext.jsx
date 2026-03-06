import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import tokenManager from '../utils/tokenManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = tokenManager.getToken();

        // Also check legacy key 'token' and migrate if needed
        const legacyToken = localStorage.getItem('token');
        if (!token && legacyToken) {
          tokenManager.setToken(legacyToken);
          localStorage.removeItem('token');
        }

        const activeToken = token || legacyToken;

        if (storedUser && activeToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
        tokenManager.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    tokenManager.setToken(token);
    // Clean up legacy key if exists
    localStorage.removeItem('token');
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    tokenManager.clearAuth();
    // Clean up legacy key if exists
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
