import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = ({ initial = "" }) => {
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {

      Promise.all([
        fetch(`/api/users?search=${encodeURIComponent(query)}`).then(r => r.json()).catch(() => []),
        fetch(`/api/projects?search=${encodeURIComponent(query)}`).then(r => r.json()).catch(() => []),
        fetch(`/api/checkins/search?query=${encodeURIComponent(query)}`).then(r => r.json()).catch(() => [])
      ]).then(([users, projects, checkins]) => {
        const suggestions = [
          ...users.slice(0,5).map(u => ({ type: "user", title: `@${u.username}`, data: u })),
          ...projects.slice(0,5).map(p => ({ type: "project", title: p.name, data: p })),
          ...checkins.slice(0,5).map(c => ({ type: "checkin", title: c.message.slice(0,60), data: c }))
        ];
        setResults(suggestions);
        setOpen(true);
      });
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/Projects?search=${encodeURIComponent(query)}`);
  }

  function handleSuggestionClick(s) {
    if (s.type === "user") {
      navigate(`/profile/${s.data.username}`);
    } else if (s.type === "project") {
      navigate(`/Projects/${s.data._id}`);
    } else if (s.type === "checkin") {
      navigate(`/Projects/${s.data.projectId}`);
    }
    setOpen(false);
  }

  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          aria-label="search"
          type="text"
          placeholder="Search projects, people, hashtags, check-ins..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          style={{ padding: "0.6rem", borderRadius: 6, border: "none", width: "100%" }}
        />
        <button type="submit" style={{ padding: "0.6rem 0.9rem", background: "#a020f0", color: "#fff", border: "none", borderRadius: 6 }}>Search</button>
      </form>
      {open && results.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 44, background: "#111", borderRadius: 8, maxHeight: 240, overflowY: "auto", zIndex: 999 }}>
          {results.map((r, i) => (
            <div key={i} onClick={() => handleSuggestionClick(r)} style={{ padding: 8, borderBottom: "1px solid #222", cursor: "pointer" }}>
              <strong style={{ color: "#a020f0" }}>{r.type}</strong> — <span style={{ color: "#fff" }}>{r.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;