import { useState } from 'react';
import './CommentForm.css';
import { useEffect } from 'react';
import { addComment } from '../services/castApi';

const CommentForm = ({ playerId, onCommentSubmit }) => {
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
    setComment('');
  }, [playerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      setMessage('Please enter a comment');
      return;
    }

    try {
      await addComment(playerId, comment);
      setMessage('Comment added successfully');
      setComment('');
    } catch (error) {
      setMessage('Error adding comment', error.message);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        rows="4"
        required
      />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CommentForm;
