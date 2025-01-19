import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: { firstName: string; lastName: string } | null;
  login: (userData: { firstName: string; lastName: string; isFirstLogin: boolean }) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  // Vérification du token au démarrage pour maintenir l'état de l'authentification
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: { firstName: string; lastName: string; isFirstLogin: boolean}) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData)); // Sauvegarder l'utilisateur dans le localStorage
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user'); // Supprimer l'utilisateur du localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
