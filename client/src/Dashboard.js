import React from 'react';
import { useUser } from './Components/CRUD_User/UserContext'; 
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
          {/* Button to create university */}
          {user.isSuperAdmin && (
            <Link to="/UniCreate">
              <button>Create University</button>
            </Link>
          )}
          {/* Button to list universities */}
          <Link to="/UniList">
            <button>University List</button>
          </Link>
          {/* Button to create event */}
          <Link to="/EventCreate">
            <button>Create Event</button>
          </Link>
          <Link to="/EventList">
            <button>Event List</button>
          </Link>
          <Link to="/ListRSO">
            <button>RSO List</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
