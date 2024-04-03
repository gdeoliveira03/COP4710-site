import React from 'react';
import { useUser } from './Components/ACRUD_User/UserContext'; 
import { Link } from 'react-router-dom';
import './styles.css';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          {user.isSuperAdmin && (
            <Link to="/UniCreate">
              <button>Create University</button>
            </Link>
          )}
          <Link to="/UniList">
            <button>University List</button>
          </Link>
          <Link to="/EventCreate">
            <button>Create Event</button>
          </Link>
          <Link to="/EventList">
            <button>Event List</button>
          </Link>
          <Link to="/ListRSO">
            <button>RSO List</button>
          </Link>
          {(user.isSuperAdmin || user.isAdmin) && (
            <Link to="/RSOCreate">
              <button>Create an RSO</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
