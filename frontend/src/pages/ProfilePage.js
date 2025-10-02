import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../components/Profile";
import EditProfileForm from "../components/EditProfileForm";
import ProjectList from "../components/ProjectList";
import FriendsList from "../components/FriendsList";
import CreateProject from "../components/CreateProject";
import Toast from "../components/Toast";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("user"));
    setLoggedIn(logged);

    fetch(`/api/users`)
      .then(res => res.json())
      .then(users => {
        const found = users.find(u => u.username === username || (username === "me" && logged && u._id === logged._id));
        setUser(found);
        setIsOwnProfile(logged && found && found._id === logged._id);

        if (found) {
          fetch(`/api/projects`)
            .then(res => res.json())
            .then(allProjects => {
              setProjects(
                allProjects.filter(
                  p =>
                    p.ownerId === found._id ||
                    (p.memberIds && p.memberIds.includes(found._id))
                )
              );
            });

          if (found.friends && found.friends.length > 0) {
            fetch(`/api/users`)
              .then(res => res.json())
              .then(allUsers => {
                setFriends(
                  allUsers.filter(u =>
                    found.friends.includes(u._id)
                  )
                );
              });
          } else {
            setFriends([]);
          }

          if (logged && found._id !== logged._id) {
            setIsFriend(logged.friends && logged.friends.includes(found._id));
          }
        }
      });
  }, [username]);

  function handleDeleteProfile() {
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;
    fetch(`/api/users/${user._id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        localStorage.removeItem("user");
        setToast({ type: "success", message: "Profile deleted!" });
        setTimeout(() => navigate("/signup"), 1500);
      });
  }

  function handleAddFriend() {
    fetch(`/api/users/${loggedIn._id}`)
      .then(res => res.json())
      .then(loggedUser => {
        const updatedFriends = [...(loggedUser.friends || []), user._id];
        fetch(`/api/users/${loggedIn._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friends: updatedFriends })
        })
          .then(() => {
            setToast({ type: "success", message: "Friend added!" });

            setIsFriend(true);
            setFriends(prev => [...prev, user]);
          });
      });
  }

  function handleUnfriend(friendId, friendName) {
    fetch(`/api/users/${loggedIn._id}`)
      .then(res => res.json())
      .then(loggedUser => {
        const updatedFriends = (loggedUser.friends || []).filter(id => id !== friendId);
        fetch(`/api/users/${loggedIn._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friends: updatedFriends })
        })
          .then(() => {
            setToast({ type: "info", message: `Unfriended ${friendName}` });

            setFriends(prev => prev.filter(f => f._id !== friendId));
          });
      });
  }

  function handleProfileUpdate() {
    setToast({ type: "success", message: "Profile updated!" });
  }

  function handleProjectCreated(newProject) {
    setToast({ type: "success", message: "Project created!" });
    setProjects(prev => [...prev, newProject]);
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <Header username={user.username} />
      <main className="profile-content">
        <Profile
          username={user.username}
          bio={user.bio}
          location={user.location}
          joined={user.joined}
        />
        {!isOwnProfile && loggedIn && !isFriend && (
          <button
            style={{ background: "#20c020", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", margin: "1rem 0", cursor: "pointer" }}
            onClick={handleAddFriend}
          >
            Add Friend
          </button>
        )}
        {isOwnProfile && (
          <EditProfileForm user={user} setUser={setUser} onProfileUpdate={handleProfileUpdate} />
        )}
        <section className="profile-sections-row">
          <ProjectList projects={projects} />
          <FriendsList friends={friends} onUnfriend={handleUnfriend} />
          {isOwnProfile && <CreateProject ownerId={user._id} onProjectCreated={handleProjectCreated} />}
        </section>
        {isOwnProfile && (
          <button
            style={{ background: "#c00", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", margin: "1rem 0", cursor: "pointer" }}
            onClick={handleDeleteProfile}
          >
            Delete My Profile
          </button>
        )}
        <Toast toast={toast} setToast={setToast} />
      </main>
    </div>
  );
};

export default ProfilePage;