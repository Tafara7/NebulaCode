import React from "react";
import Header from "../components/Header";
import Project from "../components/Project";
import Files from "../components/Files";
import Messages from "../components/Messages";
import EditProjectForm from "../components/EditProjectForm";

function ProjectPage() {
  const project = {
    name: "NebulaSearch",
    owner: "Tafara7",
    collaborators: ["devAstro", "Quorg"],
    tags: ["js", "ts", "ai"],
  };

  const files = [
    "/src/",
    "- App.js",
    "- SearchEngine.js",
    "/assets/",
    "- styles.css",
    "README.md",
    "package.json",
  ];

  const checkins = [
    { user: "Tafara7", timeAgo: "2 hours ago", message: "Fixed syntax bug in the new search UI" },
    { user: "devAstro", timeAgo: "1 day ago", message: "Created new component and added styles" },
    { user: "Quorg", timeAgo: "2 days ago", message: "Merged branch orbit-refactor to main" },
  ];

  return (
    <div className="project-page">
      <Header />
      <main className="project-content">
        <Project
          name={project.name}
          owner={project.owner}
          collaborators={project.collaborators}
          tags={project.tags}
        />

        <section className="project-sections">
          <div className="left-column">
            <Files files={files} />
            <Messages checkins={checkins} />
          </div>

          <div className="right-column">
            <h3> File Preview</h3>
            <div className="file-preview">
              [This is where the file preview goes]
            </div>
            <EditProjectForm />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectPage;
