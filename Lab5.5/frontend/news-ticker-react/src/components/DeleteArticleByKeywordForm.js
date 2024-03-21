import './style.css';
import React, { useState } from 'react';

const DeleteArticleByKeywordForm = ({ onDeleteByKeyword }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeleteByKeyword(keyword);
    setKeyword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Delete Article by Keyword</h4>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        placeholder="Keyword"
      />
      <button type="submit" className="btn btn-danger">Delete by Keyword</button>
    </form>
  );
};

export default DeleteArticleByKeywordForm;
