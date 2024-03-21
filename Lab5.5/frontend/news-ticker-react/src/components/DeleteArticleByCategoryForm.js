import './style.css';
import React, { useState } from 'react';

const DeleteArticleByCategoryForm = ({ onDeleteByCategory }) => {
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeleteByCategory(category);
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Delete Article by Category</h4>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="form-control"
        placeholder="Category"
      />
      <button type="submit" className="btn btn-danger">Delete by Category</button>
    </form>
  );
};

export default DeleteArticleByCategoryForm;
