import React, { useState } from 'react';

const CreateComment = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    content: '',
    rating: '',
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
      const response = await fetch('http://localhost:5000/create_comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating comment');
      }

      const data = await response.json();
      setSuccessMessage(data.message);

      setFormData({
        user_id: '',
        event_id: '',
        content: '',
        rating: '',
      });
    } catch (error) {
      setError('Error creating comment');
    }
  };

  return (
    <div>
      <h2>Create Comment</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Event ID:</label>
          <input type="text" name="event_id" value={formData.event_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Content:</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required />
        </div>
        <div>
          <label>Rating:</label>
          <input type="text" name="rating" value={formData.rating} onChange={handleChange} required />
        </div>
        <button type="submit">Create Comment</button>
      </form>
    </div>
  );
};

export default CreateComment;
