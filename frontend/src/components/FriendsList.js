import React from "react";
import ProfilePreview from "./ProfilePreview";

const FriendsList = ({ friends}) => {
  return (
    <div className="friends-list">
      <h3>Friends</h3>
      {friends.map((friend, index) => (
        <ProfilePreview key={index} username={friend.username} bio={friend.bio} />
      ))}
    </div>
  );
}

export default FriendsList;
