import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectList from "../components/ProjectList";
import FriendsList from "../components/FriendsList";
import CreateProject from "../components/CreateProject";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get("search") || "";

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const url = searchParam ? `/api/projects?search=${encodeURIComponent(searchParam)}` : `/api/projects`;
    fetch(url)
      .then(res => res.json())
      .then(setProjects);
  }, [searchParam]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/users")
      .then(res => res.json())
      .then(users => {
        const me = users.find(u => u._id === user._id);
        setFriends(users.filter(u => me && me.friends && me.friends.includes(u._id)));
      });
  }, [user]);

  function handleProjectClick(projectId) {
    navigate(`/Projects/${projectId}`);
  }

  function handleProjectCreated(newProject) {
    setProjects(prev => [newProject, ...prev]);
  }

  function handleProjectDeleted(projectId) {
    setProjects(prev => prev.filter(p => p._id !== projectId));
  }

  const visibleProjects = expanded ? projects : projects.slice(0, 10);

  return (
    <div className="home-page">
      <Header username={user ? user.username : ""} />
      <div className="home-layout">
        <Sidebar />
        <main className="home-content">
          <h2>All Projects {searchParam ? `— results for "${searchParam}"` : ""}</h2>
          <section className="profile-sections-row">
            <div style={{ flex: 2 }}>
              <ProjectList
                projects={visibleProjects}
                onProjectClick={handleProjectClick}
                onProjectDeleted={handleProjectDeleted}
              />
              {projects.length > 5 && (
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button className="btn" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Show less" : `Show all (${projects.length})`}
                  </button>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <FriendsList friends={friends} />
              {user && <CreateProject ownerId={user._id} onProjectCreated={handleProjectCreated} />}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;