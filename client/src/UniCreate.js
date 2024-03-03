import React, { useState } from 'react';

const UniCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    num_students: '',
    pictures: '',
    superadmin_id: '' // Assuming this is required
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
      const response = await fetch('http://localhost:5000/add_university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create university');
      }

      setSuccessMessage('University created successfully');

      setFormData({
        name: '',
        location: '',
        description: '',
        num_students: '',
        pictures: '',
        superadmin_id: ''
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
        <div>
          <label>Pictures:</label>
          <input type="text" name="pictures" value={formData.pictures} onChange={handleChange} required />
        </div>
        <div>
          <label>Superadmin ID:</label>
          <input type="text" name="superadmin_id" value={formData.superadmin_id} onChange={handleChange} required />
        </div>
        <button type="submit">Create University</button>
      </form>
    </div>
  );
};

export default UniCreate;
