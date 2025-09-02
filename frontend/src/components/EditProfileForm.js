import React from "react";

function EditProfileForm() {
  return (
    <div className="edit-profile-form">
      <h3>Edit Profile</h3>
      <form>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Surname" />
        <input type="email" placeholder="Email" />
        <input type="date" placeholder="Date of Birth" />
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="Postal Code" />
        <textarea placeholder="Short Bio"></textarea>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfileForm;
