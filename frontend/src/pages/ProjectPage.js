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
  const [checkins, setCheckins] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [toast, setToast] = useState(null);
  const [friendsOfMe, setFriendsOfMe] = useState([]);
  const [addingMemberId, setAddingMemberId] = useState("");
  const [versionsModal, setVersionsModal] = useState(null);

  const logged = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!projectId || projectId === "undefined") {
      navigate("/Projects");
      return;
    }
    reloadAll();
  }, [projectId]);

  async function reloadAll() {
    try {
      const [pRes, cRes, uRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/checkins/project/${projectId}`),
        fetch("/api/users")
      ]);
      const p = await pRes.json();
      const c = await cRes.json().catch(() => []);
      const us = await uRes.json();
      setProject(p);
      setCheckins(Array.isArray(c) ? c : []);
      setUsers(us || []);
      if (logged) {
        const me = (us || []).find(u => u._id === logged._id) || {};
        const friends = (me.friends || []).map(fid => (us || []).find(u => u._id === fid)).filter(Boolean);
        setFriendsOfMe(friends);
      }
    } catch (err) {
      console.error("Failed to load project page", err);
      navigate("/Projects");
    }
  }

  function isAdmin() {
    return logged && logged.role === "admin";
  }
  function isOwner() {
    return logged && project && String(project.ownerId) === String(logged._id);
  }
  function isMember() {
    return logged && project && ((project.memberIds || []).some(m => String(m) === String(logged._id)) || isOwner());
  }

  function handleFileClick(filename) {
    setSelectedFile(filename);
    const file = (project?.files || []).find(f => f.filename === filename);
    if (!file) {
      setFileContent("[file not found]");
      return;
    }
    if (typeof file.content === "string" && file.content.startsWith("data:")) {
      setFileContent("[Binary / image file preview not available]");
    } else {
      setFileContent(file.content || "");
    }
  }

  async function handleAddFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result;
      await fetch(`/api/projects/${projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: f.name, content, uploadedBy: logged ? logged._id : null, message: "added file" })
      });
      setToast({ type: "success", message: "File added" });
      await reloadAll();
    };
    if (f.type.startsWith("text") || f.name.endsWith(".md") || f.name.endsWith(".js") || f.name.endsWith(".json")) {
      reader.readAsText(f);
    } else {
      reader.readAsDataURL(f);
    }
  }

  async function handleUpdateFile(newContent, message = "update") {
    if (!selectedFile) return;
    await fetch(`/api/projects/${projectId}/files/${encodeURIComponent(selectedFile)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent, uploadedBy: logged ? logged._id : null, message })
    });
    setToast({ type: "success", message: "File updated" });
    await reloadAll();
    setFileContent(newContent);
  }

  async function handleDeleteFile(filename) {
    if (!window.confirm(`Delete file ${filename}?`)) return;
    await fetch(`/api/projects/${projectId}/files/${encodeURIComponent(filename)}`, { method: "DELETE" });
    setToast({ type: "info", message: "File removed" });
    await reloadAll();
    setSelectedFile(null);
    setFileContent("");
  }

  async function handleGetVersions(filename) {
    const res = await fetch(`/api/projects/${projectId}/files/${encodeURIComponent(filename)}/versions`);
    const versions = await res.json();
    return versions;
  }

  async function openVersions(filename) {
    const versions = await handleGetVersions(filename);
    setVersionsModal({ filename, versions });
  }

  async function handleRollback(filename, index) {
    if (!window.confirm("Rollback to selected version?")) return;
    await fetch(`/api/projects/${projectId}/files/${encodeURIComponent(filename)}/rollback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ versionIndex: index, performedBy: logged ? logged._id : null, message: "rollback performed" })
    });
    setToast({ type: "info", message: "Rollback applied" });
    await reloadAll();
    setVersionsModal(null);
  }

  async function handleDownloadFile(filename) {
    const p = await fetch(`/api/projects/${projectId}`).then(r => r.json());
    const file = (p.files || []).find(f => f.filename === filename);
    if (!file) return setToast({ type: "error", message: "File not found" });
    if (typeof file.content === "string" && file.content.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = file.content;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const blob = new Blob([file.content || ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }

  async function handleAddMember() {
    if (!addingMemberId) return;
    await fetch(`/api/projects/${projectId}/addMember`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: addingMemberId })
    });
    setToast({ type: "success", message: "Member added" });
    setAddingMemberId("");
    await reloadAll();
  }

  async function handleRemoveMember(memberId) {
    if (!window.confirm("Remove member from project?")) return;
    await fetch(`/api/projects/${projectId}/removeMember`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId })
    });
    setToast({ type: "info", message: "Member removed" });
    await reloadAll();
  }

  async function handleTransferOwnership(newOwnerId) {
    if (!window.confirm("Transfer ownership to this user?")) return;
    await fetch(`/api/projects/${projectId}/transferOwner`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOwnerId })
    });
    setToast({ type: "success", message: "Ownership transferred" });
    await reloadAll();
  }

  async function toggleCheckout() {
    if (!project) return;
    const checkedOutBy = project.checkedOutBy ? null : (logged ? logged._id : null);
    await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkedOutBy })
    });
    setToast({ type: "info", message: checkedOutBy ? "Checked out" : "Checked in" });
    await reloadAll();
  }

  if (!project) return (
    <div className="project-page">
      <Header username={logged?.username} />
      <main className="project-content"><div>Loading...</div></main>
    </div>
  );

  return (
    <div className="project-page">
      <Header username={logged?.username} />
      <main className="project-content">
        {project.image && (
          <div className="project-image-wrap">
            <img className="project-image" src={project.image} alt="project" />
          </div>
        )}

        <Project
          projectId={project._id}
          name={project.name}
          owner={(users.find(u => String(u._id) === String(project.ownerId)) || {}).username}
          collaborators={(project.memberIds || []).map(mid => (users.find(u => String(u._id) === String(mid)) || {}).username).filter(Boolean)}
          tags={project.tags || []}
        />

        <div className="project-status-row">
          <div className="status-pill">
            Status: <strong>{project.checkedOutBy ? "Checked out" : "Checked in"}</strong>
          </div>
          <div>
            <button className="btn" onClick={toggleCheckout}>{project.checkedOutBy ? "Check In" : "Check Out"}</button>
            {(isOwner() || isAdmin()) && (
              <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={async () => {
                if (!window.confirm("Delete project?")) return;
                await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
                setToast({ type: "info", message: "Project deleted" });
                navigate("/Projects");
              }}>Delete Project</button>
            )}
          </div>
        </div>

        <section className="project-sections">
          <div className="left-column">
            <div className="card">
              <h3>Files</h3>
              <Files
                files={(project.files || []).map(f => f.filename)}
                selectedFile={selectedFile}
                onFileClick={handleFileClick}
              />

              <div className="file-ops">
                <label className="file-input-label">Add file</label>
                <input className="file-input" type="file" onChange={handleAddFile} />
                <div className="file-ops-buttons">
                  <button className="btn" onClick={() => selectedFile && handleDownloadFile(selectedFile)}>Download Selected</button>
                  {selectedFile && (isMember() || isAdmin()) && (
                    <>
                      <button className="btn" onClick={() => openVersions(selectedFile)} style={{ marginLeft: 8 }}>Versions</button>
                      <button className="btn" onClick={() => handleDeleteFile(selectedFile)} style={{ marginLeft: 8 }}>Delete Selected</button>
                    </>
                  )}
                </div>
              </div>

              <div className="file-content">
                <h4>File Preview</h4>
                {selectedFile ? (
                  <>
                    <div className="file-name">{selectedFile}</div>
                    {fileContent && !fileContent.startsWith("[Binary") ? (
                      <>
                        <textarea className="file-editor" value={fileContent} onChange={(e) => setFileContent(e.target.value)} />
                        <div style={{ marginTop: 8 }}>
                          <button className="btn" onClick={() => handleUpdateFile(fileContent, "edited in browser")}>Save Changes</button>
                        </div>
                      </>
                    ) : (
                      <div className="file-preview-msg">{fileContent || "[No preview]"}</div>
                    )}
                  </>
                ) : (
                  <div className="file-preview-msg">Select a file to view or edit</div>
                )}
              </div>
            </div>

            <Messages
              checkins={checkins.map(c => ({
                user: c.username || c.userId,
                timeAgo: new Date(c.createdAt).toLocaleString(),
                message: c.message,
              }))}
              projectId={projectId}
            />
          </div>

          <aside className="right-column">
            <div className="card">
              <EditProjectForm project={project} setProject={setProject} setToast={setToast} isAdmin={isAdmin()} isOwner={isOwner()} />
            </div>

            <div className="card members-card">
              <h4>Members</h4>
              <div className="member-list">
                <div className="member-row"><strong>Owner:</strong> {(users.find(u => String(u._id) === String(project.ownerId)) || {}).username || '(unknown)'}</div>
                {(project.memberIds || []).map(mid => {
                  const u = users.find(u => String(u._id) === String(mid));
                  return (
                    <div key={mid} className="member-row">
                      <span className="member-name">{u ? u.username : mid}</span>
                      <div className="member-actions">
                        {(isOwner() || isAdmin()) && u && <button className="btn btn-small" onClick={() => handleTransferOwnership(u._id)}>Make Owner</button>}
                        {(isOwner() || isAdmin()) && u && <button className="btn btn-small" onClick={() => handleRemoveMember(u._id)} style={{ marginLeft: 8 }}>Remove</button>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="add-member">
                <label>Add friend as member</label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <select value={addingMemberId} onChange={e => setAddingMemberId(e.target.value)}>
                    <option value="">-- select friend --</option>
                    {friendsOfMe.map(f => <option key={f._id} value={f._id}>{f.username}</option>)}
                  </select>
                  <button className="btn" onClick={handleAddMember}>Add</button>
                </div>
                <div className="hint">Only friends are listed above.</div>
              </div>
            </div>

            <div className="card">
              <h4>Project Info</h4>
              <p><strong>Tags:</strong> {(project.tags || []).map(t => `#${t}`).join(' ')}</p>
              <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
            </div>
          </aside>
        </section>

        <Toast toast={toast} setToast={setToast} />

        {versionsModal && (
          <div className="modal-backdrop" onClick={() => setVersionsModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Versions for {versionsModal.filename}</h4>
              <div className="versions-list">
                {(versionsModal.versions || []).map((v, i) => (
                  <div key={i} className="version-row">
                    <div className="version-meta">{i} — {(v.message || "").slice(0, 60)} — {new Date(v.createdAt).toLocaleString()}</div>
                    <div className="version-actions">
                      <button className="btn btn-small" onClick={() => {
                        if (!window.confirm("Restore this version?")) return;
                        handleRollback(versionsModal.filename, i);
                      }}>Restore</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <button className="btn" onClick={() => setVersionsModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectPage;