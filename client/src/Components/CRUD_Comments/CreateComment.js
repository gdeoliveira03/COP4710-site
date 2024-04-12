import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateComment = () => {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    user_id: userId,
    event_id: '',
    content: '',
    rating: 0,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 

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
        rating: 0,
      });

    } catch (error) {
      setError('Error creating comment');
    }
  };

  const handleBackToEventList = () => {
    navigate('/EventList');
  };

  const handleRatingChange = (rating) => {
    setFormData(prevState => ({
      ...prevState,
      rating: parseInt(rating) // Convert rating to integer
    }));
  };

  return (
    <div>
      <h2>Create Comment</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <select name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="0">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <button type="submit">Create Comment</button>
        <button type="button" onClick={handleBackToEventList}>Back to Event List</button>
      </form>
    </div>
  );
};

export default CreateComment;
