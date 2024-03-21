import './style.css';
import React from 'react';

const Article = ({ article }) => (
  <div className={`article ${article.Category.toLowerCase()}`}>
    <h3>{article.Title}</h3>
    <p><small>Published on: {article.Date}</small></p>
    <p>{article.Description}</p>
    <a href={article.Link} target="_blank" rel="noopener noreferrer">View</a>
  </div>
);

export default Article;
