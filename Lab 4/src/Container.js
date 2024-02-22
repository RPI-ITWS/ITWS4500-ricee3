import React, { useState } from 'react';
import Button from './Button.js';

const Container = () => {
  const [content, setContent] = useState('Click the button to get URL');

  const handleButtonClick = (url) => {
    console.log('Button clicked!');
    console.log('URL:', url);

    // Make API call here and log the result
  };

  return (
    <div>
      <h2>{content}</h2>
      <Button onClick={handleButtonClick} />
    </div>
  );
};

export default Container;
