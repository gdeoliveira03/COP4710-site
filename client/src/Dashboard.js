import React from 'react';
import { useUser } from './UserContext'; 

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <p>Welcome, {user.name}!</p>
      )}
    </div>
  );
};

export default Dashboard;
