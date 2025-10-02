import React, { useState } from "react";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    // Search users
    fetch(`/api/users?search=${query}`)
      .then(res => res.json())
      .then(users => {
        // Search projects
        fetch(`/api/projects?search=${query}`)
          .then(res => res.json())
          .then(projects => {
            // Search check-ins
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

  return (
    <div className="search-box">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search projects, people, hashtags, check-ins..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="search-results">
        {results.map((r, i) => (
          <div key={i} className="search-result">
            {r.type === "user" && <div>User: @{r.username} ({r.email})</div>}
            {r.type === "project" && <div>Project: {r.name} - {r.description}</div>}
            {r.type === "checkin" && <div>Check-in: {r.message} (by {r.username || r.userId})</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;