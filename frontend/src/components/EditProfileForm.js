import React, { useState, useEffect } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

const EditProfileForm = ({ user, setUser, onProfileUpdate }) => {
  const [form, setForm] = useState(user || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email) {
      setError("Username and email required.");
      return;
    }
    setError("");
    const { _id, ...updatePayload } = form;
    try {
      await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const res = await fetch(`/api/users/${user._id}`);
      const updated = await res.json();
      setUser(updated);
      if (onProfileUpdate) onProfileUpdate();
    } catch {
      setError("Update failed.");
    }
  }

  async function handleImageUploadSuccess(updatedUser) {
    setUser(updatedUser);
    if (onProfileUpdate) onProfileUpdate();
  }

  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>
      <div style={{ marginTop: 12 }}>
        <ProfileImageUpload userId={user._id} onUploadSuccess={handleImageUploadSuccess} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label htmlFor="edit-username">Username</label>
        <input id="edit-username" name="username" type="text" placeholder="Username" value={form.username || ""} onChange={handleChange} />

        <label htmlFor="edit-email">Email</label>
        <input id="edit-email" name="email" type="email" placeholder="Email" value={form.email || ""} onChange={handleChange} />

        <label htmlFor="edit-bio">Short Bio</label>
        <input id="edit-bio" name="bio" type="text" placeholder="Short Bio" value={form.bio || ""} onChange={handleChange} />

        <label htmlFor="edit-location">Location</label>
        <input id="edit-location" name="location" type="text" placeholder="Location" value={form.location || ""} onChange={handleChange} />

        <label htmlFor="edit-joined">Joined</label>
        <input id="edit-joined" name="joined" type="text" placeholder="Joined" value={form.joined || ""} onChange={handleChange} />

        <button type="submit" style={{ marginTop: "1.2rem" }}>Save Changes</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default EditProfileForm;