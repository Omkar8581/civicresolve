import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginWithRole,
  registerCitizenAccount,
  logoutUser,
  sendPasswordReset,
  getSavedSession,
  updateUserProfile as apiUpdateProfile,
  auth,
} from '../services/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount/refresh
  useEffect(() => {
    // 1. Check local session storage first
    const saved = getSavedSession();
    if (saved) {
      setCurrentUser(saved);
      setLoading(false);
    }

    // 2. Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!saved) {
          const profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: firebaseUser.email.includes('admin') ? 'admin' : firebaseUser.email.includes('officer') ? 'officer' : 'citizen'
          };
          setCurrentUser(profile);
        }
      } else if (!saved) {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, expectedRole = null) => {
    const profile = await loginWithRole(email, password, expectedRole);
    setCurrentUser(profile);
    return profile;
  };

  const register = async (userData) => {
    const profile = await registerCitizenAccount(userData);
    setCurrentUser(profile);
    return profile;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    return await sendPasswordReset(email);
  };

  const updateProfile = async (fields) => {
    if (!currentUser?.uid) return;
    const updated = await apiUpdateProfile(currentUser.uid, fields);
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile: currentUser,
        role: currentUser?.role || null,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
