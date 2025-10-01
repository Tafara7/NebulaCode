import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Project from "../components/Project";
import Files from "../components/Files";
import Messages from "../components/Messages";
import EditProjectForm from "../components/EditProjectForm";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    // Fetch project details
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setProject(data));

    // Fetch files (stub: you may want to add a files API)
    // setFiles(["/src/", "- App.js", ...]);

    // Fetch check-ins
    fetch(`/api/checkins/project/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setCheckins(
          data.map(c => ({
            user: c.userId, // You may want to resolve userId to username
            timeAgo: new Date(c.createdAt).toLocaleString(),
            message: c.message,
          }))
        );
      });
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-page">
      <Header />
      <main className="project-content">
        <Project
          name={project.name}
          owner={project.ownerId}
          collaborators={project.memberIds}
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
            <EditProjectForm project={project} setProject={setProject} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;