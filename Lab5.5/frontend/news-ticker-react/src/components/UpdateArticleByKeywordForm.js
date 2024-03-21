import './style.css';
import React, { useState } from 'react';

function UpdateArticleByKeywordForm({ onUpdateByKeyword }) {
  const [keyword, setKeyword] = useState('');
  const [localIndex, setLocalIndex] = useState('');
  const [apiIndex, setApiIndex] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateByKeyword(keyword, localIndex, apiIndex);
    setKeyword('');
    setLocalIndex('');
    setApiIndex('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Update by Keyword</h4>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        placeholder="Keyword for Update"
      />
      <input
        type="number"
        value={localIndex}
        onChange={(e) => setLocalIndex(e.target.value)}
        className="form-control"
        placeholder="Local Index"
      />
      <input
        type="number"
        value={apiIndex}
        onChange={(e) => setApiIndex(e.target.value)}
        className="form-control"
        placeholder="API Index"
      />
      <button type="submit" className="btn btn-success">Update by Keyword</button>
    </form>
  );
}

export default UpdateArticleByKeywordForm;
