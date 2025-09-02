import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import ProjectPreview from "../components/ProjectPreview";

function HomePage() {
  const recentActivity = [
    {
      name: 'Tafara pushed to "Galactic-Search"',
      description: "3 commits added: Bug fix, Readme update",
      time: "2 hours ago",
    },
    {
      name: 'James pushed to "Saturn-Repo"',
      description: "3 commits added: Bug fix, Readme update",
      time: "4 hours ago",
    },
  ];

  const myProjectsFeed = [
    {
      name: "GalaxyForm",
      description: "Integrated API caching for faster search results",
      time: "Yesterday",
    },
    {
      name: "GymApp",
      description: "Cleaned code and improved form validation",
      time: "Yesterday",
    },
  ];

  const yourProjects = ["GalaxyForm", "GymApp", "AstroCalc"];

  return (
    <div className="home-page">
      <Header />
      <div className="home-layout">
        <Sidebar />

        <main className="home-content">
          <h2>Welcome back, [Username]!</h2>
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
}

export default HomePage;
