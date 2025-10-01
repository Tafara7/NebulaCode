import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import ProjectPreview from "../components/ProjectPreview";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myProjectsFeed, setMyProjectsFeed] = useState([]);
  const [yourProjects, setYourProjects] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch("/api/checkins/project/all")
      .then(res => res.json())
      .then(data => {

        setRecentActivity(
          data.map(c => ({
            name: `${c.username || c.userId} pushed to "${c.projectName || c.projectId}"`,
            description: c.message,
            time: new Date(c.createdAt).toLocaleString(),
          }))
        );
      });


      fetch(`/api/projects`)
      .then(res => res.json())
      .then(projects => {
        const myProjects = projects.filter(
          p => p.ownerId === user._id || (p.memberIds && p.memberIds.includes(user._id))
        );
        setMyProjectsFeed(
          myProjects.map(p => ({
            name: p.name,
            description: p.description,
            time: new Date(p.createdAt).toLocaleDateString(),
          }))
        );
        setYourProjects(myProjects.map(p => p.name));
      });
  }, [user]);

  return (
    <div className="home-page">
      <Header username={user ? user.username : ""} />
      <div className="home-layout">
        <Sidebar />

        <main className="home-content">
          <h2>
            {user ? `Welcome back, ${user.username}!` : "Welcome to NebulaCode!"}
          </h2>
          <div className="feeds">
            <Feed title="Recent Activity / Feed:" items={recentActivity} />
            <Feed title="My Projects Feed:" items={myProjectsFeed} />
            <div className="feed">
              <h3>Your Projects</h3>
              {yourProjects.map((project, index) => (
                <ProjectPreview
                  key={index}
                  name={project}
                  description=""
                  time=""
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;