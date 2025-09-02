import React from "react";

function EditProjectForm() {
  return (
    <div className="edit-project-form">
      <h3>Edit Project</h3>
      <form>
        <input type="text" placeholder="Project Name" />
        <input type="text" placeholder="Collaborators (comma separated)" />
        <input type="text" placeholder="Tags (comma separated)" />
        <textarea placeholder="Project Description"></textarea>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProjectForm;
