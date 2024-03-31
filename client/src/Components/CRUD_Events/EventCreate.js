import React, { useState } from 'react';
import {Link} from 'react-router-dom';
const EventCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    timestamp: '',
    location: '',
    contact_phone: '',
    contact_email: '',
    university_id: '', 
    admin_id: '',
    is_public: true,
    is_rso_event: false,
    rso_id: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'is_public' && checked) {
      setFormData(prevState => ({
        ...prevState,
        is_public: true,
        is_rso_event: false,
      }));
    } else if (name === 'is_rso_event' && checked) {
      setFormData(prevState => ({
        ...prevState,
        is_public: false,
        is_rso_event: true,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }

      setSuccessMessage('Event created successfully');

      setFormData({
        name: '',
        category: '',
        description: '',
        timestamp: '',
        location: '',
        contact_phone: '',
        contact_email: '',
        university_id: '',
        admin_id: '',
        is_public: true,
        is_rso_event: false,
        rso_id: '',
      });
    } catch (error) {
      setError(error.message || 'Error creating event');
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
    <option value="">Select Category</option>
    <option value="Seminar">Seminar</option>
    <option value="TED Talk">TED Talk</option>
    <option value="Presentation">Presentation</option>
    <option value="Recreational/Social">Recreational/Social</option>
    <option value="Exhibition">Exhibition</option>
    <option value="Promotion">Promotion</option>
    <option value="Other">Other</option>
  </select>
</div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Date and Time:</label>
          <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Phone:</label>
          <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Email:</label>
          <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} required />
        </div>
        <div>
          <label>University ID:</label>
          <input type="text" name="university_id" value={formData.university_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Admin ID:</label>
          <input type="text" name="admin_id" value={formData.admin_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Is Public:</label>
          <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} />
        </div>
        <div>
          <label>Is RSO Event:</label>
          <input type="checkbox" name="is_rso_event" checked={formData.is_rso_event} onChange={handleChange} />
        </div>
        {formData.is_rso_event && (
          <div>
            <label>RSO ID:</label>
            <input type="text" name="rso_id" value={formData.rso_id} onChange={handleChange} />
          </div>
        )}
        <button type="submit">Create Event</button>
        <Link to="/dashboard">Back to Dashboard</Link>
      </form>
    </div>
  );
};

export default EventCreate;
