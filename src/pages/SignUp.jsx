import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import "../styles/Login.css";
import Swal from "sweetalert2";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      // 1. Input validation
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
  
      // 2. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. Create Firestore document with the same ID as auth UID
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email.toLowerCase().trim(),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
  
      // 4. Create empty favorites collection
      await setDoc(doc(db, "userFavorites", userCredential.user.uid), {
        favorites: [],
        lastUpdated: serverTimestamp()
      });
  
      // 5. Success handling
      await Swal.fire({
        title: "Welcome!",
        text: "Account created successfully",
        icon: "success",
        timer: 2000
      });
  
      // 6. Redirect
      navigate("/");
  
    } catch (error) {
      console.error("Signup error:", error);
      
      let userFriendlyError = "Signup failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        userFriendlyError = "This email is already registered";
      } else if (error.code === "auth/weak-password") {
        userFriendlyError = "Password should be at least 6 characters";
      } else if (error.message.includes("permission")) {
        userFriendlyError = "Account created but setup failed. Please login.";
      } else if (error.message) {
        userFriendlyError = error.message;
      }
  
      setError(userFriendlyError);
      await Swal.fire({
        title: "Oops!",
        text: userFriendlyError,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="login-header">
          <h1>Create an account</h1>
          <p>Join us today!</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignUp} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength="2"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (min 8 characters)</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength="8"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="signup-link">
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/")}
            className="text-link"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
