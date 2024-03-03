import React from 'react';
import { useUser } from './UserContext'; // Import useUser hook

const Dashboard = () => {
  const { user } = useUser();

  console.log(user); // Log the user information to the console

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user ? user.username : 'Guest'}!</p>
    </div>
  );
};

export default Dashboard;
