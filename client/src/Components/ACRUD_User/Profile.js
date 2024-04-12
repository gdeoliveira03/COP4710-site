import React from 'react';
import { useUser } from './UserContext'; 

const Profile = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>User Type: {user.userType}</p>
          {}
        </div>
      )}
    </div>
  );
};

export default Profile;
