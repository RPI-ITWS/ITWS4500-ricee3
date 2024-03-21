import React, { useState } from 'react';
import axios from 'axios';

function DatabaseComponent() {
    const [number, setNumber] = useState('');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState('');

    const handleGet = async () => {
        try {
            const res = await axios.get(`/db/${number}`);
            setResponse(res.data);
        } catch (error) {
            setResponse(error.response.data.message);
        }
    };

    // Implement handlers for other HTTP verbs (POST, PUT, DELETE)

    return (
        <div>
            <input type="text" value={number} onChange={e => setNumber(e.target.value)} />
            <textarea value={body} onChange={e => setBody(e.target.value)}></textarea>
            <button onClick={handleGet}>GET</button>
            {/* Implement buttons for other HTTP verbs */}
            <div>{response}</div>
        </div>
    );
}

export default DatabaseComponent;
