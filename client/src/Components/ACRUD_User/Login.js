import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Login failed');
        return;
      }

      const data = await response.json();

      const userId = data.user.id;
      const userEmail = data.user.email;
      const domain = userEmail.split('@')[1];
      const domainPrefix = domain.split('.')[0];

      fetch(`http://localhost:5000/universityId/${domainPrefix}`)
      .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching university ID');
    }
    return response.json();
    })
  .then(data => {
    const universityId = data.universityId;
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

      localStorage.setItem('userId', userId);
      localStorage.setItem('userUni', domainPrefix);
      localStorage.setItem('userUniId', universityId);

      setUser({ name: username });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      <Link to="/register">Sign up today!</Link>
    </div>
  );
};

export default Login;
