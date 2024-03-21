import './style.css';

import React, { useState, useEffect } from 'react';
import Article from './Article';

const Articles = ({ articles, currentCategory }) => {
  const [displayedArticles, setDisplayedArticles] = useState([]);

  const visibleCount = 10;

  useEffect(() => {
    const filtered = articles.filter(article =>
      currentCategory === 'all' || (article.Category && article.Category.toLowerCase() === currentCategory.toLowerCase())
    );
    setDisplayedArticles(filtered.slice(0, visibleCount));
  }, [articles, currentCategory, visibleCount]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedArticles((prevDisplayed) => {
        const totalArticles = articles.filter(article =>
          currentCategory === 'all' || (article.Category && article.Category.toLowerCase() === currentCategory.toLowerCase())
        );
        const startIndex = (articles.indexOf(prevDisplayed[prevDisplayed.length - 1]) + 1) % articles.length;
        const nextArticles = [];
        for (let i = 0; i < visibleCount; i++) {
          nextArticles.push(totalArticles[(startIndex + i) % totalArticles.length]);
        }
        return nextArticles;
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [articles, currentCategory, visibleCount]);

  return (
    <div id="articles-container" className="row">
      {displayedArticles.map((article, index) => (
        <Article key={index} article={article} />
      ))}
    </div>
  );
};

export default Articles;
