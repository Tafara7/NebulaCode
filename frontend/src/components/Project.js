import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Project = ({ projectId, name, owner, collaborators = [], tags = [] }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setLoggedIn(u);
      setSaved(Array.isArray(u.savedProjects) && !!u.savedProjects.find(id => id === projectId));
    } else {
      setLoggedIn(null);
      setSaved(false);
    }
  }, [projectId]);

  async function toggleSave(e) {
    e && e.stopPropagation();
    if (!projectId) return;
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const meRes = await fetch(`/api/users/${loggedIn._id}`);
      const me = await meRes.json();
      const savedArr = Array.isArray(me.savedProjects) ? [...me.savedProjects] : [];
      const exists = savedArr.includes(projectId);
      const updated = exists ? savedArr.filter(id => id !== projectId) : [...savedArr, projectId];

      await fetch(`/api/users/${loggedIn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedProjects: updated })
      });

      const updatedUserRes = await fetch(`/api/users/${loggedIn._id}`);
      const updatedUser = await updatedUserRes.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoggedIn(updatedUser);
      setSaved(!exists);
    } catch (err) {
      console.error("Failed to save project", err);
    } finally {
      setBusy(false);
    }
  }

  function handleOwnerClick() {
    if (owner) navigate(`/profile/${owner}`);
  }

  return (
    <div className="project-header" role="region" aria-label={`Project ${name}`}>
      <h2 className="project-main-title">Project: <span className="project-main-name">{name}</span></h2>
      <p><strong>Owner:</strong> <span className="project-owner" style={{ cursor: owner ? "pointer" : "default", color: "#a020f0" }} onClick={handleOwnerClick}>@{owner}</span></p>
      <p>
        <strong>Collaborators:</strong>{" "}
        <span className="project-collaborators">
          [{collaborators.map((c, i) => (
            <span key={i} className="project-collaborator">@{c}{i < collaborators.length - 1 ? ", " : ""}</span>
          ))}]
        </span>
      </p>
      <p><strong>Tags:</strong> <span className="project-tags">{tags && tags.length ? tags.join(", ") : "None"}</span></p>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
        <button
          className="star-btn"
          onClick={toggleSave}
          disabled={busy}
          aria-pressed={saved}
          title={saved ? "Unsave project" : "Save project"}
        >
          {saved ? "Unstar" : "Star Project"}
        </button>
      </div>
    </div>
  );
}

export default Project;