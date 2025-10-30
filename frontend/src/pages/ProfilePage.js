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
  const [savedProjects, setSavedProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [toast, setToast] = useState(null);
  const [canViewFullProfile, setCanViewFullProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setLoggedIn(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch("/api/users")
      .then(res => res.json())
      .then(users => {
        if (!active) return;
        const found = users.find(
          u =>
            u.username === username ||
            (username === "me" && loggedIn && u._id === loggedIn._id)
        );
        if (!found) {
          setUser(null);
          setProjects([]);
          setSavedProjects([]);
          setFriends([]);
          setIsOwnProfile(false);
          setIsFriend(false);
          setCanViewFullProfile(false);
          return;
        }

        setUser(found);
        const own = loggedIn && found._id === loggedIn._id;
        setIsOwnProfile(own);

        const canView =
          own ||
          (loggedIn && Array.isArray(loggedIn.friends) && loggedIn.friends.includes(found._id));
        setCanViewFullProfile(canView);

        if (loggedIn && found._id !== loggedIn._id) {
          setIsFriend(Array.isArray(loggedIn.friends) && loggedIn.friends.includes(found._id));
        } else {
          setIsFriend(false);
        }

        if (canView) {
          fetch("/api/projects")
            .then(r => r.json())
            .then(allProjects => {
              if (!active) return;
              const userProjects = allProjects.filter(
                p => p.ownerId === found._id || (p.memberIds && p.memberIds.includes(found._id))
              );
              setProjects(userProjects);

              const saved = (found.savedProjects || [])
                .map(id => allProjects.find(p => p._id === id))
                .filter(Boolean);
              setSavedProjects(saved);
            })
            .catch(() => {
              setProjects([]);
              setSavedProjects([]);
            });

          const friendUsers = users.filter(u => (found.friends || []).includes(u._id));
          setFriends(friendUsers);
        } else {
          setProjects([]);
          setSavedProjects([]);
          setFriends([]);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setProjects([]);
          setSavedProjects([]);
          setFriends([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username, loggedIn]);

  async function handleDeleteProfile() {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;
    try {
      await fetch(`/api/users/${user._id}`, { method: "DELETE" });
      localStorage.removeItem("user");
      setToast({ type: "success", message: "Profile deleted!" });
      setTimeout(() => navigate("/signup"), 1500);
    } catch {
      setToast({ type: "error", message: "Delete failed" });
    }
  }

  async function handleAddFriend() {
    if (!loggedIn || !user) return;
    try {
      const meRes = await fetch(`/api/users/${loggedIn._id}`);
      const me = await meRes.json();
      const updated = Array.from(new Set([...(me.friends || []), user._id]));
      await fetch(`/api/users/${loggedIn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friends: updated })
      });

      const updatedUserRes = await fetch(`/api/users/${loggedIn._id}`);
      const updatedUser = await updatedUserRes.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoggedIn(updatedUser);

      setToast({ type: "success", message: "Friend added!" });
      setIsFriend(true);
      setCanViewFullProfile(true);

      const friendListRes = await fetch("/api/users");
      const users = await friendListRes.json();
      const foundUpdated = users.find(u => u._id === user._id);
      if (foundUpdated) {
        const friendUsers = users.filter(u => (foundUpdated.friends || []).includes(u._id));
        setFriends(friendUsers);
      }
    } catch {
      setToast({ type: "error", message: "Could not add friend" });
    }
  }

  async function handleUnfriend(friendId, friendName) {
    if (!loggedIn) return;
    try {
      const meRes = await fetch(`/api/users/${loggedIn._id}`);
      const me = await meRes.json();
      const updated = (me.friends || []).filter(id => id !== friendId);
      await fetch(`/api/users/${loggedIn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friends: updated })
      });

      const updatedUserRes = await fetch(`/api/users/${loggedIn._id}`);
      const updatedUser = await updatedUserRes.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoggedIn(updatedUser);

      setToast({ type: "info", message: `Unfriended ${friendName}` });
      setFriends(prev => prev.filter(f => f._id !== friendId));
      setIsFriend(false);
      if (user && user._id === friendId) {
        setCanViewFullProfile(false);
      }
    } catch {
      setToast({ type: "error", message: "Could not unfriend" });
    }
  }

  function handleProfileUpdate() {
    if (!user) return;
    fetch(`/api/users/${user._1d ?? user._id}`)
      .then(r => r.json())
      .then(u => {
        setUser(u);
        setToast({ type: "success", message: "Profile updated!" });
      })
      .catch(() => setToast({ type: "error", message: "Update failed" }));
  }

  function handleProjectCreated(newProject) {
    setProjects(prev => [newProject, ...prev]);
    setToast({ type: "success", message: "Project created!" });
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header username={loggedIn?.username} />
        <main className="profile-content">
          <div className="loading">Loading profile...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Header username={loggedIn?.username} />
        <main className="profile-content">
          <div style={{ padding: 24 }}>
            <h2>User not found</h2>
            <p>The requested profile does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header username={loggedIn?.username} />
      <main className="profile-content">
        <Profile
          username={user.username}
          bio={canViewFullProfile ? user.bio : null}
          location={canViewFullProfile ? user.location : null}
          joined={canViewFullProfile ? user.joined : null}
          profileImage={user.profileImage}
        />

        {!isOwnProfile && loggedIn && !isFriend && (
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={handleAddFriend}>Add Friend</button>
          </div>
        )}

        {canViewFullProfile ? (
          <>
            {isOwnProfile && (
              <EditProfileForm user={user} setUser={setUser} onProfileUpdate={handleProfileUpdate} />
            )}

            <section className="profile-sections-row" style={{ marginTop: 16 }}>
              <div style={{ flex: 2, minWidth: 300 }}>
                <h3 style={{ marginBottom: 8 }}>Projects ({projects.length})</h3>
                <ProjectList projects={projects} />
              </div>

              <aside style={{ flex: 1, minWidth: 220 }}>
                {savedProjects.length > 0 && (
                  <>
                    <h4>Saved Projects</h4>
                    <ProjectList projects={savedProjects} />
                  </>
                )}

                <h4 style={{ marginTop: 12 }}>Friends</h4>
                <FriendsList friends={friends} onUnfriend={isOwnProfile ? handleUnfriend : null} />
                {isOwnProfile && <CreateProject ownerId={user._id} onProjectCreated={handleProjectCreated} />}
              </aside>
            </section>

            {isOwnProfile && (
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-danger" onClick={handleDeleteProfile}>Delete My Profile</button>
              </div>
            )}
          </>
        ) : (
          <div className="private-profile-message" style={{ marginTop: 16 }}>
            <p>This profile is private. Add {user.username} as a friend to see more.</p>
          </div>
        )}

        <Toast toast={toast} setToast={setToast} />
      </main>
    </div>
  );
};

export default ProfilePage;