import React, { useState, useEffect } from 'react';

const ReadComments = ({ eventId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_comments/${eventId}`);
      if (!response.ok) {
        throw new Error('Error fetching comments');
      }
      const data = await response.json();
      setComments(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching comments');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Comments for Event {eventId}</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.comment_id}>
            <p><strong>User ID:</strong> {comment.user_id}</p>
            <p><strong>Content:</strong> {comment.content}</p>
            <p><strong>Rating:</strong> {comment.rating}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadComments;
