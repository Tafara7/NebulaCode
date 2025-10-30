import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />
      <main className="main-content">
        <h1>Sign In to NebulaCode</h1>
        <LoginForm />
      </main>
    </div>
  );
}

export default LoginPage;