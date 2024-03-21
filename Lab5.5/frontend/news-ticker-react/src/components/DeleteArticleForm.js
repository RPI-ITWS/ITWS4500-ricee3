import './style.css';
import React, { useState } from 'react';

const DeleteArticleForm = ({ onDelete }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDelete(id);
    setId('');
  };

  return (
    <div className="col-md-5">
      <h4>Delete Article by ID</h4>
      <form onSubmit={handleSubmit}>
        <input type="number" value={id} onChange={e => setId(e.target.value)} className="form-control" placeholder="Article ID" />
        <button type="submit" className="btn btn-danger">Delete by ID</button>
      </form>
    </div>
  );
};

export default DeleteArticleForm;
