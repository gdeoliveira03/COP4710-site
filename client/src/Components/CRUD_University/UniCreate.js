import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UniCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    num_students: '',
    superadmin_id: '',
    nickname: '',
    pictures: 'placeholder_string' // Placeholder string for pictures
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process form data
      console.log('Form data:', formData);

      // Assuming you have API call or data processing here
      
      setSuccessMessage('University created successfully');

      setFormData({
        name: '',
        location: '',
        description: '',
        num_students: '',
        pictures: 'placeholder_string', // Resetting placeholder string
        superadmin_id: '',
        nickname: ''
      });
    } catch (error) {
      setError(error.message || 'Error creating university');
    }
  };

  return (
    <div>
      <h2>Create University</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Nickname:</label>
          <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Number of Students:</label>
          <input type="text" name="num_students" value={formData.num_students} onChange={handleChange} required />
        </div>
        <button type="submit">Create University</button>
        <Link to="/dashboard">Back to Dashboard</Link>
      </form>
    </div>
  );
};

export default UniCreate;
