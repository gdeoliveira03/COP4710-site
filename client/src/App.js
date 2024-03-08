import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; 
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import Profile from './Profile'; 
import Events from './Events';
import EventList from './EventList';
import UniCreate from './UniCreate';
import UniList from './UniList';
import CreateComment from './CreateComment';
import DeleteComment from './DeleteComment';
import ReadComments from './ReadComments';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        {
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path ="/Events" element={<Events />} />
          <Route path ="EventList" element={<EventList />} />
          <Route path ="UniCreate" element={<UniCreate />} />
          <Route path ="UniList" element={<UniList />} />
          <Route path ="CreateComment" element={<CreateComment />} />
          <Route path ="DeleteComment" element={<DeleteComment />} />
          <Route path ="ReadComments" element={<ReadComments />} />

        </Routes>
      }
      </UserProvider>
    </Router>
  );
}

export default App;
