import React from 'react';

export default function Button( { sendDataToParent, buttonText, url } ) {
  const send_data = () => {
    sendDataToParent(url);
  }

  return ( <button class="btn btn-blue" onClick={send_data}>{buttonText}</button> );
}