import React, { useState, useEffect } from "react";

const EditProfileForm = ({ user, setUser }) => {
  const [form, setForm] = useState(user || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email) {
      setError("Username and email required.");
      return;
    }
    setError("");
    fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => setUser(form))
      .catch(() => setError("Update failed."));
  }

  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username || ""}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleChange}
        />
        <input
          name="bio"
          type="text"
          placeholder="Short Bio"
          value={form.bio || ""}
          onChange={handleChange}
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={form.location || ""}
          onChange={handleChange}
        />
        <input
          name="joined"
          type="text"
          placeholder="Joined"
          value={form.joined || ""}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default EditProfileForm;