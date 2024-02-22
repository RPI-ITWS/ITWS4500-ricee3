// Button.js
import React from 'react';

const Button = ({ onClick }) => {
  const handleClick = async () => {
    try {
      // Replace this URL with your actual API endpoint for currency information
      const response = await fetch('http://localhost:3000/?stockIdInput=aapl');
      if (!response.ok) {
        throw new Error('Failed to fetch currency information');
      }
      const data = await response.json();
      onClick(data.currency); // Assuming the API response has a 'currency' field
    } catch (error) {
      console.error('Error fetching currency information:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      Click me to get currency info for AAPL
    </button>
  );
};

export default Button;
