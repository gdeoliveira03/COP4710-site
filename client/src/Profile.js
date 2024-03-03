import React from 'react';
import { useUser } from './UserContext';

const ProfileComponent = () => {
  // Access user context using the useUser hook
  const { user } = useUser();

  return (
    <div>
      {user ? (
        user.hasOwnProperty('username') ? (
          <p>Welcome, {user.username}!</p>
        ) : (
          <p>Username not found in user object.</p>
        )
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfileComponent;

