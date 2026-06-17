import React from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";
import { toast } from "react-toastify";

async function storeUserData(userData) {
  try {
    const response = await fetch("http://localhost:8000/getAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("User data stored:", data);
  } catch (error) {
    console.error("Error storing user data:", error);
  }
}

function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
      const { user } = await doCreateUserWithEmailAndPassword(email, password);
      const userData = {
        email: user.email,
        firebaseUid: user.uid,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(userData);
      await storeUserData(userData);
      toast.success("Successfully signed up! Welcome aboard! 🎉");
      // Handle successful signup (e.g., redirect to dashboard)
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const { user } = await doSignInWithEmailAndPassword(email, password);
      if (!user) throw new Error("User not found in response.");
      const userData = {
        email: user.email || "Unknown email",
        firebaseUid: user.uid || "Unknown UID",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Welcome back! 👋");
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "Unknown error occurred.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user } = await doSignInWithGoogle();
      const userData = {
        email: user.email,
        firebaseUid: user.uid,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Successfully signed in with Google! 🎉");
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/Form">
            <button
              className={styles.signupbutton}
              onClick={() => {
                console.log("Hello");
                handleSignup();
              }}
            >
              Sign Up
            </button>
          </Link>
          <p>already have an account ?</p>
          <Link to="/home">
            <button className={styles.loginbutton} onClick={handleLogin}>
              Log In
            </button>
          </Link>
          <button
            className={styles.logingooglebutton}
            onClick={handleGoogleLogin}
          >
            Sign in With Google
          </button>

          {error && <p>{error}</p>}
        </div>
        <div className={styles.img}>
          <img src="./src/assets/login.jpg" alt="landing" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
