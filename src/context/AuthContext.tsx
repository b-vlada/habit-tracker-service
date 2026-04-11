import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const newUser = await api.register({ email, password, name: name || email.split('@')[0] });
    if (newUser.id) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      throw new Error('Ошибка регистрации');
    }
  };

  const signIn = async (email: string, password: string) => {
    const foundUser = await api.login(email, password);
    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      throw new Error('Неверные данные');
    }
  };

  const logOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};