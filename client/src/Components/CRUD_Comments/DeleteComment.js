import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DeleteComment = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserComments();
  }, []);

  const fetchUserComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_user_comments/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error fetching user comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      setError('Error fetching user comments');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_comment/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error deleting comment');
      }
      setSuccessMessage('Comment deleted successfully');
      fetchUserComments();
    } catch (error) {
      setError('Error deleting comment');
    }
  };

  const handleEdit = (commentId, content, rating) => {
    setEditCommentId(commentId);
    setEditedComment(content);
    setEditedRating(rating);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/edit_comment/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editedComment, rating: editedRating })
      });
      if (!response.ok) {
        throw new Error('Error updating comment');
      }
      setSuccessMessage('Comment updated successfully');
      setEditCommentId(null);
      fetchUserComments();
    } catch (error) {
      setError('Error updating comment');
    }
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditedComment('');
    setEditedRating('');
  };

  return (
    <div>
      <h2>All Comments Made</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.comment_id}>
            <strong>Event Name:</strong> {comment.event_name}<br />
            {editCommentId === comment.comment_id ? (
              <div>
                <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} /><br />
                <select value={editedRating} onChange={(e) => setEditedRating(e.target.value)}>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>Comment:</strong> {comment.content}<br />
                <strong>Rating:</strong> {comment.rating}<br />
                {userId == userId && (
                  <div>
                    <button onClick={() => handleDelete(comment.comment_id)}>Delete</button>
                    <button onClick={() => handleEdit(comment.comment_id, comment.content, comment.rating)}>Edit</button>
                  </div>
                )}
              </div>
            )}
            <hr />
          </li>
        ))}
      </ul>
      <Link to="/eventlist">Back to Event List</Link>
    </div>
  );
};

export default DeleteComment;
