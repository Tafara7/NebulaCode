import React from "react";
import ProjectPreview from "./ProjectPreview";

function ProjectList({ projects }) {
  return (
    <div className="project-list">
      <h3>User's Repositories</h3>
      {projects.map((proj, index) => (
        <ProjectPreview
          key={index}
          name={proj.name}
          description={`${proj.stars} ⭐ | ${proj.collaborators} Collaborators`}
          time={`Tags: ${proj.tags.join(", ")}`}
        />
      ))}
    </div>
  );
}

export default ProjectList;
