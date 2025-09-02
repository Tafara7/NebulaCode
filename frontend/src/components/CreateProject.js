import React from "react";

function CreateProject() {
  return (
    <div className="create-project">
      <h3>Create a New Project</h3>
      <form>
        <input type="text" placeholder="Project Name" />
        <textarea placeholder="Project Description"></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateProject;
