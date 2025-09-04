import React from "react";

const ProjectPreview = ({ name, description, time }) => {
  return (
    <div className="project-preview">
      <h4>{name}</h4>
      <p>{description}</p>
      <span className="time">{time}</span>
    </div>
  );
}

export default ProjectPreview;
