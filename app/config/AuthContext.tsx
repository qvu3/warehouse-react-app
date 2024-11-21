// AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      if (storedEmail) {
        setIsAuthenticated(true);
        setUserEmail(storedEmail);
      }
    } catch (error) {
      console.error("Error checking stored auth:", error);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setUserEmail(email);
      await AsyncStorage.setItem("userEmail", email);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserEmail(null);
      await AsyncStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userEmail, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
