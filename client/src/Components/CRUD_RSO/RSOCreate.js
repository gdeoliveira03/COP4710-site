import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateRSO = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    member1: '',
    member2: '',
    member3: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/admin_rsos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: userId,
          name: formData.name,
          description: formData.description,
          member_usernames: [formData.member1, formData.member2, formData.member3],
        }),
      });
      if (!response.ok) {
        throw new Error('Error creating RSO');
      }
      // Handle success
      setSuccessMessage('RSO created successfully');
      setError(null);
      setFormData({
        name: '',
        description: '',
        member1: '',
        member2: '',
        member3: '',
      });
    } catch (error) {
      // Handle error
      console.error('Error creating RSO:', error.message);
      setError('Error creating RSO. Please try again later.');
    }
  };

  const validateFormData = () => {
    const { name, description, member1, member2, member3 } = formData;
    if (!name.trim() || !description.trim() || !member1.trim() || !member2.trim() || !member3.trim()) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  return (
    <div>
      <h2>Create a New Registered Student Organization</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="member1">Member 1 Username:</label>
          <input type="text" id="member1" name="member1" value={formData.member1} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="member2">Member 2 Username:</label>
          <input type="text" id="member2" name="member2" value={formData.member2} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="member3">Member 3 Username:</label>
          <input type="text" id="member3" name="member3" value={formData.member3} onChange={handleChange} required />
        </div>
        <button type="submit">Create RSO</button>
      </form>
      <Link to="/ListRSO">Back to RSO List</Link>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default CreateRSO;
