import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider from UserContext.js
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import UserSettings from './userSettings';
import Profile from './Profile'; 


function App() {
  return (
    <Router>
      <UserProvider> {/* Wrap your Routes with UserProvider */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userSettings" element={<UserSettings />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
