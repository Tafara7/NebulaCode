import React from "react";

const Project = ({ name, owner, collaborators, tags }) => {
  return (
    <div className="project-header">
      <h2> Project: {name}</h2>
      <p><strong> Owner:</strong> @{owner}</p>
      <p><strong> Collaborators:</strong> [{collaborators.map(c => "@" + c).join(", ")}]</p>
      <p><strong> Tags:</strong> {tags.join(", ")}</p>
      <button className="star-btn"> Star Project</button>
    </div>
  );
}

export default Project;
