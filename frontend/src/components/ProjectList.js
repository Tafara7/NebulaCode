import React from "react";
import ProjectPreview from "./ProjectPreview";

const ProjectList = ({ projects, onProjectClick, onProjectDeleted }) => {
  const stored = localStorage.getItem("user");
  const loggedIn = stored ? JSON.parse(stored) : null;

  function handleDeleteProject(projectId) {
    if (!window.confirm("Delete this project?")) return;
    fetch(`/api/projects/${projectId}`, { method: "DELETE" })
      .then(() => {
        if (typeof onProjectDeleted === "function") {
          onProjectDeleted(projectId);
        }
      });
  }

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
        <div
          key={proj._id || index}
          className="project-list-card"
          style={{ cursor: onProjectClick ? "pointer" : "default" }}
          onClick={onProjectClick ? () => onProjectClick(proj._id) : undefined}
        >
          <ProjectPreview
            name={proj.name}
            description={proj.description}
            time={`Tags: ${proj.tags ? proj.tags.join(", ") : ""}`}
            tags={proj.tags}
            image={proj.image}
            onTagClick={() => {}}
          />
          {loggedIn && String(proj.ownerId) === String(loggedIn._id) && (
            <button
              className="project-delete-btn"
              onClick={e => {
                e.stopPropagation();
                handleDeleteProject(proj._id);
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;