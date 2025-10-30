import React, { useState, useEffect } from "react";

const EditProjectForm = ({ project, setProject, setToast, isAdmin = false, isOwner = false }) => {
  const [form, setForm] = useState(project || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(project || {});
  }, [project]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTagsChange(e) {
    setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) {
      setError("Project name required.");
      return;
    }
    if (!(isOwner || isAdmin)) {
      setError("Only project owner or admin can edit this project.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProject(updated);
      if (setToast) setToast({ type: "success", message: "Project updated!" });
    } catch {
      setError("Update failed.");
    }
  }

  return (
    <div className="edit-project-form">
      <h3>Edit Project</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          name="name"
          type="text"
          placeholder="Project Name"
          value={form.name || ""}
          onChange={handleChange}
          disabled={!(isOwner || isAdmin)}
        />
        <input
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags ? form.tags.join(", ") : ""}
          onChange={handleTagsChange}
          disabled={!(isOwner || isAdmin)}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description || ""}
          onChange={handleChange}
          disabled={!(isOwner || isAdmin)}
        ></textarea>
        <button type="submit" style={{ marginTop: "1.2rem" }} disabled={!(isOwner || isAdmin)}>Save Changes</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default EditProjectForm;