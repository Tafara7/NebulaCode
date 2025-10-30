import React from "react";
import { useNavigate } from "react-router-dom";

const randomPlaceholders = [
  "/assets/images/placeholder1.jpg",
  "/assets/images/placeholder2.jpg",
  "/assets/images/placeholder3.jpg",
  "/assets/images/placeholder4.jpg"
];

const Profile = ({ username, bio, location, joined, profileImage, isClickable = true }) => {
  const navigate = useNavigate();

  function handleProfileClick() {
    if (isClickable) navigate(`/profile/${username}`);
  }

  const src = profileImage || randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)];

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar" style={{ cursor: isClickable ? "pointer" : "default" }}>
          <img src={src} alt={`${username} avatar`} style={{ width: 120, height: 120, borderRadius: 8 }} onClick={handleProfileClick} />
        </div>
        <h2
          style={{ cursor: isClickable ? "pointer" : "default", color: "#a020f0", textDecoration: isClickable ? "underline" : "none" }}
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