import React from "react";

const ProjectPreview = ({ name, description, time, tags = [], image, onTagClick }) => {
  return (
    <div className="project-preview" role="article" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {image ? (
        <div style={{ width: 72, height: 72, flex: "0 0 72px" }}>
          <img src={image} alt={`${name} thumbnail`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
        </div>
      ) : (
        <div style={{ width: 72, height: 72, flex: "0 0 72px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }} />
      )}
      <div style={{ textAlign: "left", flex: 1 }}>
        <h4 className="project-title">{name}</h4>
        <p className="project-desc">{description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span className="project-tags" style={{ fontSize: 12 }}>{time}</span>
          <div>
            {Array.isArray(tags) && tags.map((t, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); if (onTagClick) onTagClick(t); }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffd700",
                  cursor: "pointer",
                  marginLeft: 8,
                  textDecoration: "underline",
                  fontSize: 13
                }}
                aria-label={`search tag ${t}`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPreview;