import React, { useEffect } from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const SplashPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(elem => {
        const speed = elem.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        elem.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="splash">
      <Header />
      <main className="main-content">
        <div className="parallax" data-speed="0.3">
          <h1>Where Ideas Expand. Where Code Evolves.</h1>
        </div>
        
        <div className="parallax" data-speed="0.5">
          <h2>Version control, reimagined in the cloud of collaboration</h2>
        </div>

        <div className="info-boxes parallax" data-speed="0.7">
          <div className="info-box">
            <p>NebulaCode is a next-generation version control and collaboration platform for developers.</p>
          </div>
          <div className="info-box">
            <p>Share projects, track code changes, collaborate with friends, and explore the galaxy of open-source innovation — all in one unified platform.</p>
          </div>
        </div>

        <div className="parallax" data-speed="0.4">
          <h3>Join the Nebula - and shape the future of code, together.</h3>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

export default SplashPage;