import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectList from "../components/ProjectList";
import FriendsList from "../components/FriendsList";
import CreateProject from "../components/CreateProject";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/projects")
      .then(res => res.json())
      .then(setProjects);

    fetch("/api/users")
      .then(res => res.json())
      .then(users => {
        const me = users.find(u => u._id === user._id);
        setFriends(users.filter(u => me.friends && me.friends.includes(u._id)));
      });
  }, [user]);

  function handleProjectClick(projectId) {
    navigate(`/Projects/${projectId}`);
  }

  function handleProjectCreated(newProject) {
    setProjects(prev => [...prev, newProject]);
  }

  function handleProjectDeleted(projectId) {
    setProjects(prev => prev.filter(p => p._id !== projectId));
  }

  return (
    <div className="home-page">
      <Header username={user ? user.username : ""} />
      <div className="home-layout">
        <Sidebar />
        <main className="home-content">
          <h2>All Projects</h2>
          <section className="profile-sections-row">
            <div style={{ flex: 2 }}>
              <ProjectList
                projects={projects}
                onProjectClick={handleProjectClick}
                onProjectDeleted={handleProjectDeleted}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FriendsList friends={friends} />
              {user && <CreateProject ownerId={user._id} />}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;