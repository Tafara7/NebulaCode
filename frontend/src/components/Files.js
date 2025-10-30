import React from "react";

const Files = ({ files, selectedFile, onFileClick }) => {
  return (
    <div className="files">
      <h3>File Viewer</h3>
      <ul className="files-list">
        {files && files.length > 0 ? files.map((file, index) => (
          <li
            key={index}
            className={`file-item${selectedFile === file ? " selected" : ""}`}
            onClick={() => onFileClick(file)}
            style={{
              cursor: "pointer",
              background: selectedFile === file ? "#a020f0" : "transparent",
              color: selectedFile === file ? "#fff" : "#a0e0ff",
              borderRadius: "5px",
              padding: "0.4rem 0.7rem",
              marginBottom: "0.2rem",
              fontWeight: selectedFile === file ? "bold" : "normal"
            }}
            title="Preview file"
          >
            {file}
          </li>
        )) : <li style={{ color: "#aaa" }}>[No files]</li>}
      </ul>
    </div>
  );
}

export default Files;