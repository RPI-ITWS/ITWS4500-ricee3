import './style.css';
import React, { useState } from 'react';

const AddArticleForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, link, description, date, category });
    setTitle('');
    setLink('');
    setDescription('');
    setDate('');
    setCategory('');
  };

  return (
    <div className="col-md-5">
      <h4>Add Article</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-control" placeholder="Title" />
        <input type="text" value={link} onChange={e => setLink(e.target.value)} className="form-control" placeholder="Link" />
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="form-control" placeholder="Description" />
        <input type="text" value={date} onChange={e => setDate(e.target.value)} className="form-control" placeholder="Date" />
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="form-control" placeholder="Category" />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
    </div>
  );
};

export default AddArticleForm;
