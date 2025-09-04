import React from "react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"></div>
      <ul>
        <li><span><img src="/assets/icons/home.png" alt="Home" /></span> Home</li>
        <li><span><img src="/assets/icons/projects.png" alt="Projects" /></span> Projects</li>
        <li><span><img src="/assets/icons/friends.png" alt="Friends" /></span> Friends</li>
        <li><span><img src="/assets/icons/explore.png" alt="Explore" /></span> Explore</li>
        <li><span><img src="/assets/icons/settings.png" alt="Settings" /></span> Settings</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
