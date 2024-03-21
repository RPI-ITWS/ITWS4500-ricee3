import './style.css';
import React, { useState } from 'react';

function AddArticleByKeywordForm({ onAddByKeyword }) {
  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddByKeyword(keyword, index);
    setKeyword('');
    setIndex('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Article by Keyword</h4>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        placeholder="Keyword"
      />
      <input
        type="number"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        className="form-control"
        placeholder="Index"
      />
      <button type="submit" className="btn btn-secondary">Add by Keyword</button>
    </form>
  );
}

export default AddArticleByKeywordForm;
