import React, { useState } from 'react';

const DeleteComment = ({ commentId }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/delete_comment/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error deleting comment');
      }
      setSuccessMessage('Comment deleted successfully');
    } catch (error) {
      setError('Error deleting comment');
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Comment</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteComment;
