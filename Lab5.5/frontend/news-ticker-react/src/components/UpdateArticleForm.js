import './style.css';
import React, { useState } from 'react';

const UpdateArticleForm = ({ onUpdate }) => {
  const [id, setId] = useState('');
  const [Title, setTitle] = useState('');
  const [Link, setLink] = useState('');
  const [Description, setDescription] = useState('');
  const [Date, setDate] = useState('');
  const [Category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ id, Title, Link, Description, Date, Category });
  };

  return (
    <div className="col-md-5">
      <h4>Update Article by ID</h4>
      <form onSubmit={handleSubmit}>
        <input type="number" value={id} onChange={e => setId(e.target.value)} className="form-control" placeholder="Article ID" />
        <input type="text" value={Title} onChange={e => setTitle(e.target.value)} className="form-control" placeholder="New Title" />
        <input type="text" value={Link} onChange={e => setLink(e.target.value)} className="form-control" placeholder="New Link" />
        <input type="text" value={Description} onChange={e => setDescription(e.target.value)} className="form-control" placeholder="New Description" />
        <input type="text" value={Date} onChange={e => setDate(e.target.value)} className="form-control" placeholder="New Date" />
        <input type="text" value={Category} onChange={e => setCategory(e.target.value)} className="form-control" placeholder="New Category" />
        <button type="submit" className="btn btn-info">Update by ID</button>
      </form>
    </div>
  );
};

export default UpdateArticleForm;
