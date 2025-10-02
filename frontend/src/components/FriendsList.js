import React from "react";
import ProfilePreview from "./ProfilePreview";
import { useNavigate } from "react-router-dom";

const FriendsList = ({ friends, onUnfriend }) => {
  const navigate = useNavigate();

  function handleUnfriend(friendId, friendName) {
    if (onUnfriend) onUnfriend(friendId, friendName);
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="friends-list">
        <h3>Friends</h3>
        <p>No friends yet.</p>
      </div>
    );
  }
  return (
    <div className="friends-list">
      <h3>Friends</h3>
      <div className="friends-list-cards">
        {friends.map((friend, index) => (
          <div key={index} className="friend-card">
            <div
              className="friend-profile"
              onClick={() => navigate(`/profile/${friend.username}`)}
              title={`View ${friend.username}'s profile`}
            >
              <ProfilePreview username={friend.username} bio={friend.bio} />
            </div>
            <button
              className="friend-unfriend-btn"
              onClick={() => handleUnfriend(friend._id, friend.username)}
            >
              Unfriend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;