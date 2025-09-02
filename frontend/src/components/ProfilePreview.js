import React from "react";

function ProfilePreview({ username, bio }) {
  return (
    <div className="profile-preview">
      <div className="profile-avatar">👤</div>
      <div>
        <h4>{username}</h4>
        <p>{bio}</p>
      </div>
    </div>
  );
}

export default ProfilePreview;
