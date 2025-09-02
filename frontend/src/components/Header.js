import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
        <div className="logo"><img src="/assets/icons/saturn.png" alt="Saturn" /> NebulaCode </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to="/Profile">Profile</Link></li>
          <li><Link to="/Projects">Projects</Link></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Sign Up</a></li>
          <li><a href="#">Log In</a></li>
          <li><a href="#"><span className="search-icon"><img src="/assets/icons/saturn.png" alt="Saturn" /></span></a></li>
          <li><a href="#"><span className="profile-icon"><img src="/assets/icons/user.png" alt="User" /></span></a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;