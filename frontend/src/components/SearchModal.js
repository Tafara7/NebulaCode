import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (!query) return;

    fetch(`/api/users?search=${query}`)
      .then(res => res.json())
      .then(users => {

        fetch(`/api/projects?search=${query}`)
          .then(res => res.json())
          .then(projects => {

            fetch(`/api/checkins/search?query=${query}`)
              .then(res => res.json())
              .then(checkins => {
                setResults([
                  ...users.map(u => ({ type: "user", ...u })),
                  ...projects.map(p => ({ type: "project", ...p })),
                  ...checkins.map(c => ({ type: "checkin", ...c }))
                ]);
              });
          });
      });
  }

  function handleResultClick(result) {
    if (result.type === "user") {
      navigate(`/profile/${result.username}`);
      onClose();
    } else if (result.type === "project") {
      navigate(`/Projects/${result._id}`);
      onClose();
    } else if (result.type === "checkin") {
      navigate(`/Projects/${result.projectId || ""}`);
      onClose();
    }
  }

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <button className="search-modal-close" onClick={onClose}>×</button>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search projects, people, hashtags, check-ins..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit">Search</button>
        </form>
        <div className="search-results">
          {results.map((r, i) => (
            <div
              key={i}
              className="search-result"
              style={{ cursor: "pointer", padding: "0.5rem", borderBottom: "1px solid #333" }}
              onClick={() => handleResultClick(r)}
            >
              {r.type === "user" && <div>User: @{r.username} ({r.email})</div>}
              {r.type === "project" && <div>Project: {r.name} - {r.description}</div>}
              {r.type === "checkin" && <div>Check-in: {r.message} (by {r.username || r.userId})</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;