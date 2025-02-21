import React, { useState } from "react";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    // if (email.includes("admin")) {
    //   navigate("/admin");
    // } else {
    //   navigate("/users");
    // }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <span>Welcome back</span>
        </div>
        <p className="title_para">Please enter your details to sign in.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="row">
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="pass">
            <a href="#">Forgot password?</a>
          </div>
          <div className="row button">
            <input type="submit" value="Login" />
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
