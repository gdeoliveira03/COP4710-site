import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Components/CRUD_User/UserContext'; 
import Dashboard from './Dashboard';
import Login from './Components/CRUD_User/Login';
import Register from './Components/CRUD_User/Register';
import Profile from './Components/CRUD_User/Profile'; 
import CreateComment from './Components/CRUD_Comments/CreateComment';
import DeleteComment from './Components/CRUD_Comments/DeleteComment';
import ReadComments from './Components/CRUD_Comments/ReadComments';
import EventCreate from './Components/CRUD_Events/EventCreate';
import EventList from './Components/CRUD_Events/EventList';
import UniCreate from './Components/CRUD_University/UniCreate';
import UniList from './Components/CRUD_University/UniList';
import ListRSO from './Components/CRUD_RSO/ListRSO';
import RSOCreate from './Components/CRUD_RSO/RSOCreate';
import './styles.css';

const LandingPage = () => {
  return (
    <div className="landing-page-text">
      <h1>Welcome to the UCF Vu! App</h1>
      <p>
        This app is designed for social event & club management.
        Make friends, connect your socials, plan events, create clubs,
        and more with the Vu! app.
      </p>
      <p>
        Not from UCF? Don’t worry, the Vu! app accepts any university student.
      </p>
      <p>Please <a href="/login">login</a> or <a href="/register">register</a> to continue.</p>
    </div>
  );
};

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
          <Route path ="/EventCreate" element={<EventCreate />} />
          <Route path ="/EventList" element={<EventList />} />
          <Route path ="/UniCreate" element={<UniCreate />} />
          <Route path ="/UniList" element={<UniList />} />
          <Route path ="/CreateComment" element={<CreateComment />} />
          <Route path ="/DeleteComment" element={<DeleteComment />} />
          <Route path ="/ReadComments" element={<ReadComments />} />
          <Route path ="/RSOCreate" element={<RSOCreate />} />
          <Route path ="/ListRSO" element={<ListRSO />} />
        </Routes>
      }
      </UserProvider>
    </Router>
  );
}

export default App;
