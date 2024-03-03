import React from 'react';
import { useUser } from './UserContext'; 

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h2>Dashboard</h2>
      {user && (
        <p>Welcome, {user.name}!</p>
      )}
    </div>
  );
};

export default Dashboard;
