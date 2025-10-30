import React, { useState } from "react";

const Messages = ({ checkins, projectId }) => {
  const [message, setMessage] = useState("");
  const loggedIn = JSON.parse(localStorage.getItem("user"));

  function handleCheckin(e) {
    e.preventDefault();
    fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        userId: loggedIn._id,
        message,
        createdAt: new Date().toISOString()
      })
    })
      .then(res => res.json())
      .then((newCheckin) => {

        if (typeof onCheckin === "function") {
          onCheckin(newCheckin);
        }
        setMessage("");
      });
  }

  function handleDownload() {
    alert("Download project files (not implemented)");
  }

  return (
    <div className="messages">
      <h3>Check-In History</h3>
      <button onClick={handleDownload} className="download-btn">Download Project Files</button>
      <form onSubmit={handleCheckin} style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Check-in message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ width: "90%", marginBottom: "0.5rem" }}
        />
        <button type="submit" className="checkin-btn">Check In</button>
      </form>
      <ul className="checkin-list">
        {checkins && checkins.length > 0 ? checkins.map((msg, index) => (
          <li key={index} className="checkin-item">
            <span className="checkin-user">@{msg.user}</span>
            <span className="checkin-time">· {msg.timeAgo}</span>
            <div className="checkin-message">[Commit] <span className="checkin-msg-text">"{msg.message}"</span></div>
          </li>
        )) : <p style={{ color: "#aaa" }}>No check-ins yet.</p>}
      </ul>
    </div>
  );
};

export default Messages;