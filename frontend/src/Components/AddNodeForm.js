// AddNodeForm.js
import React, { useState } from 'react';

function AddNodeForm({ onAddServer, onAddKey, onRemove }) {
    const [degree, setDegree] = useState('');
    const [type, setType] = useState('server'); // "server" or "key"

    const handleAdd = (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        if (type === 'server') {
            onAddServer(degree);
        } else {
            onAddKey(degree);
        }
        setDegree(''); // Reset input field after submission
    };

    const handleRemove = (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        onRemove(degree, type);
        setDegree(''); // Reset input field after removal
    };

    return (
        <form>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="server">Server</option>
                <option value="key">Key</option>
            </select>
            <input
                type="number"
                value={degree}
                min="0"
                max="360"
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Enter degree (0-360)"
            />
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleRemove}>Remove</button>
        </form>
    );
}
export default AddNodeForm;
