import React, { useState } from "react";

const CreateProject = ({ ownerId, onProjectCreated }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.description) {
      setError("Name and description required.");
      return;
    }
    setError("");
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ownerId,
        memberIds: [ownerId],
        tags: [],
        createdAt: new Date().toISOString(),
      }),
    })
    .then(res => res.json())
    .then((createdProject) => {
      if (onProjectCreated) onProjectCreated(createdProject);
      setForm({ name: "", description: "" });
      setError("");
    })
  }

  return (
    <div className="create-project">
      <h3>Create a New Project</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          name="name"
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <button type="submit" style={{ marginTop: "1.2rem" }}>Create</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default CreateProject;