import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const SplashPage = () => {
  return (
    <div className="splash">
      <Header />

      <main className="main-content">
        <h1>Where Ideas Expand. Where Code Evolves.</h1>
        <h2>Version control, reimagined in the cloud of collaboration</h2>

        <div className="info-boxes">
          <div className="info-box">
            <p>NebulaCode is a next-generation version control and collaboration platform for developers.</p>
          </div>
          <div className="info-box">
            <p>Share projects, track code changes, collaborate with friends, and explore the galaxy of open-source innovation — all in one unified platform.</p>
          </div>
        </div>

        <h3>Join the Nebula – and shape the future of code, together.</h3>
        <LoginForm />
      </main>
    </div>
  );
}

export default SplashPage;
