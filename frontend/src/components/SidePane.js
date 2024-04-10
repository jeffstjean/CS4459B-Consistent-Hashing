import React, { useState } from 'react';
import './SidePane.css';
import ServerDetails from './ServerDetails';

function SidePane({ onAddData, onActivateNode, onDeactivateNode, server }) {
  const [keyValue, setKeyValue] = useState({ key: '', value: '' });
  const [error, setError] = useState(null);
  const [resultValue, setResultValue] = useState(null);
  const [serverName, setServerName] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKeyValue((prevKeyValue) => ({
      ...prevKeyValue,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { key, value } = keyValue;

    if (!key.trim() || !value.trim()) {
      setError('Please enter both key and value.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
      });

      if (!response.ok) {
        throw new Error('Failed to add data');
      }

      const responseData = await response.json();

      // Update parent component's state with hashed value
      onAddData(responseData);

      // Clear input fields after successful submission
      setKeyValue({ key: '', value: '' });
      setError(null); // Reset error state
    } catch (error) {
      setError('Error adding data: ' + error.message);
    }
  };

  const handleGetValue = async () => {
    const { key } = keyValue;

    if (!key.trim()) {
      setError('Please enter a key.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/data?key=${key}`);

      if (!response.ok) {
        throw new Error('Failed to retrieve data');
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log the response data to console
      setResultValue(responseData.value || 'Not found'); // Update result value or show 'Not found' message
      setError(null); // Reset error state
    } catch (error) {
      setError('Error retrieving data: ' + error.message);
    }
  };

  return (
    <div className="side-pane">
      <h2>Consistent Hashing Learning Tool</h2>
      {error && <p className="error">{error}</p>}
      <h3>Input data</h3>
      <div className="input-container">
        <label>Key:</label>
        <input
          type="text"
          name="key"
          value={keyValue.key}
          onChange={handleChange}
          placeholder="Enter key..."
        />
      </div>
      <div className="input-container">
        <label>Value:</label>
        <input
          type="text"
          name="value"
          value={keyValue.value}
          onChange={handleChange}
          placeholder="Enter value..."
        />
      </div>
      <button onClick={handleSubmit}>Add Data</button>
      <h3>Add or remove a node</h3>

      <label>
        Node Name:
        <input type="text" value={serverName} onChange={(e) => setServerName(e.target.value)} />
      </label>
      <div className="button-group">
        <button onClick={() => onActivateNode(serverName)}>Add Node</button>
        <button onClick={() => onDeactivateNode(serverName)}>Remove Node</button>
      </div>
      
      {server && <ServerDetails server={server} />}
    </div>
  );
}

export default SidePane;
