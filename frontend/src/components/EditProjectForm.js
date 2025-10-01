import React, { useState, useEffect } from "react";

const EditProjectForm = ({ project, setProject }) => {
  const [form, setForm] = useState(project || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(project || {});
  }, [project]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) {
      setError("Project name required.");
      return;
    }
    setError("");
    fetch(`/api/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => setProject(form))
      .catch(() => setError("Update failed."));
  }

  return (
    <div className="edit-project-form">
      <h3>Edit Project</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Project Name"
          value={form.name || ""}
          onChange={handleChange}
        />
        <input
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags ? form.tags.join(", ") : ""}
          onChange={e =>
            setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()) })
          }
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description || ""}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Save Changes</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default EditProjectForm;