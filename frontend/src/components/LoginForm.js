import React from "react";

function LoginForm() {
  return (
    <div className="login-container">
      <p>Don't have an account? <a href="#">Sign Up</a></p>
      <form className="login-form">
        <input type="text" placeholder="Username or email address" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;
