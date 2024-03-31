import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UniList = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('http://localhost:5000/universities');
      if (!response.ok) {
        throw new Error('Error fetching universities');
      }
      const data = await response.json();
      setUniversities(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
      <h2>Universities</h2>
      <ul>
        {universities.map(university => (
          <li key={university.university_id}>
            <strong>Name:</strong> {university.name}<br />
            <strong>Location:</strong> {university.location}<br />
            <strong>Description:</strong> {university.description}<br />
            <strong>Number of Students:</strong> {university.num_students}<br />
            <strong>Nickname:</strong> {university.nickname}<br />
            <hr />
          </li>
        ))}
      </ul>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default UniList;
