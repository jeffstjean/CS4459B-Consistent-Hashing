import React, { useState } from 'react';
import './SidePane.css';

function SidePane({ onAddData, onActivateNode, onDeactivateNode }) {
  const [keyValue, setKeyValue] = useState({ key: '', value: '' });
  const [error, setError] = useState(null);

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
      setKeyValue({ key: '', value: '' });
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

  return (
    <div className="side-pane">
      <h2>Data Input</h2>
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
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>Add Data</button>
      <div className="button-group">
        <button onClick={onActivateNode}>Add Node</button>
        <button onClick={onDeactivateNode}>Remove Node</button>
      </div>
    </div>
  );
}

export default SidePane;
