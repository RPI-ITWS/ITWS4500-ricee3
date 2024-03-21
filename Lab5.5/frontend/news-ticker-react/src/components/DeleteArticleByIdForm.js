import './style.css';
import React, { useState } from 'react';

function DeleteArticleByIdForm({ onDeleteById }) {
  const [articleId, setArticleId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeleteById(articleId);
    setArticleId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Delete Article by ID</h4>
      <input
        type="number"
        value={articleId}
        onChange={(e) => setArticleId(e.target.value)}
        className="form-control"
        placeholder="Article ID"
      />
      <button type="submit" className="btn btn-danger">Delete by ID</button>
    </form>
  );
}

export default DeleteArticleByIdForm;
