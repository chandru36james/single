import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  role: "admin" | "staff" | "viewer" | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "staff" | "viewer" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthContext: Auth state changed", user?.email);
      setUser(user);
      
      if (user) {
        try {
          console.log("AuthContext: Fetching role for", user.uid);
          // Set a timeout for the role fetch to prevent infinite loading
          const rolePromise = getDoc(doc(db, "users", user.uid));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Role fetch timeout")), 5000)
          );

          const userDoc = await Promise.race([rolePromise, timeoutPromise]) as any;
          let assignedRole: "admin" | "staff" | "viewer" = "viewer";
          
          if (userDoc.exists()) {
            assignedRole = userDoc.data().role as any;
            console.log("AuthContext: Role found in Firestore:", assignedRole);
          } else {
            console.log("AuthContext: No user document found, checking bypass list");
            const adminEmails = ["vgotyou3@gmail.com", "chandru@gmail.com"];
            if (adminEmails.includes(user.email || "")) {
              assignedRole = "admin";
            } else {
              assignedRole = "viewer";
            }
          }
          
          console.log(`AuthContext: User ${user.email} assigned role: ${assignedRole}`);
          setRole(assignedRole);
        } catch (error) {
          console.error("AuthContext: Error fetching user role:", error);
          // Fallback for default admin even if Firestore fetch fails or times out
          const adminEmails = ["vgotyou3@gmail.com", "chandru@gmail.com"];
          const fallbackRole = adminEmails.includes(user.email || "") ? "admin" : "viewer";
          console.log(`AuthContext: User ${user.email} fallback role: ${fallbackRole}`);
          setRole(fallbackRole);
        }
      } else {
        console.log("AuthContext: No user logged in");
        setRole(null);
      }
      
      console.log("AuthContext: Setting loading to false");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
