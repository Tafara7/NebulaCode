import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import ProjectPreview from "../components/ProjectPreview";
import SearchInput from "../components/SearchInput";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [feedType, setFeedType] = useState("global");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/users/${user._id}`)
      .then(res => res.json())
      .then(userData => {
        const savedProjectIds = userData.savedProjects || [];
        
        fetch('/api/projects')
          .then(res => res.json())
          .then(allProjects => {
            const saved = allProjects.filter(p => savedProjectIds.includes(p._id));
            setSavedProjects(saved);

            const mine = allProjects.filter(p => 
              p.ownerId === user._id || 
              (p.memberIds && p.memberIds.includes(user._id))
            );
            setMyProjects(mine);
          });
      });

    Promise.all([
      fetch('/api/checkins/project/all').then(r => r.json()),
      fetch('/api/users').then(r => r.json())
    ]).then(([checkins, users]) => {
      const me = users.find(u => u._id === user._id);
      const friendIds = me?.friends || [];

      const mapped = checkins.map(c => {
        const checkInUser = users.find(u => u._id === c.userId);
        return {
          name: `${checkInUser?.username || c.userId} pushed to "${c.projectName || c.projectId}"`,
          description: c.message,
          time: new Date(c.createdAt).toLocaleString(),
          createdAt: c.createdAt,
          tags: c.tags || []
        };
      });

      mapped.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (feedType === "local") {
        setRecentActivity(mapped.filter(c => 
          c.userId === user._id || 
          friendIds.includes(c.userId)
        ));
      } else {
        setRecentActivity(mapped);
      }
    });
  }, [user, feedType]);

  function handleProjectClick(projectId) {
    navigate(`/Projects/${projectId}`);
  }

  function handleTagClick(tag) {
    navigate(`/Projects?search=${encodeURIComponent(tag)}`);
  }

  function handleSaveProject(projectId) {
    if (!user) return;

    const savedProjectIds = user.savedProjects || [];
    const updatedSavedProjects = savedProjectIds.includes(projectId)
      ? savedProjectIds.filter(id => id !== projectId)
      : [...savedProjectIds, projectId];

    fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedProjects: updatedSavedProjects })
    })
      .then(res => res.json())
      .then(updatedUser => {
        setUser(updatedUser);
        setSavedProjects(prev => 
          savedProjectIds.includes(projectId)
            ? prev.filter(p => p._id !== projectId)
            : [...prev, myProjects.find(p => p._id === projectId)]
        );
      });
  }

  return (
    <div className="home-page">
      <Header username={user ? user.username : ""} />
      <div className="home-layout">
        <Sidebar />
        <main className="home-content">
          <h2>
            {user ? `Welcome back, ${user.username}!` : "Welcome to NebulaCode!"}
          </h2>

          <SearchInput />

          <div style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => setFeedType("global")}
              style={{ 
                marginRight: "1rem", 
                background: feedType === "global" ? "#a020f0" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem"
              }}
            >
              Global Feed
            </button>
            <button
              onClick={() => setFeedType("local")}
              style={{ 
                background: feedType === "local" ? "#a020f0" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem"
              }}
            >
              Local Feed (You & Friends)
            </button>
          </div>

          <div className="feeds">
            <div className="feed">
              <h3>{feedType === "global" ? "Global Activity" : "Local Activity"}</h3>
              {recentActivity.map((item, index) => (
                <ProjectPreview
                  key={index}
                  name={item.name}
                  description={item.description}
                  time={item.time}
                  tags={item.tags}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>

            <div className="feed">
              <h3>My Projects</h3>
              {myProjects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => handleProjectClick(project._id)}
                  style={{ cursor: "pointer" }}
                >
                  <ProjectPreview
                    name={project.name}
                    description={project.description}
                    time={new Date(project.createdAt).toLocaleDateString()}
                    tags={project.tags}
                    onTagClick={handleTagClick}
                  />
                </div>
              ))}
            </div>

            <div className="feed">
              <h3>Saved Projects</h3>
              {savedProjects.length > 0 ? (
                savedProjects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => handleProjectClick(project._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <ProjectPreview
                      name={project.name}
                      description={project.description}
                      time={new Date(project.createdAt).toLocaleDateString()}
                      tags={project.tags}
                      onTagClick={handleTagClick}
                    />
                  </div>
                ))
              ) : (
                <p style={{ color: "#aaa" }}>No saved projects yet</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;