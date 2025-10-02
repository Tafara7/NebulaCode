import React from "react";

const ProjectPreview = ({ name, description, time }) => {
  return (
    <div className="project-preview">
      <h4 className="project-title">{name}</h4>
      <p className="project-desc">{description}</p>
      <span className="project-tags">{time}</span>
    </div>
  );
}

export default ProjectPreview;