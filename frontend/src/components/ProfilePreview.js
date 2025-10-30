import React from "react";

const ProfilePreview = ({ username, bio }) => {
  return (
    <div className="profile-preview">
      <div className="profile-avatar"><img src="/assets/icons/user.png" alt="User" /></div>
      <div>
        <h4>{username}</h4>
        <p>{bio}</p>
      </div>
    </div>
  );
}

export default ProfilePreview;
