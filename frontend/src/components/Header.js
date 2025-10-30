import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";

const Header = ({ username }) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="logo">
        <img src="/assets/icons/saturn.png" alt="Saturn" /> <Link to="/Home" style={{textDecoration: "none", color: "inherit"  }}>NebulaCode</Link>
        {username && <span style={{ marginLeft: "1rem" }}>Welcome, {username}!</span>}
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to={`/profile/${username || "Profile"}`}>Profile</Link></li>
          <li><Link to="/Projects">Projects</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/login">Log In</Link></li>
          <li>
            <button
              className="search-icon-btn"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowSearch(true)}
              title="Search"
            >
              <img src="/assets/icons/search.png" alt="Search" />
            </button>
          </li>
          <li><Link to="#"><span className="profile-icon"><img src="/assets/icons/user.png" alt="User" /></span></Link></li>
          {username && (
            <li>
              <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                Log Out
              </button>
            </li>
          )}
        </ul>
      </nav>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </header>
  );
}

export default Header;