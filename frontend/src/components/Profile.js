import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ username, bio, location, joined }) => {
  const navigate = useNavigate();

  function handleProfileClick() {
    navigate(`/profile/${username}`);
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar"><img src="/assets/icons/user.png" alt="User" /></div>
        <h2
          style={{ cursor: "pointer", color: "#a020f0", textDecoration: "underline" }}
          onClick={handleProfileClick}
          title="View profile"
        >
          {username}
        </h2>
      </div>
      <p><strong>Short Bio:</strong> {bio}</p>
      <div className="profile-details">
        <span><strong>Location:</strong> {location}</span>
        <span><strong>Joined:</strong> {joined}</span>
      </div>
    </div>
  );
};

export default Profile;