import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const AuthPage = ({ setAuth, setRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "player",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await axios.post(endpoint, formData);
      if (isLogin) {
        setAuth(res.data.token);
        setRole(res.data.role);
      } else {
        alert("Registration successful, please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      alert("Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        
        <button type="button" onClick={handleAuth}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "New user? Register here" : "Already registered? Login"}
      </p>
    </div>
  );
};

export default AuthPage;
