import React from "react";
import ProjectPreview from "./ProjectPreview";

const ProjectList = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="project-list">
        <h3>User's Repositories</h3>
        <p>No projects found.</p>
      </div>
    );
  }
  return (
    <div className="project-list">
      <h3>User's Repositories</h3>
      {projects.map((proj, index) => (
        <ProjectPreview
          key={index}
          name={proj.name}
          description={proj.description}
          time={`Tags: ${proj.tags ? proj.tags.join(", ") : ""}`}
        />
      ))}
    </div>
  );
};

export default ProjectList;