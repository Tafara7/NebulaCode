import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import ProjectPreview from "../components/ProjectPreview";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myProjectsFeed, setMyProjectsFeed] = useState([]);
  const [yourProjects, setYourProjects] = useState([]);
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

    if (feedType === "global") {
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
    } else {
      fetch("/api/checkins/project/all")
        .then(res => res.json())
        .then(data => {
          const friends = user.friends || [];
          setRecentActivity(
            data
              .filter(c => [user._id, ...friends].includes(c.userId))
              .map(c => ({
                name: `${c.username || c.userId} pushed to "${c.projectName || c.projectId}"`,
                description: c.message,
                time: new Date(c.createdAt).toLocaleString(),
              }))
          );
        });
    }

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
        setYourProjects(myProjects); 
      });
  }, [user, feedType]);

  return (
    <div className="home-page">
      <Header username={user ? user.username : ""} />
      <div className="home-layout">
        <Sidebar />

        <main className="home-content">
          <h2>
            {user ? `Welcome back, ${user.username}!` : "Welcome to NebulaCode!"}
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => setFeedType("global")}
              style={{ marginRight: "1rem", background: feedType === "global" ? "#a020f0" : "#333", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem" }}
            >
              Global Feed
            </button>
            <button
              onClick={() => setFeedType("local")}
              style={{ background: feedType === "local" ? "#a020f0" : "#333", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem" }}
            >
              Local Feed
            </button>
          </div>
          <div className="feeds">
            <Feed title={feedType === "global" ? "Global Activity Feed:" : "Local Activity Feed:"} items={recentActivity} />
            <Feed title="My Projects Feed:" items={myProjectsFeed} />
            <div className="feed">
              <h3>Your Projects</h3>
              {yourProjects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/Projects/${project._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <ProjectPreview
                    name={project.name}
                    description={project.description}
                    time={new Date(project.createdAt).toLocaleDateString()}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;