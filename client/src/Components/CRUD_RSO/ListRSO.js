import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../ACRUD_User/UserContext'; 

const ListRSOs = () => {
  const { user } = useUser();
  const [RSOs, setRSOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinSuccessMessage, setJoinSuccessMessage] = useState('');
  const [leaveSuccessMessage, setLeaveSuccessMessage] = useState('');

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
      const response = await fetch(`http://localhost:5000/rsos/${rsoId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.user_id })
      });
      if (!response.ok) {
        throw new Error('Error joining RSO');
      }
      setJoinSuccessMessage('Joined RSO successfully');
    } catch (error) {
      console.error('Error joining RSO:', error.message);
    }
  };

  const handleLeaveRSO = async (rsoId) => {
    try {
      const response = await fetch(`http://localhost:5000/rsos/${rsoId}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.user_id })
      });
      if (!response.ok) {
        throw new Error('Error leaving RSO');
      }
      setLeaveSuccessMessage('Left RSO successfully');
    } catch (error) {
      console.error('Error leaving RSO:', error.message);
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
      {joinSuccessMessage && <div>{joinSuccessMessage}</div>}
      {leaveSuccessMessage && <div>{leaveSuccessMessage}</div>}
      <ul>
        {RSOs.map(rso => (
          <li key={rso.id}>
            <div>
              <strong>Name:</strong> {rso.name}<br />
              <strong>Description:</strong> {rso.description}<br />
              <strong>Members:</strong> {rso.members.join(', ')}<br />
              {rso.members.map(member => member.user_id).includes(user.user_id) && <button onClick={() => handleLeaveRSO(rso.rso_id)}>Leave</button>}
              {rso.members.map(member => member.user_id).includes(user.user_id) && <button onClick={() => handleJoinRSO(rso.rso_id)}>Join</button>}
            </div>
          </li>
        ))}
      </ul>
      <Link to="/RSOCreate">Create New RSO</Link>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default ListRSOs;
