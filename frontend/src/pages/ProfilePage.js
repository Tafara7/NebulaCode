import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../components/Profile";
import EditProfileForm from "../components/EditProfileForm";
import ProjectList from "../components/ProjectList";
import FriendsList from "../components/FriendsList";
import CreateProject from "../components/CreateProject";

const ProfilePage = () => {
  const { username } = useParams();
  const user = {
    username: username || "Tafara7",
    bio: "Full-stack explorer of galaxies.",
    location: "South Africa",
    joined: "August 2025",
  };

  const projects = [
    { name: "NebulaSearch", stars: 12, collaborators: 3, tags: ["js", "ts", "ai"] },
    { name: "Code Collaboration", stars: 5, collaborators: 2, tags: ["react", "mongodb"] },
  ];

  const friends = [
    { username: "James", bio: "Backend developer" },
    { username: "Lina", bio: "UI/UX designer" },
  ];

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <Profile
          username={user.username}
          bio={user.bio}
          location={user.location}
          joined={user.joined}
        />

        <section className="profile-sections">
          <EditProfileForm />
          <ProjectList projects={projects} />
          <FriendsList friends={friends} />
          <CreateProject />
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
