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
import { auth, database } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, set, get } from "firebase/database";

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  role: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role: string | null }>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check AsyncStorage for existing auth state
    const loadStoredAuth = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedRole = await AsyncStorage.getItem("userRole");

        if (storedEmail && storedRole) {
          setIsAuthenticated(true);
          setUserEmail(storedEmail);
          setRole(storedRole);
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
      }
    };

    loadStoredAuth();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userRole = snapshot.val().role;
          setRole(userRole);
          await AsyncStorage.setItem("userRole", userRole);
          await AsyncStorage.setItem("userEmail", user.email || "");
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setRole(null);
        await AsyncStorage.removeItem("userRole");
        await AsyncStorage.removeItem("userEmail");
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = ref(database, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userRole = snapshot.val().role;
        setRole(userRole);
        await AsyncStorage.setItem("userRole", userRole);
        await AsyncStorage.setItem("userEmail", email);
        return { success: true, role: userRole };
      }
      return { success: false, role: null };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, role: null };
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Store user with default role in Firebase Realtime Database
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, {
        email,
        role: "user", // Default role
      });

      setIsAuthenticated(true);
      setUserEmail(email);
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
      setRole(null);
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userRole");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userEmail, role, login, register, logout }}
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
