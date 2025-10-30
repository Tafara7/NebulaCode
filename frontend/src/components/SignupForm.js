import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("All fields required.");
      return;
    }
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data._id) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/Home");
      } else {
        setError("Signup failed.");
      }
    } catch {
      setError("Signup failed.");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} aria-label="signup form">
        <label htmlFor="signup-username">Username</label>
        <input id="signup-username" name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} />

        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <button type="submit">Sign Up</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default SignupForm;