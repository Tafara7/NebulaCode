import React from "react";
import Header from "../components/Header";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="signup-page">
      <Header />
      <main className="main-content">
        <h1>Sign Up for NebulaCode</h1>
        <SignupForm />
      </main>
    </div>
  );
}

export default SignupPage;