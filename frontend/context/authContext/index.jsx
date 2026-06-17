import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { useEffect } from "react";
import { useContext } from "react";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currUser, setcurrUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setcurrUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setcurrUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }
  const value = {
    currUser,
    userLoggedIn,
    loading,
  };

  returun(
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
