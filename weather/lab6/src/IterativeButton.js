import React from 'react';

export default function Button( { sendDataToParent, buttonText, iterate } ) {
  const send_data = () => {
    sendDataToParent(iterate);
  }

  return ( <button class="btn btn-green" onClick={send_data}>{buttonText}</button> );
}