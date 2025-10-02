import React from "react";

const Project = ({ name, owner, collaborators, tags }) => {
  return (
    <div className="project-header">
      <h2 className="project-main-title">Project: <span className="project-main-name">{name}</span></h2>
      <p><strong>Owner:</strong> <span className="project-owner">@{owner}</span></p>
      <p>
        <strong>Collaborators:</strong>{" "}
        <span className="project-collaborators">
          [{collaborators.map((c, i) => (
            <span key={i} className="project-collaborator">@{c}{i < collaborators.length - 1 ? ", " : ""}</span>
          ))}]
        </span>
      </p>
      <p><strong>Tags:</strong> <span className="project-tags">{tags && tags.length ? tags.join(", ") : "None"}</span></p>
      <button className="star-btn">Star Project</button>
    </div>
  );
}

export default Project;