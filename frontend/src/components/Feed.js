import React from "react";
import ProjectPreview from "./ProjectPreview";

function Feed({ title, items }) {
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
}

export default Feed;
