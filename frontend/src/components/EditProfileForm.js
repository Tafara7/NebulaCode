import React, { useState } from "react";

const EditProfileForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    dob: "",
    address: "",
    postalCode: "",
    bio: ""
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.surname || !form.email) {
      setError("First name, surname, and email required.");
      return;
    }
    setError("");
    alert("Profile updated!");
  }

  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} />
        <input name="surname" type="text" placeholder="Surname" value={form.surname} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
        <input name="address" type="text" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="postalCode" type="text" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} />
        <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      <button onClick={handleSubmit}>Save Changes</button>

    </div>
  );
}

export default EditProfileForm;