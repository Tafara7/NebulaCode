import React from "react";

const Messages = ({ checkins }) => {
  if (!checkins || checkins.length === 0) {
    return (
      <div className="messages">
        <h3>Check-In History</h3>
        <p>No check-ins yet.</p>
      </div>
    );
  }
  return (
    <div className="messages">
      <h3>Check-In History</h3>
      <ul>
        {checkins.map((msg, index) => (
          <li key={index}>
            <strong>@{msg.user}</strong> · {msg.timeAgo} <br />
            [Commit] "{msg.message}"
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;