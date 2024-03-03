import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {

  const { username } = useParams();

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {username}</p>

    </div>
  );
};

export default Profile;
