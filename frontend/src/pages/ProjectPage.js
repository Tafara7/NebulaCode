import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Project from "../components/Project";
import Files from "../components/Files";
import Messages from "../components/Messages";
import EditProjectForm from "../components/EditProjectForm";
import Toast from "../components/Toast";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!projectId || projectId === "undefined") {
      navigate("/Home");
      return;
    }
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);

        setFiles(data.files || ["README.md", "main.js", "utils/helpers.js"]);
      });

    fetch(`/api/checkins/project/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return setCheckins([]);
        setCheckins(data);
      });

    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers);
  }, [projectId, navigate]);

  function handleFileClick(filename) {
    setSelectedFile(filename);

    setFileContent(`// Preview of ${filename}\n\nfunction hello() {\n  console.log("Hello from ${filename}!");\n}`);
  }

  function handleFilePreviewClick() {
    if (selectedFile) {
      setToast({ type: "info", message: `Opened file: ${selectedFile}` });

    }
  }

  function getUsername(userId) {
    const user = users.find(u => u._id === userId);
    return user ? user.username : userId;
  }

  function getCollaboratorNames(ids) {
    if (!ids) return [];
    return ids.map(id => getUsername(id));
  }

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-page">
      <Header />
      <main className="project-content">
        <Project
          name={project.name}
          owner={getUsername(project.ownerId)}
          collaborators={getCollaboratorNames(project.memberIds)}
          tags={project.tags}
        />

        <section className="project-sections">
          <div className="left-column">
            <Files
              files={files}
              selectedFile={selectedFile}
              onFileClick={handleFileClick}
            />
            <Messages
              checkins={checkins.map(c => ({
                user: c.username || getUsername(c.userId),
                timeAgo: new Date(c.createdAt).toLocaleString(),
                message: c.message,
              }))}
              projectId={projectId}
            />
          </div>

          <div className="right-column">
            <h3
              className="file-preview-title"
              style={{ cursor: selectedFile ? "pointer" : "default" }}
              onClick={handleFilePreviewClick}
              title={selectedFile ? "Open file" : ""}
            >
              File Preview {selectedFile && `- ${selectedFile}`}
            </h3>
            <div className="file-preview">
              {selectedFile ? (
                <pre style={{ textAlign: "left", background: "#181830", color: "#fff", padding: "1rem", borderRadius: "8px", minHeight: "120px" }}>
                  {fileContent}
                </pre>
              ) : (
                <span style={{ color: "#aaa" }}>[Select a file to preview]</span>
              )}
            </div>
            <EditProjectForm project={project} setProject={setProject} setToast={setToast} />
          </div>
        </section>
        <Toast toast={toast} setToast={setToast} />
      </main>
    </div>
  );
};

export default ProjectPage;