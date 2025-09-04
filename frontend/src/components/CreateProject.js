import React from "react";

const CreateProject = () => {
  return (
    <div className="create-project">
      <h3>Create a New Project</h3>
      <form>
        <input type="text" placeholder="Project Name" />
        <textarea placeholder="Project Description"></textarea>
      </form>
      <button type="submit">Create</button>
    </div>
  );
}

export default CreateProject;
