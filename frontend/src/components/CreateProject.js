import React, { useState, useRef } from "react";

const CreateProject = ({ ownerId, onProjectCreated }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const imageInputRef = useRef();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      if (file.type.startsWith("text") || file.name.endsWith(".md") || file.name.endsWith(".js") || file.name.endsWith(".json")) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  }

  async function handleFilesSelected(e) {
    const list = Array.from(e.target.files || []);
    const mapped = await Promise.all(list.map(async f => ({
      filename: f.name,
      content: await fileToDataUrl(f)
    })));
    setFiles(prev => [...prev, ...mapped]);
  }

  async function handleImageSelected(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.readAsDataURL(f);
  }

  async function handleDropFiles(e) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    const mapped = await Promise.all(list.map(async f => ({
      filename: f.name,
      content: await fileToDataUrl(f)
    })));
    setFiles(prev => [...prev, ...mapped]);
  }

  function handleRemoveFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function generateTagsFromFiles(fileList) {
    const tokens = new Set();
    fileList.forEach(f => {
      const base = f.filename.replace(/\.[^/.]+$/, "");
      base.split(/[^a-zA-Z0-9]+/).forEach(tok => {
        if (tok.length >= 2) tokens.add(tok.toLowerCase());
      });
      const ext = (f.filename.match(/\.(\w+)$/) || [])[1];
      if (ext) tokens.add(ext.toLowerCase());
    });
    return Array.from(tokens).slice(0, 10);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.description) {
      setError("Name and description required.");
      return;
    }
    setError("");

    const tags = generateTagsFromFiles(files);
    const payload = {
      name: form.name,
      description: form.description,
      ownerId,
      memberIds: [ownerId],
      tags,
      createdAt: new Date().toISOString(),
      image: imageDataUrl,
      files: files.map(f => ({ filename: f.filename, content: f.content, uploadedBy: ownerId, createdAt: new Date().toISOString(), versions: [{ content: f.content, uploadedBy: ownerId, createdAt: new Date().toISOString(), message: "initial commit" }] }))
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const created = await res.json();
      if (onProjectCreated) onProjectCreated(created);
      setForm({ name: "", description: "" });
      setFiles([]);
      setImageDataUrl(null);
    } catch (err) {
      setError("Failed to create project");
    }
  }

  return (
    <div className="create-project" style={{ padding: 12 }}>
      <h3>Create a New Project</h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label htmlFor="proj-name">Project Name</label>
        <input id="proj-name" name="name" type="text" placeholder="Project Name" value={form.name} onChange={handleChange} />

        <label htmlFor="proj-desc">Description</label>
        <textarea id="proj-desc" name="description" placeholder="Project Description" value={form.description} onChange={handleChange} />

        <div style={{ width: "100%", maxWidth: 420, marginTop: 12 }}>
          <label>Project Image (click or drag & drop)</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              const f = e.dataTransfer.files && e.dataTransfer.files[0];
              if (f) {
                const dataUrl = await fileToDataUrl(f);
                setImageDataUrl(dataUrl);
              }
            }}
            onClick={() => imageInputRef.current.click()}
            style={{ border: "2px dashed #444", padding: 12, borderRadius: 8, cursor: "pointer", color: "#ddd" }}
          >
            {imageDataUrl ? <img src={imageDataUrl} alt="project" style={{ maxWidth: "100%", borderRadius: 6 }} /> : <div>Click or drop an image to upload</div>}
            <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelected} />
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 420, marginTop: 12 }}>
          <label>Project Files (click or drag files here)</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropFiles}
            onClick={() => fileInputRef.current.click()}
            style={{ border: "2px dashed #444", padding: 12, borderRadius: 8, cursor: "pointer", color: "#ddd" }}
          >
            <div>Click or drop files to add</div>
            <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleFilesSelected} />
          </div>

          <div style={{ marginTop: 8, textAlign: "left" }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", padding: 6, borderRadius: 6, marginBottom: 6 }}>
                <div style={{ fontSize: 14 }}>{f.filename}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleRemoveFile(i)} className="btn btn-small">Remove</button>
                </div>
              </div>
            ))}
            {files.length === 0 && <div style={{ color: "#aaa" }}>No files added</div>}
          </div>
        </div>

        <button type="submit" style={{ marginTop: 12 }}>Create Project</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
};

export default CreateProject;