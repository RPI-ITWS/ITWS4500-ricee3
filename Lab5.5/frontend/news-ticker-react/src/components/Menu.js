import './style.css';
import React from 'react';

const Menu = ({ onCategoryChange }) => {
  const categories = ['all', 'health', 'finance', 'food', 'sports', 'tech'];

  return (
    <div id="menu" className="row">
      <div className="col-6">
        <h2>Team 9 News Ticker</h2>
      </div>
      <div className="col-6" id="category-buttons">
        {categories.map(cat => (
          <div key={cat} className={`button ${cat}`} onClick={() => onCategoryChange(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
