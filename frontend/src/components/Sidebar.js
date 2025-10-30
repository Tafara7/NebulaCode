import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"></div>
      <ul>
        <li>
          <Link to="/Home">
            <span><img src="/assets/icons/home.png" alt="Home" /></span> Home
          </Link>
        </li>
        <li>
          <Link to="/Projects">
            <span><img src="/assets/icons/projects.png" alt="Projects" /></span> Projects
          </Link>
        </li>
        <li>
          <Link to="/profile/me">
            <span><img src="/assets/icons/friends.png" alt="Friends" /></span> Friends
          </Link>
        </li>
        <li>
          <Link to="/explore">
            <span><img src="/assets/icons/explore.png" alt="Explore" /></span> Explore
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <span><img src="/assets/icons/settings.png" alt="Settings" /></span> Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;