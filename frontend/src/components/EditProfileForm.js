import React, { useState, useEffect } from "react";

const EditProfileForm = ({ user, setUser, onProfileUpdate }) => {
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
    const { _id, ...updatePayload } = form;
    fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    })
      .then(res => res.json())
      .then(() => {
        setUser({ ...user, ...updatePayload });
        if (onProfileUpdate) onProfileUpdate();
      })
      .catch(() => setError("Update failed."));
  }

  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        <button type="submit" style={{ marginTop: "1.2rem" }}>Save Changes</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default EditProfileForm;