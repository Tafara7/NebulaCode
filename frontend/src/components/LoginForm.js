import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields required.");
      return;
    }
    setError("");

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.user && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/Home");
      } else {
        setError("Sign in failed.");
      }
    } catch {
      setError("Sign in failed.");
    }
  }

  return (
    <div className="login-container">
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      <form className="login-form" onSubmit={handleSubmit} aria-label="login form">
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} />

        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <button type="submit">Sign In</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default LoginForm;