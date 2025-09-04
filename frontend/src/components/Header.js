import React from "react";
import { Link } from "react-router-dom";

const Header = ({ username }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/icons/saturn.png" alt="Saturn" /> NebulaCode
        {username && <span style={{ marginLeft: "1rem" }}>Welcome, {username}!</span>}
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to={`/profile/${username || "Profile"}`}>Profile</Link></li>
          <li><Link to="/Projects">Projects</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="#"><span className="search-icon"><img src="/assets/icons/search.png" alt="Saturn" /></span></Link></li>
          <li><Link to="#"><span className="profile-icon"><img src="/assets/icons/user.png" alt="User" /></span></Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;