import React, { useState, useEffect } from 'react';

const ReadComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_allcomments');
        if (!response.ok) {
          throw new Error('Error fetching comments');
        }
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.comment_id}>
            <strong>Event ID:</strong> {comment.event_id}<br />
            <strong>Comment:</strong> {comment.content}<br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadComments;
