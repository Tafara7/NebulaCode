import React from "react";

const Profile = ({ username, bio, location, joined}) => {
  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar"><img src="/assets/icons/user.png" alt="User" /></div>
        <h2>{username}</h2>
      </div>
      <p><strong>Short Bio:</strong> {bio}</p>
      <div className="profile-details">
        <span><strong>Location:</strong> {location}</span>
        <span><strong>Joined:</strong> {joined}</span>
      </div>
    </div>
  );
}

export default Profile;
