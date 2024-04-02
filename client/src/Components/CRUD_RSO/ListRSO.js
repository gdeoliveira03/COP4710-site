import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListRSOs = () => {
  const [RSOs, setRSOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData] = useState({
    user_id: ''
  });

  useEffect(() => {
    fetchRSOs();
  }, []);

  const fetchRSOs = async () => {
    try {
      const response = await fetch('http://localhost:5000/rsos');
      if (!response.ok) {
        throw new Error('Error fetching RSOs');
      }
  
      const data = await response.json();
      setRSOs(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleJoinRSO = async (rsoId) => {
    try {
      const response = await fetch(`http://localhost:5000/join_rso/${rsoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Error joining RSO');
      }
    } catch (error) {
      // Handle error, such as displaying an error message to the user
      console.error('Error joining RSO:', error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>List of Registered Student Organizations</h2>
      <ul>
        {RSOs.map(rso => (
          <li key={rso.id}>
            {rso.name}
            <button onClick={() => handleJoinRSO(rso.id)}>Join</button>
          </li>
        ))}
      </ul>
      <Link to="/createRSO">Create New RSO</Link>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default ListRSOs;
