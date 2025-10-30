import React from "react";
import ProjectPreview from "./ProjectPreview";

const Feed = ({ title, items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="feed">
        <h3>{title}</h3>
        <p>No activity yet.</p>
      </div>
    );
  }
  return (
    <div className="feed">
      <h3>{title}</h3>
      {items.map((item, index) => (
        <ProjectPreview
          key={index}
          name={item.name}
          description={item.description}
          time={item.time}
        />
      ))}
    </div>
  );
};

export default Feed;