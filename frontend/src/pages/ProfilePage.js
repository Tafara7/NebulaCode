import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../components/Profile";
import EditProfileForm from "../components/EditProfileForm";
import ProjectList from "../components/ProjectList";
import FriendsList from "../components/FriendsList";
import CreateProject from "../components/CreateProject";

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {

    fetch(`/api/users`)
      .then(res => res.json())
      .then(users => {
        const found = users.find(u => u.username === username);
        setUser(found);


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
        }
      });
  }, [username]);

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

        <section className="profile-sections">
          <EditProfileForm user={user} setUser={setUser} />
          <ProjectList projects={projects} />
          <FriendsList friends={friends} />
          <CreateProject ownerId={user._id} />
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;