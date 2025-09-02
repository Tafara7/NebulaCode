import React from "react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🌌 NebulaCode</div>
      <ul>
        <li><span>🏠</span> Home</li>
        <li><span>📂</span> Projects</li>
        <li><span>👥</span> Friends</li>
        <li><span>🔎</span> Explore</li>
        <li><span>⚙️</span> Settings</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
