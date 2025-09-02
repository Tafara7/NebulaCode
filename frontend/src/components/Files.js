import React from "react";

function Files({ files }) {
  return (
    <div className="files">
      <h3> File Viewer</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}

export default Files;
