import React, { useRef, useState, useCallback } from "react";

const ProfileImageUpload = ({ userId, onUploadSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const uploadDataUrl = useCallback(async (dataUrl) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: dataUrl })
      });
      const json = await res.json();
      const userRes = await fetch(`/api/users/${userId}`);
      const updatedUser = await userRes.json();
      if (onUploadSuccess) onUploadSuccess(updatedUser);
    } catch (err) {
      setError("Upload failed");
    }
  }, [userId, onUploadSuccess]);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      uploadDataUrl(dataUrl);
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsDataURL(file);
  }

  function handleSelectClick() {
    inputRef.current.click();
  }

  function handleInputChange(e) {
    const file = e.target.files[0];
    handleFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div>
      <div
        onClick={handleSelectClick}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "#a020f0" : "#444"}`,
          width: "50%",
          padding: "0.8rem",
          borderRadius: 8,
          cursor: "pointer",
          textAlign: "center",
          color: "#ddd",
          margin: "0.5rem auto",
        }}
        aria-label="Upload profile image"
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: "none" }} />
        <div>Click or drag & drop to upload a profile image</div>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default ProfileImageUpload;